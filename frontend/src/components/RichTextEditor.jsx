import { useEffect, useId, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $isHeadingNode } from '@lexical/rich-text';
import { ListItemNode, ListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { TableNode, TableCellNode, TableRowNode, INSERT_TABLE_COMMAND } from '@lexical/table';
import { LinkNode, $toggleLink, formatUrl } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $isParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  PASTE_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  $setSelection,
  $getNodeByKey,
  $createLineBreakNode,
  $nodesOfType,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { $patchStyleText } from '@lexical/selection';
import { ImageNode, $createImageNode, $isImageNode } from './ImageNode';
import { uploadAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';
import './RichTextEditor.css';

// Helper function to normalize HTML for comparison
function normalizeHTML(html) {
  if (!html) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.innerHTML;
}

/** Giữ focus trong editor khi bấm toolbar (tránh lệnh list/format không chạy). */
function toolbarMouseDown(e) {
  e.preventDefault();
}

const ADJACENT_IMAGES_FIX_TAG = 'adjacent-images-fix';

function isGapParagraph(node) {
  if (!$isParagraphNode(node)) return false;
  return node.getTextContent().replace(/\u200b/g, '').trim() === '';
}

function $createGapParagraph() {
  const paragraph = $createParagraphNode();
  paragraph.append($createLineBreakNode());
  return paragraph;
}

/** Chèn đoạn trống giữa hai ImageNode liền nhau để có thể đặt con trỏ. */
function ensureGapBeforeImage(imageNode) {
  const prev = imageNode.getPreviousSibling();
  if (prev && $isImageNode(prev)) {
    prev.insertAfter($createGapParagraph());
  }
}

/** Quét root và chèn paragraph giữa các ImageNode liền nhau. */
function fixAdjacentImageNodesInRoot() {
  const root = $getRoot();
  let child = root.getFirstChild();
  while (child) {
    const next = child.getNextSibling();
    if ($isImageNode(child) && next && $isImageNode(next)) {
      child.insertAfter($createGapParagraph());
    }
    child = child.getNextSibling();
  }
}

function finalizeImageInsert(imageNode, trailingParagraph) {
  ensureGapBeforeImage(imageNode);
  imageNode.insertAfter(trailingParagraph);
  fixAdjacentImageNodesInRoot();
  trailingParagraph.selectStart();
}

function insertImageRelativeToNode(targetNode, imageNode, trailingParagraph) {
  if ($isImageNode(targetNode)) {
    targetNode.insertAfter(imageNode);
    finalizeImageInsert(imageNode, trailingParagraph);
    return true;
  }

  const topLevel = targetNode.getTopLevelElementOrThrow();

  if ($isImageNode(topLevel)) {
    topLevel.insertAfter(imageNode);
    finalizeImageInsert(imageNode, trailingParagraph);
    return true;
  }

  if (isGapParagraph(topLevel)) {
    topLevel.replace(imageNode);
    finalizeImageInsert(imageNode, trailingParagraph);
    return true;
  }

  return false;
}

/** Chèn ảnh tại vị trí anchor đã lưu (key node) hoặc selection hiện tại. */
function insertImageAtSelection(editor, imageUrl, altText = 'image', savedAnchor = null) {
  editor.update(() => {
    const imageNode = $createImageNode(imageUrl, altText);
    const trailingParagraph = $createGapParagraph();
    let inserted = false;

    if (savedAnchor?.key) {
      const anchorNode = $getNodeByKey(savedAnchor.key);
      if (anchorNode?.isAttached()) {
        inserted = insertImageRelativeToNode(anchorNode, imageNode, trailingParagraph);
      }
    }

    if (!inserted) {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        inserted = insertImageRelativeToNode(anchorNode, imageNode, trailingParagraph);
        if (!inserted) {
          selection.insertNodes([imageNode]);
          finalizeImageInsert(imageNode, trailingParagraph);
          inserted = true;
        }
      }
    }

    if (!inserted) {
      const root = $getRoot();
      const lastChild = root.getLastChild();
      if (lastChild && isGapParagraph(lastChild)) {
        lastChild.replace(imageNode);
      } else if (lastChild) {
        lastChild.insertAfter(imageNode);
        ensureGapBeforeImage(imageNode);
      } else {
        root.append(imageNode);
      }
      finalizeImageInsert(imageNode, trailingParagraph);
    }
  }, { tag: ADJACENT_IMAGES_FIX_TAG });
}

function readSelectionAnchor(editor) {
  let savedAnchor = null;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      savedAnchor = {
        key: selection.anchor.key,
        offset: selection.anchor.offset,
      };
    }
  });
  return savedAnchor;
}

