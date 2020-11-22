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

import { TabsContainer } from '../tabs/tabs-container'

/**
 * Step by step tabbed content.
 */
export class Wizard extends TabsContainer {
  /**
   * Constructs wizard and sets current tab index to 0.
   *
   * @param {HTMLElement} element - Element to construct wizard from.
   */
  constructor (element) {
    super(element)
    this._currentTabIndex = 0
  }

  /**
   * Total number of tabs within the wizard.
   *
   * @returns {number} Total number of tabs within the wizard.
   */
  get tabCount () {
    return this.element.querySelectorAll('.tab').length
  }

  /**
   * Currently selected tab.
   *
   * @returns {number} Currently selected tab.
   */
  get currentTabIndex () {
    return this._currentTabIndex
  }

  /**
   * Sets the currently selected tab index.
   *
   * @param {number} index - Value to set.
   */
  set currentTabIndex (index) {
    this._currentTabIndex = index
  }

  /**
   * Wizard object events.
   *
   * @returns {{WIZARD_PREVIOUS: string, WIZARD_NEXT: string}} Wizard object events.
   */
  static getEvents () {
    return {
      WIZARD_NEXT: 'wizard-next',
      WIZARD_PREVIOUS: 'wizard-previous'
    }
  }

  /**
   * Registers wizard events.
   */
  registerEventListeners () {
    super.registerEventListeners()

    document.addEventListener(Wizard.getEvents().WIZARD_NEXT, (event) => {
      if (event.detail.wizard === this.name) {
        this.selectNextTab()
      }
    })

    document.addEventListener(Wizard.getEvents().WIZARD_PREVIOUS, (event) => {
      if (event.detail.wizard === this.name) {
        this.selectPreviousTab()
      }
    })
  }

  /**
   * Selects next tab.
   */
  selectNextTab () {
    if (this.currentTabIndex !== this.tabCount - 1) {
      this.currentTabIndex = this.currentTabIndex + 1
    }
  }

  /**
   * Selects previous tab.
   */
  selectPreviousTab () {
    if (this.currentTabIndex !== 0) {
      this.currentTabIndex = this.currentTabIndex - 1
    }
  }
}
