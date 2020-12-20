/*
~      Copyright (C) 2020  Kestros, Inc.
~
~     This program is free software: you can redistribute it and/or modify
~     it under the terms of the GNU General Public License as published by
~     the Free Software Foundation, either version 3 of the License, or
~     (at your option) any later version.
~
~     This program is distributed in the hope that it will be useful,
~     but WITHOUT ANY WARRANTY; without even the implied warranty of
~     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
~     GNU General Public License for more details.
~
~     You should have received a copy of the GNU General Public License
~     along with this program.  If not, see <https://www.gnu.org/licenses/>.
~
*/

/**
 * Individual navigation element within a Tree.
 */
class TreeLeaf extends InteractiveElement {
  /**
   * Constructs TreeLeaf from an element.
   *
   * @param {HTMLElement} element - Element to construct the TreeLeaf from.
   */
  constructor(element) {
    super(element);

    if (this.hasChildren) {
      if (this.leafIconElement !== null) {
        for (const iconClass of this.folderIcon.split(/\s+/)) {
          this.leafIconElement.classList.add(iconClass);
        }
      }
      if (!this.element.classList.contains(TreeLeaf.classes.HAS_CHILDREN)) {
        this.element.classList.add(TreeLeaf.classes.HAS_CHILDREN);
      }
    } else {
      if (this.leafIconElement !== null) {
        for (const iconClass of this.standaloneIcon.split(/\s+/)) {
          this.leafIconElement.classList.add(iconClass);
        }
      }
    }
  }

  /**
   * TreeLeaf status classes.
   *
   * @returns {{ACTIVE: string, CLOSED: string, HAS_CHILDREN: string, OPEN: string}} TreeLeaf status classes.
   */
  static get classes() {
    return {
      ACTIVE: 'tree__leaf--active',
      HAS_CHILDREN: 'tree__leaf--has-children',
      OPEN: 'tree__leaf--open',
      CLOSED: 'tree__leaf--closed'
    };
  }

  /**
   * Events that the TreeLeaf listens for.
   *
   * @returns {{DEACTIVATE: string, ACTIVATE: string, CLOSE: string, OPEN: string}} Events that the TreeLeaf listens for.
   */
  static get events() {
    return {
      DEACTIVATE: 'tree-leaf-deactivate',
      ACTIVATE: 'tree-leaf-activate',
      CLOSE: 'tree-leaf-close',
      OPEN: 'tree-leaf-open'
    };
  }

  /**
   * Events the TreeLeaf can dispatch.
   *
   * @returns {{CLOSE_AFTER: string, OPEN_AFTER: string, OPEN_BEFORE: string, ACTIVATE_AFTER: string, DEACTIVATE_AFTER: string, CLOSE_BEFORE: string, DEACTIVATE_BEFORE: string, ACTIVATE_BEFORE: string}} Events the TreeLeaf can dispatch.
   */
  static get dispatchedEvents() {
    return {
      ACTIVATE_BEFORE: 'tree-leaf-activate-before',
      ACTIVATE_AFTER: 'tree-leaf-activate-after',
      DEACTIVATE_BEFORE: 'tree-leaf-deactivate-before',
      DEACTIVATE_AFTER: 'tree-leaf-deactivate-after',
      CLOSE_BEFORE: 'tree-leaf-close-before',
      CLOSE_AFTER: 'tree-leaf-close-after',
      OPEN_BEFORE: 'tree-leaf-open-before',
      OPEN_AFTER: 'tree-leaf-open-after'
    };
  }

  /**
   * Whether the TreeLeaf has children.
   *
   * @returns {boolean} Whether the TreeLeaf has children.
   */
  get hasChildren() {
    return this.childLeaves.length > 0;
  }

  /**
   * Whether the TreeLeaf is open.
   *
   * @returns {boolean} Whether the TreeLeaf is open.
   */
  get isOpen() {
    return this.element.classList.contains(TreeLeaf.classes.OPEN);
  }

  /**
   * Whether the TreeLeaf is active.
   *
   * @returns {boolean} Whether the TreeLeaf is active.
   */
  get isActive() {
    return this.element.classList.contains(TreeLeaf.classes.ACTIVE);
  }

  /**
   * Parent Tree element.
   *
   * @returns {HTMLElement} Parent Tree element.
   */
  get treeElement() {
    return this.element.closest('.tree');
  }

  /**
   * All direct child leaves.
   *
   * @returns {NodeListOf<Element>|*[]} All direct child leaves.
   */
  get childLeaves() {
    if (this.childContainerElement !== null && typeof this.childContainerElement !== 'undefined') {
      return this.childContainerElement.querySelectorAll(':scope > .tree__leaf');
    }
    return [];
  }

  /**
   * Container element for child leaves.
   *
   * @returns {HTMLElement} Container element for child leaves.
   */
  get childContainerElement() {
    return this.element.querySelector('.tree__nested-container');
  }