/** Thêm đoạn trống giữa các thẻ img liền nhau khi import HTML. */
function normalizeConsecutiveImagesInHtml(html) {
  if (!html) return html;
  const div = document.createElement('div');
  div.innerHTML = html;

  function walk(container) {
    const children = Array.from(container.childNodes);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType !== Node.ELEMENT_NODE) continue;

      if (child.tagName === 'IMG') {
        let next = child.nextSibling;
        while (next && next.nodeType === Node.TEXT_NODE && !next.textContent.trim()) {
          next = next.nextSibling;
        }
        if (next && next.nodeType === Node.ELEMENT_NODE && next.tagName === 'IMG') {
          const gap = document.createElement('p');
          gap.innerHTML = '<br>';
          container.insertBefore(gap, next);
        }
      } else {
        walk(child);
      }
    }
  }

  walk(div);
  return div.innerHTML;
}

/** Nhận diện HTML từ Word / Outlook để xử lý dán riêng. */
function isWordProcessorHtml(html) {
  if (!html) return false;
  return (
    /mso-|class="?Mso|class='?Mso|Word\.Document|xmlns:w|Microsoft Word|Office:word/i.test(html)
  );
}

/** Giảm nhiễu định dạng Word (mso-*, bọc &lt;b&gt; mặc định, v.v.). */
function sanitizeWordHtml(html) {
  let s = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
  s = s.replace(/<\/?o:p[^>]*>/gi, '');

  const div = document.createElement('div');
  div.innerHTML = s;

  div.querySelectorAll('script, style, meta, link, title').forEach((el) => el.remove());

  div.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('class');
    el.removeAttribute('lang');
    const st = el.getAttribute('style');
    if (!st) return;
    const cleaned = st
      .split(';')
      .map((p) => p.trim())
      .filter((p) => p && !/^mso/i.test(p.split(':')[0]?.trim() || ''))
      .join('; ');
    if (cleaned) el.setAttribute('style', cleaned);
    else el.removeAttribute('style');
  });

  div.querySelectorAll('b, strong').forEach((el) => {
    const st = el.getAttribute('style') || '';
    if (/font-weight:\s*normal|mso-bidi-font-weight:\s*normal/i.test(st)) {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
      }
    }
  });

  div.querySelectorAll('p').forEach((p) => {
    if (p.children.length === 1 && p.children[0].nodeName === 'B') {
      const b = p.children[0];
      if (b.textContent === p.textContent) {
        while (b.firstChild) p.insertBefore(b.firstChild, b);
        p.removeChild(b);
      }
    }
  });

  return div.innerHTML;
}

const FONT_SIZE_MIN = 8;
const FONT_SIZE_MAX = 512;

function parseFontSizeInput(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const n = parseFloat(s.replace(/px$/i, '').replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  const clamped = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, n));
  return `${clamped}px`;
}

const LINE_HEIGHT_MIN = 1;
const LINE_HEIGHT_MAX = 3;

const LINE_HEIGHT_PRESETS = ['1.2', '1.35', '1.5', '1.75', '2', '2.5', '3'];

function parseLineHeightInput(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const n = parseFloat(s.replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  const clamped = Math.min(LINE_HEIGHT_MAX, Math.max(LINE_HEIGHT_MIN, n));
  return String(clamped);
}

const FONT_SIZE_PRESETS = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '40px',
  '48px',
  '56px',
  '64px',
  '72px',
  '96px',
  '128px',
];

