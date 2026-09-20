/**
 * Minimal Headless DOM Implementation for Zero-Dependency Testing
 *
 * Provides a standards-compliant subset of the DOM for testing renderers headlessly
 * without adding heavy external dependencies (such as jsdom).
 */

class MockClassList {
  constructor(element) {
    this._element = element;
    this._classes = new Set();
  }

  add(...classNames) {
    for (const name of classNames) {
      if (name) this._classes.add(name);
    }
    this._sync();
  }

  remove(...classNames) {
    for (const name of classNames) {
      this._classes.delete(name);
    }
    this._sync();
  }

  contains(className) {
    return this._classes.has(className);
  }

  toggle(className, force) {
    if (force !== undefined) {
      if (force) this.add(className);
      else this.remove(className);
      return force;
    }
    if (this.contains(className)) {
      this.remove(className);
      return false;
    }
    this.add(className);
    return true;
  }

  _sync() {
    this._element._attributes.set('class', Array.from(this._classes).join(' '));
  }

  _updateFromAttribute(value) {
    this._classes.clear();
    if (value) {
      for (const name of value.split(/\s+/)) {
        if (name) this._classes.add(name);
      }
    }
  }
}

export class MockElement {
  constructor(tagName, namespaceURI = 'http://www.w3.org/1999/xhtml') {
    this.tagName = tagName.toUpperCase();
    this.namespaceURI = namespaceURI;
    this._attributes = new Map();
    this.children = [];
    this.parentNode = null;
    this._eventListeners = new Map();
    this.classList = new MockClassList(this);
    this.style = {
      _props: new Map(),
      setProperty(name, val) { this._props.set(name, String(val)); },
      getPropertyValue(name) { return this._props.get(name) || ''; },
    };
    this._textContent = '';
    this.disabled = false;
    this.value = '';
    const naturallyFocusable = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];
    this.tabIndex = naturallyFocusable.includes(this.tagName) ? 0 : -1;
    this.open = false;
  }

  get id() {
    return this.getAttribute('id') || '';
  }

  set id(value) {
    this.setAttribute('id', String(value));
  }

  get textContent() {
    if (this.children.length === 0) return this._textContent;
    return this.children.map((c) => c.textContent).join('');
  }

  set textContent(text) {
    this.children = [];
    this._textContent = String(text ?? '');
  }

  setAttribute(name, value) {
    const valStr = String(value);
    this._attributes.set(name, valStr);
    if (name === 'class') {
      this.classList._updateFromAttribute(valStr);
    }
    if (name === 'disabled') {
      this.disabled = true;
    }
    if (name === 'open') {
      this.open = true;
    }
    if (name === 'value') {
      this.value = valStr;
    }
    if (name === 'tabindex') {
      this.tabIndex = Number(valStr);
    }
  }

  getAttribute(name) {
    return this._attributes.get(name) ?? null;
  }

  hasAttribute(name) {
    return this._attributes.has(name);
  }

  removeAttribute(name) {
    this._attributes.delete(name);
    if (name === 'class') {
      this.classList._updateFromAttribute('');
    }
    if (name === 'disabled') {
      this.disabled = false;
    }
    if (name === 'open') {
      this.open = false;
    }
    if (name === 'tabindex') {
      const naturallyFocusable = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'];
      this.tabIndex = naturallyFocusable.includes(this.tagName) ? 0 : -1;
    }
  }

  appendChild(child) {
    if (!child) return child;
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }

  replaceChildren(...newChildren) {
    for (const child of this.children) {
      child.parentNode = null;
    }
    this.children = [];
    this._textContent = '';
    for (const child of newChildren) {
      if (child) this.appendChild(child);
    }
  }

  addEventListener(type, listener) {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, new Set());
    }
    this._eventListeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    const set = this._eventListeners.get(type);
    if (set) set.delete(listener);
  }

  dispatchEvent(event) {
    event.target = this;
    const listeners = this._eventListeners.get(event.type);
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener.call(this, event);
      }
    }
    return true;
  }

  click() {
    this.dispatchEvent({
      type: 'click',
      target: this,
      defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; },
    });
  }

  focus() {
    this._isFocused = true;
    this.dispatchEvent({ type: 'focus', target: this });
  }

  blur() {
    this._isFocused = false;
    this.dispatchEvent({ type: 'blur', target: this });
  }

  querySelector(selector) {
    const parts = selector.trim().split(/\s+/);
    if (parts.length === 1) {
      return this._find((el) => matchesSelector(el, selector));
    }
    let current = [this];
    for (const part of parts) {
      const next = [];
      for (const el of current) {
        el._findAll((candidate) => matchesSelector(candidate, part), next);
      }
      current = next;
    }
    return current[0] || null;
  }

  querySelectorAll(selector) {
    const parts = selector.trim().split(/\s+/);
    if (parts.length === 1) {
      const results = [];
      this._findAll((el) => matchesSelector(el, selector), results);
      return results;
    }
    let current = [this];
    for (const part of parts) {
      const next = [];
      for (const el of current) {
        el._findAll((candidate) => matchesSelector(candidate, part), next);
      }
      current = next;
    }
    return Array.from(new Set(current));
  }

  _find(predicate) {
    for (const child of this.children) {
      if (predicate(child)) return child;
      const found = child._find(predicate);
      if (found) return found;
    }
    return null;
  }

  _findAll(predicate, results) {
    for (const child of this.children) {
      if (predicate(child)) results.push(child);
      child._findAll(predicate, results);
    }
  }
}

function matchesSelector(element, selector) {
  selector = selector.trim();
  if (selector.startsWith('.')) {
    // Support compound classes like .fraction-bar-segment.shaded
    const classNames = selector.split('.').filter(Boolean);
    return classNames.every((cls) => element.classList.contains(cls));
  }
  if (selector.startsWith('#')) {
    return element.getAttribute('id') === selector.slice(1);
  }
  if (selector.startsWith('[') && selector.endsWith(']')) {
    const attrExpr = selector.slice(1, -1);
    if (attrExpr.includes('=')) {
      const [key, rawVal] = attrExpr.split('=');
      const val = rawVal.replace(/^['"]|['"]$/g, '');
      return element.getAttribute(key.trim()) === val;
    }
    return element.hasAttribute(attrExpr.trim());
  }
  if (selector.includes('.')) {
    const parts = selector.split('.');
    const tag = parts[0];
    const classNames = parts.slice(1).filter(Boolean);
    if (tag && element.tagName.toLowerCase() !== tag.toLowerCase()) {
      return false;
    }
    return classNames.every((cls) => element.classList.contains(cls));
  }
  return element.tagName.toLowerCase() === selector.toLowerCase();
}

export class MockDocument {
  constructor() {
    this.body = new MockElement('body');
  }

  createElement(tagName) {
    return new MockElement(tagName, 'http://www.w3.org/1999/xhtml');
  }

  createElementNS(ns, tagName) {
    return new MockElement(tagName, ns);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }
}

export function setupMockDOM() {
  const doc = new MockDocument();
  globalThis.document = doc;
  return doc;
}

export function teardownMockDOM() {
  delete globalThis.document;
}
