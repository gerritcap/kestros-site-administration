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

import { InteractiveElement } from 'dynamic-applications-framework/src/js/interactive-element'
import { Alert } from 'kestros-ui-foundation/src/js/alert/alert'
import { Form } from './form'

/**
 * InputField object. Can retrieve values, validate against registered validators, and show alerts.
 */
export class InputField extends InteractiveElement {
  /**
   * Constructs InputField object.
   *
   * @param {HTMLElement} element - Element that will be initialized as an InputField.
   */
  constructor (element) {
    super(element)
    this._validationAlert = null
    this._inputElement = this.element.querySelector('input')
    this._validators = this.element.querySelectorAll('.validator')

    const validationAlertElement = this.element.querySelector(
      '.input-validation-message')
    if (validationAlertElement !== null) {
      this._validationAlert = new Alert(validationAlertElement)
    }
  }

  /**
   * Events the InputField object will listen for.
   *
   * @returns {{FIELD_INVALID: string, VALIDATE: string}} Events the InputField object will listen for.
   */
  static get events () {
    return {
      VALIDATE: Form.events.VALIDATE,
      FIELD_INVALID: Form.events.FIELD_INVALID
    }
  }

  /**
   * Events that the InputField object can trigger/dispatch.
   *
   * @returns {{RUN_VALIDATORS: string}} Events that the InputField object can trigger/dispatch.
   */
  static get dispatchedEvents () {
    return {
      RUN_VALIDATORS: 'run-validators'
    }
  }

  /**
   * Input element.
   *
   * @returns {*|null|Element|HTMLInputElement} Input element.
   */
  get inputElement () {
    return this.element.querySelector('input')
  }

  /**
   * All validator elements associated to the current InputField.
   *
   * @returns {*} All validator elements associated to the current InputField.
   */
  get validators () {
    return this._validators
  }

  /**
   * The field's Alert object, which is used for displaying errors and validation issues with the current field.
   *
   * @returns {null|Alert} The field's Alert object, which is used for displaying errors and validation issues with the current field.
   */
  get validationAlert () {
    return this._validationAlert
  }

  /**
   * Whether the current field is required for form submission.
   *
   * @returns {boolean} Whether the current field is required for form submission.
   */
  get required () {
    return Boolean(this.inputElement.required)
  }

  /**
   * Value currently found in the input field, or null.
   *
   * @returns {{enumerable: boolean}|string|null} Value currently found in the input field, or null.
   */
  get value () {
    if (this.inputElement !== null) {
      return this.inputElement.value
    }
    return null
  }

  /**
   * Whether the input field is currently empty.
   *
   * @returns {boolean} Whether the input field is currently empty.
   */
  get isEmpty () {
    return this.value === null || typeof this.value === 'undefined' ||
        this.value === ''
  }

  /**
   * Whether the input field is currently valid. This looks to the static `data-valid` attribute and does not rerun validation.
   *
   * @returns {boolean} Whether the input field is currently empty.
   */
  get isValid () {
    return this.element.dataset.valid === 'true' || this.element.dataset.valid ===
        true
  }

  /**
   * Parent form element.
   *
   * @returns {*|null|HTMLFormElement|Element} Parent form element.
   */
  get formElement () {
    return this.element.closest('form')
  }

  /**
   * Registers InputField events.
   */
  registerEventListeners () {
    // Listens for the field-invalid events.
    this.element.addEventListener(InputField.events.FIELD_INVALID, (event) => {
      this.setInvalid(event.detail.message)
      this.formElement.dispatchEvent(
        new CustomEvent(Form.events.FIELD_INVALID, event))
    })

    // Listens for the `validate`.
    this.element.addEventListener(InputField.events.VALIDATE, () => {
      this.validate()
    })

    // Listens for focus to be moved away from the input element.
    this.inputElement.addEventListener('blur', (e) => {
      e.preventDefault()

      this.element.dispatchEvent(new Event('validate'))
      if (e.relatedTarget && e.relatedTarget.type === 'submit') {
        if (this.formElement !== null && typeof this.formElement !==
            'undefined') {
          this.formElement.dispatchEvent(new Event('validate'))
        }
      }
    })

    // Listens for the form to trigger its `validate` event.
    if (this.formElement !== null && typeof this.formElement !== 'undefined') {
      this.formElement.addEventListener(Form.dispatchedEvents.FORM_VALIDATE,
        (e) => {
          this.element.dispatchEvent(new Event(InputField.events.VALIDATE))
        })
    }
  }

  /**
   * Sets the InputField to a valid state.
   */
  setValid () {
    this.element.setAttribute('data-valid', true)
    this.element.classList.remove('error')
    if (this.validationAlert !== null) {
      this.validationAlert.updateText('')
      this.validationAlert.hide()
    }
  }

  /**
   * Sets the InputField to an invalid state.
   *
   * @param {string} message - Message to display in the InputField's alert.
   */
  setInvalid (message) {
    this.element.setAttribute('data-valid', false)
    this.element.classList.add('error')
    if (this.validationAlert !== null) {
      this.validationAlert.updateText(message)
      this.validationAlert.show()
    }
  }

  /**
   * Checks if the current InputField has a value (if required), then runs validation on all child validators.
   */
  validate () {
    if (this.required && this.isEmpty) {
      this.setInvalid('Field is required')
      if (this.formElement !== null && typeof this.formElement !==
          'undefined') {
        this.formElement.dispatchEvent(new Event(Form.events.FIELD_INVALID))
      }
    } else {
      this.setValid()
    }

    if (this.isValid) {
      this.element.dispatchEvent(
        new CustomEvent(InputField.dispatchedEvents.RUN_VALIDATORS, {
          detail: {
            value: this.value
          }
        }))
    }
  }
}