function ToolbarIcon({ name, filled = false }) {
  return (
    <span
      className="material-symbols-outlined rte-toolbar-ms"
      aria-hidden
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const fontSizeListId = useId();
  const lineHeightListId = useId();
  const [fontSizeInput, setFontSizeInput] = useState('');
  const [lineHeightInput, setLineHeightInput] = useState('');
  const [textFormats, setTextFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });

  useEffect(() => {
    const readFormatsFromEditorState = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setTextFormats({
          bold: selection.hasFormat('bold'),
          italic: selection.hasFormat('italic'),
          underline: selection.hasFormat('underline'),
          strikethrough: selection.hasFormat('strikethrough'),
        });
      } else {
        setTextFormats({
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
        });
      }
    };

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(readFormatsFromEditorState);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(readFormatsFromEditorState);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertHeading = (level) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          const firstNode = nodes[0];
          if ($isHeadingNode(firstNode)) {
            // If already a heading, change its level
            firstNode.setTag(`h${level}`);
          } else {
            // Wrap selected content in heading
            const heading = $createHeadingNode(`h${level}`);
            selection.insertNodes([heading]);
          }
        } else {
          // No selection, just insert heading
          const heading = $createHeadingNode(`h${level}`);
          selection.insertNodes([heading]);
        }
      }
    });
  };

  const insertImage = async () => {
    const savedAnchor = readSelectionAnchor(editor);

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!imageTypes.includes(file.type)) {
        alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp)');
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 20MB');
        return;
      }

      try {
        const response = await uploadAPI.uploadMedia(file);
        let imageUrl = response.data.url;

        const normalizedUrl = normalizeImageUrl(imageUrl);
        if (normalizedUrl) {
          imageUrl = normalizedUrl;
        }

        insertImageAtSelection(editor, imageUrl, 'image', savedAnchor);
        editor.focus();
      } catch (error) {
        alert('Lỗi khi upload ảnh: ' + error.message);
      } finally {
        input.value = '';
      }
    };
  };

  const insertLink = () => {
    let savedSelection = null;
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        savedSelection = selection.clone();
      }
    });

    if (!savedSelection) {
      alert('Vui lòng bôi đen đoạn chữ cần gắn link trước.');
      return;
    }

    const raw = window.prompt('Nhập URL:', 'https://');
    if (raw == null || !String(raw).trim()) return;

    const url = formatUrl(String(raw).trim());
    editor.update(() => {
      $setSelection(savedSelection);
      $toggleLink(url, { target: '_blank', rel: 'noopener noreferrer' });
    });
    editor.focus();
  };

  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quote = $createQuoteNode();
        selection.insertNodes([quote]);
      }
    });
  };

  const formatAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const applyFontSizeString = (size) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (!size) {
        $patchStyleText(selection, { 'font-size': null });
      } else {
        $patchStyleText(selection, { 'font-size': size });
      }
    });
  };

  const tryApplyFontSize = (showAlertOnInvalid) => {
    const raw = fontSizeInput.trim();
    if (raw === '') {
      applyFontSizeString('');
      return;
    }
    const parsed = parseFontSizeInput(raw);
    if (!parsed) {
      if (showAlertOnInvalid) {
        alert(`Nhập cỡ chữ (${FONT_SIZE_MIN}–${FONT_SIZE_MAX}), ví dụ: 40 hoặc 40px`);
      }
      return;
    }
    applyFontSizeString(parsed);
  };

  const applyLineHeightString = (value) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (!value) {
        $patchStyleText(selection, { 'line-height': null });
      } else {
        $patchStyleText(selection, { 'line-height': value });
      }
    });
  };

  const tryApplyLineHeight = (showAlertOnInvalid) => {
    const raw = lineHeightInput.trim();
    if (raw === '') {
      applyLineHeightString('');
      return;
    }
    const parsed = parseLineHeightInput(raw);
    if (!parsed) {
      if (showAlertOnInvalid) {
        alert(`Giãn dòng: số thập phân ${LINE_HEIGHT_MIN}–${LINE_HEIGHT_MAX} (vd: 1.5 hoặc 2)`);
      }
      return;
    }
    applyLineHeightString(parsed);
  };

  const insertTable = () => {
    const raw = window.prompt('Bảng: số cột × số hàng (vd: 4×3)', '3×3');
    if (raw == null) return;
    const normalized = raw.trim().replace(/\*/g, '×').replace(/x/gi, '×').replace(/X/g, '×');
    const parts = normalized.split('×').map((p) => p.trim());
    if (parts.length !== 2) {
      alert('Nhập đúng dạng: số cột × số hàng (vd: 4×3)');
      return;
    }
    let cols = parseInt(parts[0], 10);
    let rows = parseInt(parts[1], 10);
    if (!Number.isFinite(cols) || !Number.isFinite(rows)) {
      alert('Cột và hàng phải là số nguyên dương');
      return;
    }
    cols = Math.min(20, Math.max(1, cols));
    rows = Math.min(30, Math.max(1, rows));
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: String(cols),
      rows: String(rows),
      includeHeaders: false,
    });
    editor.focus();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-hint" style={{ fontSize: '12px', color: '#666', padding: '0 8px', fontStyle: 'italic' }}>
        💡 Mẹo: Bạn có thể paste ảnh trực tiếp vào editor (Ctrl+V)
      </div>
      <div className="toolbar-group toolbar-font-size-group">
        <input
          type="text"
          inputMode="decimal"
          className="toolbar-font-combo"
          placeholder="Cỡ chữ (px)"
          aria-label="Cỡ chữ"
          title={`Gõ số hoặc chọn gợi ý (${FONT_SIZE_MIN}–${FONT_SIZE_MAX}px). Enter để áp dụng.`}
          value={fontSizeInput}
          list={fontSizeListId}
          onChange={(e) => setFontSizeInput(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          onBlur={() => tryApplyFontSize(false)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              tryApplyFontSize(true);
            }
          }}
        />
        <datalist id={fontSizeListId}>
          {FONT_SIZE_PRESETS.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
        <input
          type="text"
          inputMode="decimal"
          className="toolbar-line-height-combo"
          placeholder="Giãn dòng"
          aria-label="Khoảng cách dòng (line-height)"
          title={`Số ${LINE_HEIGHT_MIN}–${LINE_HEIGHT_MAX} (vd: 1.5). Enter để áp dụng cho đoạn đang chọn.`}
          value={lineHeightInput}
          list={lineHeightListId}
          onChange={(e) => setLineHeightInput(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          onBlur={() => tryApplyLineHeight(false)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              tryApplyLineHeight(true);
            }
          }}
        />
        <datalist id={lineHeightListId}>
          {LINE_HEIGHT_PRESETS.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      </div>
      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => insertHeading(1)}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Tiêu đề 1"
          title="Tiêu đề 1"
        >
          <ToolbarIcon name="looks_one" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => insertHeading(2)}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Tiêu đề 2"
          title="Tiêu đề 2"
        >
          <ToolbarIcon name="looks_two" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => insertHeading(3)}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Tiêu đề 3"
          title="Tiêu đề 3"
        >
          <ToolbarIcon name="looks_3" />
        </button>
      </div>
      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatText('bold')}
          className={`toolbar-btn toolbar-btn-icon${textFormats.bold ? ' toolbar-btn-active' : ''}`}
          aria-label="In đậm"
          title="In đậm"
          aria-pressed={textFormats.bold}
        >
          <ToolbarIcon name="format_bold" filled={textFormats.bold} />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatText('italic')}
          className={`toolbar-btn toolbar-btn-icon${textFormats.italic ? ' toolbar-btn-active' : ''}`}
          aria-label="In nghiêng"
          title="In nghiêng"
          aria-pressed={textFormats.italic}
        >
          <ToolbarIcon name="format_italic" filled={textFormats.italic} />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatText('underline')}
          className={`toolbar-btn toolbar-btn-icon${textFormats.underline ? ' toolbar-btn-active' : ''}`}
          aria-label="Gạch chân"
          title="Gạch chân"
          aria-pressed={textFormats.underline}
        >
          <ToolbarIcon name="format_underlined" filled={textFormats.underline} />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatText('strikethrough')}
          className={`toolbar-btn toolbar-btn-icon${textFormats.strikethrough ? ' toolbar-btn-active' : ''}`}
          aria-label="Gạch ngang"
          title="Gạch ngang"
          aria-pressed={textFormats.strikethrough}
        >
          <ToolbarIcon name="strikethrough_s" filled={textFormats.strikethrough} />
        </button>
      </div>
      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatAlignment('left')}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Căn trái"
          title="Căn trái"
        >
          <ToolbarIcon name="format_align_left" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatAlignment('center')}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Căn giữa"
          title="Căn giữa"
        >
          <ToolbarIcon name="format_align_center" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatAlignment('right')}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Căn phải"
          title="Căn phải"
        >
          <ToolbarIcon name="format_align_right" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => formatAlignment('justify')}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Căn đều"
          title="Căn đều"
        >
          <ToolbarIcon name="format_align_justify" />
        </button>
      </div>
      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Danh sách dấu đầu dòng"
          title="Danh sách dấu đầu dòng"
        >
          <ToolbarIcon name="format_list_bulleted" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Danh sách đánh số"
          title="Danh sách đánh số"
        >
          <ToolbarIcon name="format_list_numbered" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={insertQuote}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Trích dẫn"
          title="Trích dẫn"
        >
          <ToolbarIcon name="format_quote" />
        </button>
      </div>
      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={insertTable}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Chèn bảng"
          title="Chèn bảng (cột × hàng)"
        >
          <ToolbarIcon name="table" />
        </button>
      </div>
      <div className="toolbar-group">
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={insertImage}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Chèn ảnh"
          title="Chèn ảnh"
        >
          <ToolbarIcon name="add_photo_alternate" />
        </button>
        <button
          type="button"
          onMouseDown={toolbarMouseDown}
          onClick={insertLink}
          className="toolbar-btn toolbar-btn-icon"
          aria-label="Chèn liên kết"
          title="Chèn liên kết"
        >
          <ToolbarIcon name="link" />
        </button>
      </div>
    </div>
  );
}

