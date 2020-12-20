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
 * TreeLeaf with dynamically loaded child content.
 */
class DynamicTreeLeaf extends TreeLeaf {
  /**
   * DynamicContent element.
   *
   * @returns {HTMLElement} DynamicContent element.
   */
  get dynamicContentElement() {
    return this.element.querySelector('.dynamic-content');
  }

  /**
   * Whether the leaf has children. Should be determined prior to loading in nested content.
   *
   * @returns {string} Whether the leaf has children.
   */
  get hasChildren() {
    return this.element.dataset.hasChildren === true || this.element.dataset.hasChildren === 'true';
  }

  /**
   * Opens the leaf.
   */
  open() {
    super.open();
    this.dynamicContentElement.dispatchEvent(new CustomEvent(DynamicContentArea.events.REFRESH));
  }

  /**
   * Registers DynamicTreeLeaf event listeners.
   */
  registerEventListeners() {
    super.registerEventListeners();
  }
}