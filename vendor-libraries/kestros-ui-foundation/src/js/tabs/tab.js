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

import { TabsContainer } from './tabs-container'

/**
 * Tab, that when clicked, will show the corresponding TabContent.
 */
export class Tab extends TabsElement {
  /**
   * Constructs tab. Sets to active if Tab index is 0.
   *
   * @param {HTMLElement} element - HTML element.
   */
  constructor (element) {
    super(element)
    if (this.tabIndex === 0) {
      this.setActive()
    }
  }

  /**
   * Tab event names.
   *
   * @returns {{TAB_ACTIVATED: string, TAB_DISABLE: string, TAB_DEACTIVATED: string, TAB_ENABLE: string}} - Tab event names.
   */
  static get events () {
    return {
      TAB_ACTIVATED: 'tab-activated',
      TAB_DEACTIVATED: 'tab-deactivated',
      TAB_ENABLE: 'tab-enable',
      TAB_DISABLE: 'tab-disable'
    }
  }

  /**
   * Whether the current tab is active.
   *
   * @returns {boolean} Whether the current tab is active.
   */
  get isActive () {
    return this.element.classList.contains('active')
  }

  /**
   * Helper which builds out event objects for tab selection.
   *
   * @returns {{detail: {container: (string|undefined), name: string}}} Helper which builds out event objects for tab selection.
   */
  get eventDetails () {
    return {
      detail: {
        container: this.containerName,
        name: this.name,
        index: this.tabIndex
      }
    }
  }

  /**
   * Sets the tab to active if the corresponding event is targeting the current tab.
   *
   * @param {object} event - Event.
   */
  activateIfRequested (event) {
    if (event != null && typeof event !== 'undefined' && event.detail !== null &&
        typeof event.detail !== 'undefined') {
      if (event.detail.container === this.containerName) {
        if (event.detail.name === this.name || event.detail.index === this.tabIndex) {
          this.setActive()
        } else {
          this.setInactive()
        }
      }
    }
  }

  /**
   * Sets the tab to inactive if the corresponding event is targeting the current tab.
   *
   * @param {object} event - Event.
   */
  deactivateIfRequested (event) {
    if (event !== null && typeof event !== 'undefined' && event.detail !== null &&
        typeof event.detail !== 'undefined') {
      if (event.detail.container === this.containerName) {
        if (event.detail.name === this.name || event.detail.index ===
            this.tabIndex) {
          this.setInactive()
        }
      }
    }
  }

  /**
   * Enables tab if event corresponds to the current tab.
   *
   * @param {object} event - Event.
   */
  enableIfRequested (event) {
    if (event !== null && typeof event !== 'undefined' && event.detail !== null &&
        typeof event.detail !== 'undefined') {
      if (event.detail.container === this.containerName && (event.detail.name ===
          this.name || event.detail.index === this.tabIndex)) {
        this.enable()
      }
    }
  }

  /**
   * Disables tab if event corresponds to the current tab.
   *
   * @param {object} event - Event.
   */
  disableIfRequested (event) {
    if (event !== null && typeof event !== 'undefined' && event.detail !== null &&
        typeof event.detail !== 'undefined') {
      if (event.detail.container === this.containerName && (event.detail.name ===
          this.name || event.detail.index === this.tabIndex)) {
        this.disable()
      }
    }
  }

  /**
   * Registers tab event listeners.
   */
  registerEventListeners () {
    document.addEventListener('tab-activate', event => {
      this.activateIfRequested(event)
    })

    document.addEventListener('tab-deactivate', event => {
      this.deactivateIfRequested(event)
    })

    if (this.containerElement !== null && typeof this.containerElement !==
        'undefined') {
      this.containerElement.addEventListener(TabsContainer.events.TAB_ACTIVATE,
        event => {
          this.activateIfRequested(event)
        })
      this.containerElement.addEventListener(Tab.events.TAB_ENABLE, event => {
        this.enableIfRequested(event)
      })

      this.containerElement.addEventListener(Tab.events.TAB_DISABLE, event => {
        this.disableIfRequested(event)
      })
    }

    this.element.addEventListener('click', () => {
      if (!this.disabled) {
        this.containerElement.dispatchEvent(
          new CustomEvent(TabsContainer.events.TAB_SELECTED,
            this.eventDetails))
      }
    })
  }

  /**
   * Sets tab to active state, and fires tab-activated event.
   */
  setActive () {
    if (!this.disabled) {
      if (!this.isActive) {
        this.element.classList.add('active')
        this.element.dispatchEvent(
          new CustomEvent(Tab.events.TAB_ACTIVATED, this.eventDetails))
        document.dispatchEvent(
          new CustomEvent(Tab.events.TAB_ACTIVATED, this.eventDetails))
      }
    }
  }

  /**
   * Sets tab to inactive state, and fires tab-deactivated event.
   */
  setInactive () {
    if (this.isActive) {
      this.element.classList.remove('active')
      this.element.dispatchEvent(
        new CustomEvent(Tab.events.TAB_DEACTIVATED, this.eventDetails))
      document.dispatchEvent(
        new CustomEvent(Tab.events.TAB_DEACTIVATED, this.eventDetails))
    }
  }
}
