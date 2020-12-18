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
class InteractiveElement {
  /**
   * Initializes the element as an InteractiveElement.
   *
   * @param {HTMLElement} element - Element to initialize.
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * Classes applied to generic interactive elements.
   *
   * @returns {{DISABLED: string, HIDDEN: string}} Classes applied to generic interactive elements.
   */
  static get classes() {
    return {
      HIDDEN: 'hidden',
      DISABLED: 'disabled'
    };
  }

  /**
   * Events that generic interactive elements listen for.
   *
   * @returns {{DISABLE: string, HIDE: string, SHOW: string, ENABLE: string}} Events that generic interactive elements listen for.
   */
  static get events() {
    return {
      SHOW: 'element-show',
      HIDE: 'element-hide',
      ENABLE: 'element-enable',
      DISABLE: 'element-disable'
    };
  }

  /**
   * Whether the current element is disabled.
   *
   * @returns {*|boolean} Whether the current element is disabled.
   */
  get disabled() {
    if (this.element !== null && typeof this.element !== 'undefined') {
      return this.element.disabled || this.element.getAttribute('disabled') === '' || this.element.classList.contains(InteractiveElement.classes.DISABLED);
    }
    return false;
  }

  /**
   * Whether the element is visible.
   *
   * @returns {boolean} Whether the element is visible.
   */
  get isVisible() {
    if (this.element !== null && typeof this.element !== 'undefined') {
      return !this.element.classList.contains(InteractiveElement.classes.HIDDEN);
    }
    return false;
  }

  /**
   * Updates the inner text of the current element.
   *
   * @param {string} text - Value to update the inner text to.
   */
  updateText(text) {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.innerText = text;
    }
  }

  /**
   * Disables the current element.
   */
  disable() {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.disabled = true;
      this.element.classList.add(InteractiveElement.classes.DISABLED);
    }
  }

  /**
   * Enables the current element.
   */
  enable() {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.disabled = false;
      this.element.classList.remove('disabled');
    }
  }

  /**
   * Shows the current element.
   */
  show() {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.classList.remove(InteractiveElement.classes.HIDDEN);
    }
  }

  /**
   * Hides the current element.
   */
  hide() {
    if (this.element !== null && typeof this.element !== 'undefined') {
      this.element.classList.add(InteractiveElement.classes.HIDDEN);
    }
  }

  /**
   * Marks the element as registered and registers event listeners.
   */
  register() {
    if (!this.isRegistered()) {
      if (this.element !== null && typeof this.element !== 'undefined') {
        this.element.dataset.registered = 'true';
      }
      this.registerEventListeners();
    }
  }

  /**
   * Whether the current element has been previously registered.
   *
   * @returns {boolean} Whether the current element has been previously registered.
   */
  isRegistered() {
    if (this.element !== null && typeof this.element !== 'undefined') {
      if (this.element.dataset.registered === 'true') {
        return true;
      }
    }
    return false;
  }

  /**
   * Registers event listeners that are to be added during element registration.
   * Should be overwritten by extending classes when needed.
   */
  registerEventListeners() {
    if (this.element !== null) {
      this.element.addEventListener(InteractiveElement.events.SHOW, () => {
        this.show();
      });
      this.element.addEventListener(InteractiveElement.events.HIDE, () => {
        this.hide();
      });
      this.element.addEventListener(InteractiveElement.events.ENABLE, () => {
        this.enable();
      });
      this.element.addEventListener(InteractiveElement.events.DISABLE, () => {
        this.disable();
      });
    }
  }
}