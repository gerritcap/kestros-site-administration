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
 * Baseline form field validator.
 */
class BaseValidator extends InteractiveElement {
  /**
   * Constructs validator.
   *
   * @param {HTMLElement} element - Validator HTML element.
   */
  constructor(element) {
    super(element);
    this._inputField = new InputField(this.element.closest('.input-field'));
  }

  /**
   * Input field associated to the validator.
   *
   * @returns {InputField} Input field associated to the validator.
   */
  get inputField() {
    return this._inputField;
  }

  /**
   * Message to return when this validator fails.
   *
   * @returns {string} Message to return when this validator fails.
   */
  get message() {
    return this.element.dataset.message;
  }

  /**
   * Whether the current field passes this validation check.
   *
   * @param {*} value - Value to be validated against.
   * @returns {boolean} Whether the current field passes this validation check.
   */
  isValid(value) {
    return Boolean(value === true);
  }

  /**
   * Registers event listeners.
   *
   * Listens for input field to run validators, then checks validity of the `event.detail.value` value.
   * Fires `field-invalid` on the input field validation fails.
   */
  registerEventListeners() {
    this.inputField.element.addEventListener(InputField.dispatchedEvents.RUN_VALIDATORS, event => {
      const value = event.detail.value;
      if (!this.isValid(value)) {
        this.inputField.element.dispatchEvent(new CustomEvent(InputField.events.FIELD_INVALID, {
          detail: {
            message: this.message
          }
        }));
      }
    });
  }
}