  /**
   * Toggle Icon element.
   *
   * @returns {HTMLElement} Toggle Icon element.
   */
  get toggleIconElement() {
    return this.element.querySelector('.tree__toggle');
  }

  /**
   * Link element, for setting the item to an active state.
   *
   * @returns {HTMLElement} Link element, for setting the item to an active state.
   */
  get linkElement() {
    return this.element.querySelector('.tree__link');
  }

  /**
   * Active status icon element.
   *
   * @returns {HTMLElement} Active status icon element.
   */
  get activeStatusIconElement() {
    return this.element.querySelector('.tree__status');
  }

  /**
   * Leaf icon element.
   *
   * @returns {HTMLElement} Leaf icon element.
   */
  get leafIconElement() {
    return this.element.querySelector('.tree__leaf-icon');
  }

  /**
   * Icon to display if the leaf has children.
   *
   * @returns {string} Icon to display if the leaf has children.
   */
  get folderIcon() {
    let folderIcon = 'far fa-folder';
    if (this.element.dataset.folderIcon !== null && typeof this.element.dataset.folderIcon !== 'undefined') {
      folderIcon = this.element.dataset.folderIcon;
    } else {
      let parent = this.element.parentElement;
      while (parent !== null && typeof parent !== 'undefined') {
        if (parent.dataset.folderIcon !== null && typeof parent.dataset.folderIcon !== 'undefined') {
          folderIcon = parent.dataset.folderIcon;
          break;
        }
        parent = parent.parentElement;
      }
    }
    return folderIcon;
  }

  /**
   * Icon to display if the leaf does not have children.
   *
   * @returns {string} Icon to display if the leaf does not have children.
   */
  get standaloneIcon() {
    let standaloneIcon = 'far fa-file';
    if (this.element.dataset.standaloneIcon !== null && typeof this.element.dataset.standaloneIcon !== 'undefined') {
      standaloneIcon = this.element.dataset.standaloneIcon;
    } else {
      let parent = this.element.parentElement;
      while (parent !== null && typeof parent !== 'undefined') {
        if (parent.dataset.standaloneIcon !== null && typeof parent.dataset.standaloneIcon !== 'undefined') {
          standaloneIcon = parent.dataset.standaloneIcon;
          break;
        }
        parent = parent.parentElement;
      }
    }
    return standaloneIcon;
  }

  /**
   * Activates the leaf.
   */
  activate() {
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.ACTIVATE_BEFORE));
    this.element.classList.add(TreeLeaf.classes.ACTIVE);
    this.treeElement.dispatchEvent(new CustomEvent(Tree.events.ITEM_ACTIVATED, {
      detail: {
        element: this.element
      }
    }));
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.ACTIVATE_AFTER));
  }

  /**
   * Deactivates the leaf.
   */
  deactivate() {
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.DEACTIVATE_BEFORE));
    this.element.classList.remove(TreeLeaf.classes.ACTIVE);
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.DEACTIVATE_AFTER));
  }

  /**
   * Toggles the open/close state of the leaf.
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Opens the leaf.
   */
  open() {
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.OPEN_BEFORE));
    this.toggleIconElement.classList.add('fa-rotate-90');
    this.element.classList.remove(TreeLeaf.classes.CLOSED);
    this.element.classList.add(TreeLeaf.classes.OPEN);
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.OPEN_AFTER));
  }

  /**
   * Closes the leaf.
   */
  close() {
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.CLOSE_BEFORE));
    this.toggleIconElement.classList.remove('fa-rotate-90');
    this.element.classList.remove(TreeLeaf.classes.OPEN);
    this.element.classList.add(TreeLeaf.classes.CLOSED);
    this.closeAllChildren();
    this.element.dispatchEvent(new CustomEvent(TreeLeaf.dispatchedEvents.CLOSE_AFTER));
  }

  /**
   * Closes all child leaves.
   */
  closeAllChildren() {
    for (const child of this.childLeaves) {
      child.dispatchEvent(new CustomEvent(TreeLeaf.events.CLOSE));
    }
  }

  /**
   * Registers TreeLeaf event listeners.
   */
  registerEventListeners() {
    super.registerEventListeners();

    this.element.addEventListener(TreeLeaf.events.DEACTIVATE, event => {
      this.deactivate();
    });

    this.element.addEventListener(TreeLeaf.events.ACTIVATE, event => {
      this.activate();
    });

    this.element.addEventListener(TreeLeaf.events.OPEN, event => {
      this.open();
    });

    this.element.addEventListener(TreeLeaf.events.CLOSE, event => {
      this.close();
    });

    this.toggleIconElement.addEventListener('click', () => {
      this.toggle();
    });

    this.linkElement.addEventListener('click', () => {
      this.activate();
    });
  }
}