// Plugin to sync editor content with parent component
function OnChangePlugin({ onChange, editorContentRef, skipHydrateFromParentRef }) {
  const [editor] = useLexicalComposerContext();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleChange = () => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Debounce to avoid too many updates
      timeoutRef.current = setTimeout(() => {
        // Get HTML from editor state using Lexical API
        editor.getEditorState().read(() => {
          try {
            const htmlString = $generateHtmlFromNodes(editor, null);
            
            // Update ref to track current editor content
            if (editorContentRef) {
              editorContentRef.current = htmlString;
            }
            // Tránh InitialContentPlugin reset cả editor khi parent echo lại value (làm mất list/quote sau Enter)
            if (skipHydrateFromParentRef) {
              skipHydrateFromParentRef.current = true;
            }
            onChange(htmlString);
          } catch (e) {
            console.error('Error generating HTML:', e);
          }
        });
      }, 150);
    };

    // Listen to Lexical updates only
    const removeListener = editor.registerUpdateListener(({ editorState, prevEditorState }) => {
      // Only trigger if editor state actually changed
      if (editorState !== prevEditorState) {
        editorState.read(() => {
          handleChange();
        });
      }
    });

    return () => {
      removeListener();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, onChange, editorContentRef, skipHydrateFromParentRef]);

  return null;
}

