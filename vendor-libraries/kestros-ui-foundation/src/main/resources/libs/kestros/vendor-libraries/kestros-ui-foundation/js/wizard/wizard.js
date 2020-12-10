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
 * Step by step tabbed content.
 */
class Wizard extends TabsContainer {
  /**
   * Constructs wizard and sets current tab index to 0.
   *
   * @param {HTMLElement} element - Element to construct wizard from.
   */
  constructor(element) {
    super(element);
    if (typeof this.element.dataset.currentTab === 'undefined') {
      this.element.setAttribute('data-current-tab', 0);
    }
  }

  /**
   * Wizard object events.
   *
   * @returns {{WIZARD_PREVIOUS: string, WIZARD_NEXT: string}} Wizard object events.
   */
  static get events() {
    return {
      WIZARD_NEXT: 'wizard-next',
      WIZARD_PREVIOUS: 'wizard-previous'
    };
  }

  static get dispatchedEvents() {
    return {
      SELECTED_FINAL_TAB: 'wizard-selected-final-tab',
      DESELECTED_FINAL_TAB: 'wizard-deselected-final-tab'
    };
  }

  /**
   * Event data associated to wizard tab selection.
   *
   * @returns {{detail: {container: string, index: number}}} Event data associated to wizard tab selection.
   */
  get event() {
    return {
      detail: {
        container: this.name,
        index: this.currentTabIndex
      }
    };
  }

  /**
   * Whether the wizard blocked from proceeding to the next step.
   *
   * @returns {boolean} Whether the wizard blocked from proceeding to the next step.
   */
  get disableNext() {
    return Boolean(this.element.dataset.disableNext === 'true' || this.element.dataset.disableNext === true);
  }

  /**
   * Sets whether the wizard can proceed to the next step.
   *
   * @param {boolean} disable - Whether the wizard blocked from proceeding to the next step.
   */
  set disableNext(disable) {
    this.element.setAttribute('data-disable-next', disable);
  }

  /**
   * Total number of tabs within the wizard.
   *
   * @returns {number} Total number of tabs within the wizard.
   */
  get tabCount() {
    return this.element.querySelectorAll('.tab').length;
  }

  /**
   * Currently selected tab.
   *
   * @returns {number} Currently selected tab.
   */
  get currentTabIndex() {
    return Number(this.element.dataset.currentTab);
  }

  /**
   * Sets the currently selected tab index.
   *
   * @param {number} index - Value to set.
   */
  set currentTabIndex(index) {
    this.element.setAttribute('data-current-tab', Number(index));
  }

  /**
   * Registers wizard events.
   */
  registerEventListeners() {
    super.registerEventListeners();

    document.addEventListener(Wizard.events.WIZARD_NEXT, event => {
      if (event.detail.wizard === this.name) {
        this.selectNextTab();
      }
    });

    this.element.addEventListener(Wizard.events.WIZARD_NEXT, event => {
      if (event.detail.wizard === this.name) {
        this.selectNextTab();
      }
    });

    document.addEventListener(Wizard.events.WIZARD_PREVIOUS, event => {
      if (event.detail.wizard === this.name) {
        this.selectPreviousTab();
      }
    });

    this.element.addEventListener(Wizard.events.WIZARD_PREVIOUS, event => {
      if (event.detail.wizard === this.name) {
        this.selectPreviousTab();
      }
    });
  }

  /**
   * Selects next tab.
   */
  selectNextTab() {
    if (!this.disableNext) {
      if (this.currentTabIndex !== this.tabCount - 1) {
        this.currentTabIndex = this.currentTabIndex + 1;
        this.element.dispatchEvent(new CustomEvent(Tab.events.TAB_ENABLE, this.event));
        this.element.dispatchEvent(new CustomEvent(TabsContainer.events.TAB_SELECTED, this.event));
      } else {
        this.element.dispatchEvent(new CustomEvent(Wizard.dispatchedEvents.SELECTED_FINAL_TAB));
      }
    }
  }

  /**
   * Selects previous tab.
   */
  selectPreviousTab() {
    if (this.currentTabIndex !== 0) {
      this.currentTabIndex = this.currentTabIndex - 1;
      this.element.dispatchEvent(new CustomEvent(TabsContainer.events.TAB_SELECTED, this.event));
      this.element.dispatchEvent(new CustomEvent(Wizard.dispatchedEvents.DESELECTED_FINAL_TAB));
    }
  }
}