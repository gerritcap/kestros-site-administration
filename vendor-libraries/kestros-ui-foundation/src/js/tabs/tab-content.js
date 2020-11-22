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

import { TabsElement } from './tabs-element'

/**
 * Tab content element. Shows when the corresponding Tab is selected.
 */
export class TabContent extends TabsElement {
  /**
   * Constructs tab content area. Hides element if tab index is greater than 0.
   *
   * @param {HTMLElement} element - HTML element.
   */
  constructor (element) {
    super(element)
    if (this.tabIndex !== 0) {
      this.hide()
    }
  }

  /**
   * Registers event listeners to show/hide the content.
   */
  registerEventListeners () {
    this.containerElement.addEventListener('tab-activate', event => {
      if (event.detail.container === this.containerName) {
        if (event.detail.name === this.name) {
          this.show()
        } else {
          this.hide()
        }
      }
    })
  }
}