/** Dán từ Word/Outlook: làm sạch mso-* và chèn HTML qua Lexical (tránh mất định dạng / chữ bị đậm sai). */
function WordPastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent) || !event.clipboardData) return false;
        const html = event.clipboardData.getData('text/html');
        if (!html || !isWordProcessorHtml(html)) return false;

        event.preventDefault();

        const plain = event.clipboardData.getData('text/plain') || '';
        const sanitized = sanitizeWordHtml(html);

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          if (!sanitized.trim()) {
            if (plain) selection.insertText(plain);
            return;
          }

          try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(`<div>${sanitized}</div>`, 'text/html');
            const rootEl = dom.body.firstElementChild || dom.body;
            const nodes = $generateNodesFromDOM(editor, rootEl);
            if (nodes.length > 0) {
              selection.insertNodes(nodes);
            } else if (plain) {
              selection.insertText(plain);
            }
          } catch (err) {
            console.error('Word paste error:', err);
            if (plain) selection.insertText(plain);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}

// Plugin để xử lý paste ảnh từ clipboard
function PasteImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handlePaste = async (event) => {
      const clipboardData = event.clipboardData || window.clipboardData;
      if (!clipboardData) return;

      const items = clipboardData.items;
      if (!items) return;

      // Tìm image trong clipboard
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') === 0) {
          event.preventDefault();
          
          const file = items[i].getAsFile();
          if (!file) continue;

          // Validation
          const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!imageTypes.includes(file.type)) {
            alert('Chỉ cho phép paste ảnh định dạng jpg, png, gif, webp');
            return;
          }

          if (file.size > 20 * 1024 * 1024) {
            alert('Kích thước ảnh không được vượt quá 20MB');
            return;
          }

          try {
            const savedAnchor = readSelectionAnchor(editor);

            const response = await uploadAPI.uploadMedia(file);
            let imageUrl = response.data.url;

            const normalizedUrl = normalizeImageUrl(imageUrl);
            if (normalizedUrl) {
              imageUrl = normalizedUrl;
            }

            insertImageAtSelection(editor, imageUrl, 'Pasted image', savedAnchor);
            editor.focus();
          } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            alert('Lỗi khi upload ảnh: ' + error.message);
          }

          break; // Chỉ xử lý ảnh đầu tiên
        }
      }
    };

    // Lắng nghe paste event trên root element của editor
    const rootElement = editor.getRootElement();
    if (rootElement) {
      rootElement.addEventListener('paste', handlePaste);
      return () => {
        rootElement.removeEventListener('paste', handlePaste);
      };
    }
  }, [editor]);

  return null;
}

