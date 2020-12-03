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
import { FormSubmitButton } from './submit-button'

/**
 * Kestros Form.
 */
export class Form extends InteractiveElement {
  /**
   * Constructs Form object.
   *
   * @param {HTMLElement} element - Element that will be initialized as a form.
   */
  constructor (element) {
    super(element)
    this._submitButton = null
    this._validationAlert = null

    const submitButtonElement = this.element.querySelector('button.submit')

    if (submitButtonElement !== null && typeof submitButtonElement !==
        'undefined') {
      this._submitButton = new FormSubmitButton(submitButtonElement)
    }
  }

  /**
   * Events that the Form listens for.
   *
   * @returns {{FIELD_INVALID: string, SUBMIT: string, VALIDATE: string}} Events that the Form listens for.
   */
  static get events () {
    return {
      SUBMIT: 'submit',
      VALIDATE: 'validate',
      FIELD_INVALID: 'field-invalid'
    }
  }

  /**
   * Events that the Form can trigger/dispatch.
   *
   * @returns {{SUBMIT_FAILED: string, SUBMIT_BEFORE: string, VALIDATE_BEFORE: string, FORM_VALIDATE: string, VALIDATION_FAILED: string, SUBMIT_AFTER: string, SUBMIT_SUCCESS: string, VALIDATION_SUCCESSFUL: string, VALIDATE_AFTER: string}} Events that the Form can trigger/dispatch.
   */
  static get dispatchedEvents () {
    return {
      SUBMIT_BEFORE: 'submit-before',
      SUBMIT_AFTER: 'submit-after',
      SUBMIT_FAILED: 'submit-failed',
      SUBMIT_SUCCESS: 'submit-success',
      VALIDATE_BEFORE: 'validate-before',
      VALIDATE_AFTER: 'validate-after',
      VALIDATION_FAILED: 'validation-failed',
      VALIDATION_SUCCESSFUL: 'validation-successful',
      FORM_VALIDATE: 'form-validate'
    }
  }

  /**
   * Path to submit the form data to.
   *
   * @returns {string} Path to submit the form data to.
   */
  get submitPath () {
    return this.element.dataset.submitPath
  }

  /**
   * Current input Form Data.
   *
   * @returns {FormData} Current input Form Data.
   */
  get data () {
    return new FormData(this.element)
  }

  /**
   * Validation Message if the form fails backend validation.
   *
   * @returns {Alert} Validation Message if the form fails backend validation.
   */
  get validationMessage () {
    if (this._validationAlert === null) {
      const validationAlertElement = this.element.querySelector(
        '.validation-message')
      if (validationAlertElement !== null && typeof validationAlertElement !==
          'undefined') {
        this._validationAlert = new Alert(validationAlertElement)
      }
    }
    return this._validationAlert
  }

  /**
   * Submit button element.
   *
   * @returns {FormSubmitButton} Submit button element.
   */
  get submitButton () {
    return this._submitButton
  }

  /**
   * General Error message.
   *
   * @returns {string} General error message.
   */
  get defaultErrorMessage () {
    return this.element.dataset.defaultErrorMessage
  }

  /**
   * Submit method.
   *
   * @returns {string} Submit method.
   */
  get method () {
    return this.element.dataset.submitMethod
  }

  /**
   * Whether the form is currently valid.
   *
   * @returns {boolean} Whether the form is currently valid.
   */
  get isValid () {
    return this.element.dataset.valid === 'true'
  }

  /**
   * Message to show when the form is invalid.
   *
   * @returns {string} Message to show when the form is invalid.
   */
  get invalidMessage () {
    if (typeof this.element.dataset.defaultInvalidMessage !== 'undefined') {
      return this.element.dataset.defaultInvalidMessage
    }
    return 'One or more fields are invalid.'
  }

  /**
   * Registers listeners for the Form Object.
   * Events:
   * * Click submit button.
   */
  registerEventListeners () {
    this.element.addEventListener(Form.events.SUBMIT, (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.element.dispatchEvent(new Event(Form.dispatchedEvents.SUBMIT_BEFORE))
      this.element.dispatchEvent(new Event(Form.events.VALIDATE))
      this.submit()
      this.element.dispatchEvent(new Event(Form.dispatchedEvents.SUBMIT_AFTER))
    })

    this.element.addEventListener(Form.events.VALIDATE, () => {
      this.element.dispatchEvent(new Event(Form.dispatchedEvents.VALIDATE_BEFORE))

      this.setValid()
      this.element.dispatchEvent(new Event(Form.dispatchedEvents.FORM_VALIDATE))

      if (this.isValid) {
        this.setValid()
      } else {
        this.setInvalid(this.invalidMessage)
      }

      this.element.dispatchEvent(new Event(Form.dispatchedEvents.VALIDATE_AFTER))
    })

    this.element.addEventListener(Form.events.FIELD_INVALID, (e) => {
      this.element.dataset.valid = 'false'
      if (this.invalidMessage === null || typeof this.invalidMessage ===
          'undefined' || this.invalidMessage === '') {
        let message = ''
        if (typeof e.detail !== 'undefined') {
          message = e.detail.message
        }
        if (message === '') {
          this.element.dataset.invalidMessage = 'Invalid field(s) must be fixed'
        }
      }
    })
  }

  /**
   * Runs on submission success.
   *
   * @param {Response} response - Response data.
   */
  onSuccess (response) {
    this.element.dispatchEvent(new CustomEvent(Form.dispatchedEvents.SUBMIT_SUCCESS, {
      detail: {
        data: response
      }
    }
    ))
  }

  /**
   * Submits the current form.
   */
  submit () {
    const form = this

    if (this.submitPath !== null && typeof this.submitPath !== 'undefined' &&
        this.submitPath !== '') {
      if (this.isValid) {
        fetch(this.submitPath, {
          method: this.method,
          body: this.data,
          credentials: 'same-origin'
        }).then((response) => {
          if (response.ok) {
            form.onSuccess(response)
          } else {
            form.submissionError(response)
          }
        }).catch((error) => {
          this.submissionError(error)
        })
      } else {
        this.setInvalid(this.invalidMessage)
      }
    }
  }

  /**
   * Sets the current form to an invalid state.
   *
   * @param {string} message - Message to show in the form alert section.
   */
  setInvalid (message) {
    // TODO add form level validate in order to disable submit button
    this.element.dataset.valid = 'false'
    if (this.validationMessage !== null) {
      this.validationMessage.updateText(message)
      this.validationMessage.show()
    }
    this.element.dispatchEvent(new Event(Form.dispatchedEvents.VALIDATION_FAILED))
  }

  /**
   * Sets the current form to valid state.
   */
  setValid () {
    this.element.dataset.valid = 'true'
    if (this.validationMessage != null) {
      this.validationMessage.updateText('')
      this.validationMessage.hide()
    }
    this.element.dispatchEvent(new Event(Form.dispatchedEvents.VALIDATION_SUCCESSFUL))
  }

  /**
   * Sets the form to an error state, and shows error message.
   *
   * @param {Response} response - Form submission response.
   */
  submissionError (response) {
    let errorMessage = this.defaultErrorMessage
    if (response.status !== 403 && response.statusText !== null && response.statusText !== undefined &&
        response.statusText !== '') {
      errorMessage = response.statusText
    }

    if (this.validationMessage !== null) {
      this.validationMessage.updateText(errorMessage)
      this.validationMessage.show()
    }

    if (this.submitButton !== null) {
      this.submitButton.setWarning(false)
    }

    this.element.dispatchEvent(new Event(Form.dispatchedEvents.SUBMIT_FAILED))
  }
}
