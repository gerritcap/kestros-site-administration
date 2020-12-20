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

import { InteractiveElement } from 'dynamic-applications-framework/src/js/interactive-element'
import { TreeLeaf } from './tree-leaf'

/**
 * Generic tree navigation.
 */
export class Tree extends InteractiveElement {
  /**
   * Constructs the tree element.
   *
   * @param {HTMLElement} element - Element to construct as a tree element.
   */
  constructor (element) {
    super(element)
    this._activeItem = null
  }

  /**
   * Events Tree listens for.
   *
   * @returns {{CLOSE_ALL: string, OPEN_ALL: string, ITEM_ACTIVATED: string}} Events Tree listens for.
   */
  static get events () {
    return {
      ITEM_ACTIVATED: 'tree-item-activated',
      CLOSE_ALL: 'tree-close-all',
      OPEN_ALL: 'tree-open-all'
    }
  }

  /**
   * Events Tree elements can dispatch.
   *
   * @returns {{}} Events Tree elements can dispatch.
   */
  static get dispatchedEvents () {
    return {}
  }

  /**
   * Currently active item.
   *
   * @returns {null|*} Currently active item.
   */
  get activeItem () {
    return this._activeItem
  }

  /**
   * Updates the stored active element.
   *
   * @param {HTMLElement} element - Element to set as active item.
   */
  set activeItem (element) {
    this._activeItem = element
  }

  /**
   * Retrieves top level leaf elements.
   *
   * @returns {*} Top level leaf elements.
   */
  get topLevelLeaves () {
    return this.element.querySelectorAll(':scope > .tree__leaf')
  }

  /**
   * Retrieves all leaves.
   *
   * @returns {*} All leaves.
   */
  get allLeaves () {
    return this.element.querySelectorAll('.tree__leaf')
  }

  /**
   * Folder icon class.
   *
   * @returns {string} Folder icon class.
   */
  get folderIcon () {
    return this.element.dataset.folderIcon
  }

  /**
   * Standalone icon class.
   *
   * @returns {string} Standalone icon class.
   */
  get standaloneIcon () {
    return this.element.dataset.standaloneIcon
  }

  /**
   * Opens all leaves.
   */
  openAll () {
    for (const leaf of this.allLeaves) {
      leaf.dispatchEvent(new CustomEvent(TreeLeaf.events.OPEN))
    }
  }

  /**
   * Closes all leaves.
   */
  closeAll () {
    for (const leaf of this.topLevelLeaves) {
      leaf.dispatchEvent(new CustomEvent(TreeLeaf.events.CLOSE))
    }
  }

  /**
   * Registers event listeners.
   */
  registerEventListeners () {
    super.registerEventListeners()

    this.element.addEventListener(Tree.events.ITEM_ACTIVATED, (event) => {
      if (event.detail.element !== this._activeItem) {
        if (this._activeItem !== null) {
          this._activeItem.dispatchEvent(new CustomEvent(TreeLeaf.events.DEACTIVATE))
        }
        this._activeItem = event.detail.element
      }
    })

    this.element.addEventListener(Tree.events.OPEN_ALL, () => {
      this.openAll()
    })
    this.element.addEventListener(Tree.events.CLOSE_ALL, () => {
      this.closeAll()
    })
  }
}