/** Tự chèn lại khoảng trống khi người dùng xóa paragraph giữa 2 ảnh. */
function AdjacentImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ tags }) => {
      if (tags.has(ADJACENT_IMAGES_FIX_TAG)) return;

      let needsFix = false;
      editor.getEditorState().read(() => {
        let child = $getRoot().getFirstChild();
        while (child) {
          const next = child.getNextSibling();
          if ($isImageNode(child) && next && $isImageNode(next)) {
            needsFix = true;
            break;
          }
          child = child.getNextSibling();
        }
      });

      if (needsFix) {
        editor.update(() => {
          fixAdjacentImageNodesInRoot();
        }, { tag: ADJACENT_IMAGES_FIX_TAG });
      }
    });
  }, [editor]);

  return null;
}

/** Click vào vùng giữa 2 ảnh liền nhau → tạo khoảng trống và đặt con trỏ. */
function ImageGapClickPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handleMouseDown = (event) => {
      if (event.target.closest('img')) return;

      const images = Array.from(rootElement.querySelectorAll('.editor-input img'));
      for (let i = 0; i < images.length - 1; i += 1) {
        const firstRect = images[i].getBoundingClientRect();
        const secondRect = images[i + 1].getBoundingClientRect();
        const betweenTop = firstRect.bottom - 2;
        const betweenBottom = secondRect.top + 2;

        if (event.clientY >= betweenTop && event.clientY <= betweenBottom) {
          event.preventDefault();
          const src = images[i].getAttribute('src') || '';

          editor.update(() => {
            const imageNodes = $nodesOfType(ImageNode);
            const match = imageNodes.find((node) => node.getSrc() === src);
            if (!match) return;

            let next = match.getNextSibling();
            if ($isImageNode(next)) {
              match.insertAfter($createGapParagraph());
              next = match.getNextSibling();
            }

            if (next && isGapParagraph(next)) {
              next.selectStart();
            }
          }, { tag: ADJACENT_IMAGES_FIX_TAG });

          return;
        }
      }
    };

    const preventFileDrop = (event) => {
      if (event.dataTransfer?.types?.includes('Files')) {
        event.preventDefault();
      }
    };

    rootElement.addEventListener('mousedown', handleMouseDown, true);
    rootElement.addEventListener('dragover', preventFileDrop);
    rootElement.addEventListener('drop', preventFileDrop);

    return () => {
      rootElement.removeEventListener('mousedown', handleMouseDown, true);
      rootElement.removeEventListener('dragover', preventFileDrop);
      rootElement.removeEventListener('drop', preventFileDrop);
    };
  }, [editor]);

  return null;
}

