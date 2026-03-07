import { DecoratorNode } from 'lexical';
import { createElement } from 'react';

export class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src, altText, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  createDOM() {
    const div = document.createElement('div');
    div.style.display = 'block';
    div.style.margin = '16px 0';
    div.style.textAlign = 'center';
    return div;
  }

  updateDOM() {
    return false;
  }

  static importDOM() {
    return {
      img: () => ({
        conversion: (domNode) => {
          const { src, alt } = domNode;
          const node = new ImageNode(src, alt || '');
          return { node };
        },
        priority: 0,
      }),
    };
  }

  static importJSON(serializedNode) {
    const { src, altText } = serializedNode;
    return new ImageNode(src, altText);
  }

  exportJSON() {
    return {
      src: this.__src,
      altText: this.__altText,
      type: 'image',
      version: 1,
    };
  }

  exportDOM() {
    // Export ImageNode as HTML <img> tag
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('style', 'max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;');
    return { element };
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  setSrc(src) {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAltText(altText) {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  decorate() {
    // DecoratorNode.decorate() must return a React element
    return createElement('img', {
      src: this.__src,
      alt: this.__altText,
      style: {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        margin: '10px auto',
        borderRadius: '4px'
      },
      onError: (e) => {
        console.error('Error loading image in editor:', this.__src);
        e.target.style.display = 'none';
      },
      onLoad: () => {
        console.log('Image loaded successfully in editor:', this.__src);
      }
    });
  }
}

export function $createImageNode(src, altText = '') {
  return new ImageNode(src, altText);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
