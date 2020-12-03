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
 * Form submit button.
 */
class FormSubmitButton extends InteractiveElement {
  /**
   * Constructs submit button object.
   *
   * @param {HTMLElement} element - Button HTML element.
   */
  constructor(element) {
    super(element);
    this._loadingIcon = null;
    this._warningIcon = null;

    const loaderIcon = this.element.querySelector('.loader');
    if (loaderIcon !== null) {
      this._loadingIcon = new InteractiveElement(loaderIcon);
    }

    const warningIcon = this.element.querySelector('.warning-icon');
    if (warningIcon !== null) {
      this._warningIcon = new InteractiveElement(warningIcon);
    }
  }

  /**
   * Parent form HTML element.
   *
   * @returns {*|null|HTMLFormElement|Element} Parent form HTML element.
   */
  get formElement() {
    return this.element.closest('form');
  }

  /**
   * Loader element.
   *
   * @returns {InteractiveElement} Loader element.
   */
  get loader() {
    return this._loadingIcon;
  }

  /**
   * Warning Icon element.
   *
   * @returns {InteractiveElement} Warning Icon element.
   */
  get warningIcon() {
    return this._warningIcon;
  }

  /**
   * Registers submit button event listeners.
   */
  registerEventListeners() {
    this.element.addEventListener('focusin', e => {
      e.preventDefault();
    });

    this.element.addEventListener('click', e => {
      e.preventDefault();
      if (this.formElement !== null && typeof this.formElement !== 'undefined') {
        this.formElement.dispatchEvent(new Event('submit', {
          cancelable: true
        }));
      }
    });

    if (this.formElement !== null && typeof this.formElement !== 'undefined') {
      this.formElement.addEventListener('submit-before', () => {
        this.setLoading();
      });
      this.formElement.addEventListener('submit-success', () => {
        this.unsetLoading();
      });
      this.formElement.addEventListener('submit-failed', () => {
        this.unsetLoading();
      });
      this.formElement.addEventListener('validation-failed', () => {
        this.setWarning(false);
      });
      this.formElement.addEventListener('validation-successful', () => {
        this.unsetWarning();
      });
    }
  }

  /**
   * Sets submit button to a loading state.
   */
  setLoading() {
    this.warningIcon.hide();
    this.loader.show();
    this.disable();
  }

  /**
   * Returns submit button from a loading state.
   */
  unsetLoading() {
    this.warningIcon.hide();
    this.loader.hide();
    this.enable();
  }

  /**
   * Sets the submit button to a warning state.
   *
   * @param {boolean} disable - Whether to disable the button.
   */
  setWarning(disable) {
    this.loader.hide();
    if (disable) {
      this.disable();
    } else {
      this.enable();
    }
    this.warningIcon.show();
  }

  /**
   * Unsets the submit button from a warning state.
   */
  unsetWarning() {
    this.loader.hide();
    this.enable();
    this.warningIcon.hide();
  }
}