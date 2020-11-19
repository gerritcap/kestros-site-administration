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

/**
 * Baseline element within a tabs container. Extended by Tab, and TabContents.
 */
export class TabsElement extends InteractiveElement {
  /**
   * Index of the tab element.
   *
   * @returns {number} Index of the tab element.
   */
  get tabIndex () {
    let i = 0
    let element = this.element
    while ((element = element.previousElementSibling) != null) {
      ++i
    }
    return i
  }

  /**
   * TabContainer element.
   *
   * @returns {null|*|Element} TabContainer element.
   */
  get containerElement () {
    return this.element.closest('.tabs-container')
  }

  /**
   * Tab identifier.
   *
   * @returns {string} * Tab identifier.
   */
  get name () {
    return this.element.dataset.name
  }

  /**
   * Tab container identifier.
   *
   * @returns {string|undefined} Tab container identifier.
   */
  get containerName () {
    if (this.containerElement !== null && typeof this.containerElement !== 'undefined') {
      return this.containerElement.dataset.name
    } else {
      return undefined
    }
  }
}
