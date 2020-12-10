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
 * Content area corresponding to a ValidatedWizardTab.
 */
class ValidatedWizardTabContent extends WizardTabContent {
  /**
   * All child input field elements.
   *
   * @returns {Array} All child input field elements.
   */
  get inputFieldElements() {
    return this.element.querySelectorAll('.input-field');
  }

  /**
   * Whether the input fields within the current content area are valid.
   *
   * @returns {boolean} Whether the input fields within the current content area are valid.
   */
  get isValid() {
    for (const inputField of this.inputFieldElements) {
      if (inputField.dataset.valid === false || inputField.dataset.valid === 'false') {
        return false;
      }
    }
    return true;
  }

  /**
   * Registers ValidatedWizardTabContent event listeners.
   */
  registerEventListeners() {
    super.registerEventListeners();

    for (const inputField of this.inputFieldElements) {
      inputField.addEventListener(InputField.dispatchedEvents.VALIDATION_AFTER, event => {
        if (event.detail.valid === true) {
          this.checkStaticValidityOfFields(false);
        } else {
          this.dispatchErrorEvent();
        }
      });
    }

    this.containerElement.addEventListener(ValidatedWizard.dispatchedEvents.VALIDATE_TAB, event => {
      if (this.containerName === event.detail.wizard) {
        if (this.tabIndex === event.detail.tabIndex) {
          for (const inputField of this.inputFieldElements) {
            inputField.dispatchEvent(new CustomEvent(InputField.events.VALIDATE));
          }
          this.checkStaticValidityOfFields(event.detail.proceedOnComplete);
        }
      }
    });
  }

  /**
   * Checks validity of all input fields. Proceeds to next tab if designated to, and all fields are valid..
   *
   * @param {boolean} proceedOnComplete - Whether to proceed to the next tab, if all fields are valid.
   */
  checkStaticValidityOfFields(proceedOnComplete) {
    if (!this.disabled) {
      if (this.isValid) {
        this.dispatchSuccessEvent();
        if (proceedOnComplete) {
          this.containerElement.dispatchEvent(new CustomEvent(ValidatedWizard.events.NEXT_TAB));
        }
      } else {
        this.dispatchErrorEvent();
      }
    }
  }

  /**
   * Dispatches validation success event.
   */
  dispatchSuccessEvent() {
    this.containerElement.dispatchEvent(new CustomEvent(ValidatedWizard.events.TAB_CONTENT_SUCCESS, this.eventDetails));
  }

  /**
   * Dispatches validation error event.
   */
  dispatchErrorEvent() {
    this.containerElement.dispatchEvent(new CustomEvent(ValidatedWizard.events.TAB_CONTENT_ERROR, this.eventDetails));
  }

  /**
   * Dispatches validation warning event.
   */
  dispatchWarningEvent() {
    this.containerElement.dispatchEvent(new CustomEvent(ValidatedWizard.events.TAB_CONTENT_WARNING, this.eventDetails));
  }
}