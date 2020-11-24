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
 * Badge Element.
 */
class Badge extends InteractiveElement {
  /**
   * Badge events.
   *
   * @returns {{UPDATE_CONTENT: string}} Badge events.
   */
  static get events() {
    return {
      UPDATE_CONTENT: 'update-content'
    };
  }

  /**
   * Adds badge--large class.
   */
  enlarge() {
    this.element.classList.add('badge--large');
  }

  /**
   * Removes badge--large class.
   */
  reduceSize() {
    this.element.classList.remove('badge--large');
  }

  /**
   * Adds badge--filled class. Removed badge--muted.
   */
  fill() {
    this.element.classList.add('badge--filled');
    this.element.classList.remove('badge--muted');
  }

  /**
   * Adds badge--muted class. Removed badge--filled.
   */
  mute() {
    this.element.classList.remove('badge--filled');
    this.element.classList.add('badge--muted');
  }

  /**
   * Clears badge--filled and badge--muted classes from badge element.
   */
  clearVariations() {
    this.element.classList.remove('badge--filled');
    this.element.classList.remove('badge--muted');
  }

  /**
   * Registers badge events.
   */
  registerEventListeners() {
    super.registerEventListeners();
    this.element.addEventListener(Badge.events.UPDATE_CONTENT, event => {
      if (event.detail.content !== null && typeof event.detail.content !== 'undefined') {
        this.element.innerHTML = event.detail.content;
      }
    });
  }
} 