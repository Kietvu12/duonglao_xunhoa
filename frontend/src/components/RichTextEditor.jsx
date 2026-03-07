import { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $isHeadingNode } from '@lexical/rich-text';
import { ListItemNode, ListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { LinkNode, $createLinkNode } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $isImageNode } from './ImageNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes, $isParagraphNode, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, $createTextNode } from 'lexical';
import { $createParagraphNode } from 'lexical';
import { ImageNode, $createImageNode } from './ImageNode';
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

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

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
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
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
        
        // Normalize image URL to ensure it works correctly
        const normalizedUrl = normalizeImageUrl(imageUrl);
        if (normalizedUrl) {
          imageUrl = normalizedUrl;
        }

        console.log('Uploaded image URL:', imageUrl);

        // Insert image using Lexical ImageNode
        editor.update(() => {
          const imageNode = $createImageNode(imageUrl, 'image');
          const root = $getRoot();
          
          // Get the last child
          const lastChild = root.getLastChild();
          
          // If last child is a paragraph, insert image after it
          if (lastChild && $isParagraphNode(lastChild)) {
            lastChild.insertAfter(imageNode);
          } else {
            // Otherwise append to root
            root.append(imageNode);
          }
          
          // Add a new paragraph after image for continued editing
          const newParagraph = $createParagraphNode();
          root.append(newParagraph);
        });
      } catch (error) {
        alert('Lỗi khi upload ảnh: ' + error.message);
      }
    };
  };

  const insertLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          const linkNode = $createLinkNode(url, { target: '_blank' });
          selection.insertNodes([linkNode]);
        }
      });
    }
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

  return (
    <div className="toolbar">
      <div className="toolbar-hint" style={{ fontSize: '12px', color: '#666', padding: '0 8px', fontStyle: 'italic' }}>
        💡 Mẹo: Bạn có thể paste ảnh trực tiếp vào editor (Ctrl+V)
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={() => insertHeading(1)} className="toolbar-btn" title="Heading 1">
          H1
        </button>
        <button type="button" onClick={() => insertHeading(2)} className="toolbar-btn" title="Heading 2">
          H2
        </button>
        <button type="button" onClick={() => insertHeading(3)} className="toolbar-btn" title="Heading 3">
          H3
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={() => formatText('bold')} className="toolbar-btn" title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => formatText('italic')} className="toolbar-btn" title="Italic">
          <em>I</em>
        </button>
        <button type="button" onClick={() => formatText('underline')} className="toolbar-btn" title="Underline">
          <u>U</u>
        </button>
        <button type="button" onClick={() => formatText('strikethrough')} className="toolbar-btn" title="Strikethrough">
          <s>S</s>
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={() => formatAlignment('left')} className="toolbar-btn" title="Align Left">
          ⬅
        </button>
        <button type="button" onClick={() => formatAlignment('center')} className="toolbar-btn" title="Align Center">
          ⬌
        </button>
        <button type="button" onClick={() => formatAlignment('right')} className="toolbar-btn" title="Align Right">
          ➡
        </button>
        <button type="button" onClick={() => formatAlignment('justify')} className="toolbar-btn" title="Justify">
          ⬌⬌
        </button>
      </div>
      <div className="toolbar-group">
        <button 
          type="button" 
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} 
          className="toolbar-btn" 
          title="Bullet List"
        >
          •
        </button>
        <button 
          type="button" 
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} 
          className="toolbar-btn" 
          title="Numbered List"
        >
          1.
        </button>
        <button type="button" onClick={insertQuote} className="toolbar-btn" title="Quote">
          "
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={insertImage} className="toolbar-btn" title="Insert Image">
          📷
        </button>
        <button type="button" onClick={insertLink} className="toolbar-btn" title="Insert Link">
          🔗
        </button>
      </div>
    </div>
  );
}

// Plugin to sync editor content with parent component
function OnChangePlugin({ onChange, editorContentRef }) {
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
  }, [editor, onChange, editorContentRef]);

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
            // Lưu vị trí insert trước khi upload (vì upload là async)
            let insertTargetNode = null;
            let insertAfter = true;
            
            editor.getEditorState().read(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                insertTargetNode = anchorNode;
              }
            });
            
            // Upload image
            const response = await uploadAPI.uploadMedia(file);
            let imageUrl = response.data.url;
            
            // Normalize image URL
            const normalizedUrl = normalizeImageUrl(imageUrl);
            if (normalizedUrl) {
              imageUrl = normalizedUrl;
            }

            // Insert image vào editor tại vị trí đã lưu
            editor.update(() => {
              const imageNode = $createImageNode(imageUrl, 'Pasted image');
              const newParagraph = $createParagraphNode();
              
              if (insertTargetNode && insertTargetNode.isAttached()) {
                // Insert sau node đã lưu
                const parent = insertTargetNode.getParent();
                if (parent) {
                  insertTargetNode.insertAfter(imageNode);
                  imageNode.insertAfter(newParagraph);
                  newParagraph.select();
                  return;
                }
              }
              
              // Fallback: thử lấy selection hiện tại
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertNodes([imageNode]);
                imageNode.insertAfter(newParagraph);
                newParagraph.select();
              } else {
                // Cuối cùng: append vào cuối
                const root = $getRoot();
                root.append(imageNode);
                root.append(newParagraph);
                newParagraph.select();
              }
            });
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

// Plugin to set initial content
function InitialContentPlugin({ initialContent, editorContentRef }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);
  const lastContentRef = useRef('');

  useEffect(() => {
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
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialContent, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            root.append(...nodes);
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
  }, [editor, initialContent, editorContentRef]);

  return null;
}

const theme = {
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  list: {
    listitem: 'ml-4',
    nested: {
      listitem: 'list-none',
    },
  },
};

export default function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung bài viết...' }) {
  const editorContentRef = useRef('');

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
          <PasteImagePlugin />
          <OnChangePlugin onChange={onChange} editorContentRef={editorContentRef} />
          <InitialContentPlugin initialContent={value} editorContentRef={editorContentRef} />
        </div>
      </LexicalComposer>
    </div>
  );
}
