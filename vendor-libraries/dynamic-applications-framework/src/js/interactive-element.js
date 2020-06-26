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
 * Baseline class for interactive elements.
 */
export class InteractiveElement {
  constructor (element) {
    this.element = element
  }

  /**
   * Whether the current element is disabled.
   *
   * @returns {*|boolean} Whether the current element is disabled.
   */
  get disabled () {
    if (this.element !== null && typeof this.element !== 'undefined') {
      return this.element.disabled || this.element.getAttribute('disabled') ===
          '' || this.element.classList.contains(
        'disabled')
    }
    return false
  }

  get isVisible () {
    if (this.element !== null && typeof this.element !== 'undefined') {
      return !this.element.classList.contains(InteractiveElement.CLASS_HIDDEN)
    }
    return false
  }

  /**
   * Updates the inner text of the current element.
   *
   * @param {string} text - Value to update the inner text to.
   */
  updateText (text) {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.innerText = text
    }
  }

  /**
   * Disables the current element.
   */
  disable () {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.disabled = true
    }
  }

  /**
   * Enables the current element.
   */
  enable () {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.disabled = false
    }
  }

  /**
   * Shows the current element.
   */
  show () {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.classList.remove(InteractiveElement.CLASS_HIDDEN)
    }
  }

  /**
   * Hides the current element.
   */
  hide () {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.classList.add(InteractiveElement.CLASS_HIDDEN)
    }
  }

  register () {
    if (!this.isRegistered()) {
      if (this.element !== null && typeof this.element !== 'undefined') {
        this.element.dataset.registered = 'true'
      }
      this.registerEventListeners()
    }
  }

  isRegistered () {
    if (this.element !== null && typeof this.element !== 'undefined') {
      if (this.element.dataset.registered === 'true') {
        return true
      }
    }
    return false
  }

  registerEventListeners () {
  }
}

InteractiveElement.CLASS_HIDDEN = 'hidden'
