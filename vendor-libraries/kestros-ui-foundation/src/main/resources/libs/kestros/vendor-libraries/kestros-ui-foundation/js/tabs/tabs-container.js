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
 * Container element for Tab and TabContents elements. Acts as controller for tab events.
 */
class TabsContainer extends InteractiveElement {
  /**
   * Tab Container events.
   *
   * @returns {{TAB_ACTIVATE_BEFORE: string, TAB_ACTIVATE_AFTER: string, TAB_ACTIVATE: string, TAB_SELECTED: string}} Tab Container events.
   */
  static get events() {
    return {
      TAB_SELECTED: 'tab-selected',
      TAB_ACTIVATE_BEFORE: 'tab-activate-before',
      TAB_ACTIVATE: 'tab-activate',
      TAB_ACTIVATE_AFTER: 'tab-activate-after'
    };
  }

  /**
   * Tab container identifier. Should be unique.
   *
   * @returns {string} Tab container identifier.
   */
  get name() {
    return this.element.dataset.name;
  }

  /**
   * Helper for building event objects.
   *
   * @param {string} tabName - Tab to trigger event on.
   * @returns {{detail: {container: string, name: *}}} Helper for building event objects.
   */
  getEvent(tabName) {
    return {
      detail: {
        container: this.name,
        name: tabName
      }
    };
  }

  /**
   * Registers tab container events.
   */
  registerEventListeners() {
    super.registerEventListeners();
    this.element.addEventListener('tabs-reset', () => {
      this.element.dispatchEvent(new CustomEvent(TabsContainer.events.TAB_SELECTED, this.getEvent(this.element.querySelectorAll('.tab')[0].dataset.name)));
    });

    this.element.addEventListener(TabsContainer.events.TAB_SELECTED, event => {
      if (event.detail.container === this.name) {
        this.element.dispatchEvent(new CustomEvent(TabsContainer.events.TAB_ACTIVATE_BEFORE, this.getEvent(event.detail.name)));
        this.element.dispatchEvent(new CustomEvent(TabsContainer.events.TAB_ACTIVATE, this.getEvent(event.detail.name)));
        this.element.dispatchEvent(new CustomEvent(TabsContainer.events.TAB_ACTIVATE_AFTER, this.getEvent(event.detail.name)));
      }
    });
  }
}