// Plugin to set initial content
function InitialContentPlugin({ initialContent, editorContentRef, skipHydrateFromParentRef }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);
  const lastContentRef = useRef('');

  useEffect(() => {
    if (skipHydrateFromParentRef?.current) {
      skipHydrateFromParentRef.current = false;
      lastContentRef.current = initialContent || '';
      return;
    }

    // Get current editor content
    const currentEditorContent = editorContentRef?.current || '';
    
    // Normalize both contents for comparison
    const normalizedInitial = normalizeHTML(initialContent || '');
    const normalizedEditor = normalizeHTML(currentEditorContent);
    
    // Only update if:
    // 1. Content is defined
    // 2. Content actually changed
    // 3. The change is NOT from editor itself (value prop doesn't match editor content)
    const isExternalChange = normalizedInitial !== normalizedEditor;
    
    if (initialContent !== undefined && initialContent !== lastContentRef.current && isExternalChange) {
      lastContentRef.current = initialContent || '';
      
      if (initialContent) {
        editor.update(() => {
          try {
            const normalizedHtml = normalizeConsecutiveImagesInHtml(initialContent);
            const parser = new DOMParser();
            const dom = parser.parseFromString(normalizedHtml, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom.body);
            const root = $getRoot();
            root.clear();
            root.append(...nodes);
            fixAdjacentImageNodesInRoot();
            isInitialized.current = true;
          } catch (error) {
            console.error('Error setting initial content:', error);
            // Fallback: set innerHTML directly
            const editorElement = editor.getRootElement();
            if (editorElement) {
              const contentEditable = editorElement.querySelector('[contenteditable="true"]');
              if (contentEditable) {
                contentEditable.innerHTML = initialContent;
                isInitialized.current = true;
              }
            }
          }
        });
      } else {
        // Clear content if empty
        editor.update(() => {
          const root = $getRoot();
          root.clear();
        });
      }
    } else if (!isExternalChange) {
      // If content matches editor, update lastContentRef to prevent unnecessary updates
      lastContentRef.current = initialContent || '';
    }
  }, [editor, initialContent, editorContentRef, skipHydrateFromParentRef]);

  return null;
}

const theme = {
  // Không dùng font-bold trên heading: Tailwind sẽ khiến mọi chữ trong H1/H2/H3 trông đậm
  // dù Lexical không bật cờ bold — nút B không sáng và không tắt được "đậm".
  heading: {
    h1: 'text-3xl mb-4 text-gray-900 font-normal',
    h2: 'text-2xl mb-3 text-gray-900 font-normal',
    h3: 'text-xl mb-2 text-gray-900 font-normal',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  list: {
    ul: 'list-disc pl-6 my-2',
    ol: 'list-decimal pl-6 my-2',
    listitem: 'ml-1',
    nested: {
      // Không dùng list-none — dễ làm mất dấu bullet ở danh sách lồng nhau
      listitem: 'list-item',
    },
  },
  table: 'border-collapse w-full my-3 border border-gray-300 text-sm',
  tableCell: 'border border-gray-300 px-2 py-1.5 min-w-[3rem] align-top',
  tableCellHeader: 'border border-gray-300 px-2 py-1.5 bg-gray-100 font-semibold align-top',
  tableRow: '',
};

export default function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung bài viết...' }) {
  const editorContentRef = useRef('');
  const skipHydrateFromParentRef = useRef(false);

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError: (error) => {
      console.error('Lexical error:', error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
      ImageNode,
      TableNode,
      TableCellNode,
      TableRowNode,
    ],
  };

  return (
    <div className="rich-text-editor">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input" />
            }
            placeholder={
              <div className="editor-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <TablePlugin />
          <WordPastePlugin />
          <PasteImagePlugin />
          <AdjacentImagesPlugin />
          <ImageGapClickPlugin />
          <OnChangePlugin
            onChange={onChange}
            editorContentRef={editorContentRef}
            skipHydrateFromParentRef={skipHydrateFromParentRef}
          />
          <InitialContentPlugin
            initialContent={value}
            editorContentRef={editorContentRef}
            skipHydrateFromParentRef={skipHydrateFromParentRef}
          />
        </div>
      </LexicalComposer>
    </div>
  );
}
