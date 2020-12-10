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

import { FormSubmitButton } from 'kestros-forms/src/js/submit-button'
import { Wizard } from 'kestros-ui-foundation/src/js/wizard/wizard'

/**
 * Submit button for the ValidWizard object.
 */
export class ValidatedWizardSubmitButton extends FormSubmitButton {
  /**
   * Constructs the ValidatedWizardSubmitButton object.
   *
   * @param {HTMLElement} element - Element to construct from.
   */
  constructor (element) {
    super(element)
    this.hide()
  }

  /**
   * Container wizard element.
   *
   * @returns {HTMLElement} Container wizard element.
   */
  get containerElement () {
    return this.element.closest('.wizard')
  }

  /**
   * Registers validated wizard submit button event listeners.
   */
  registerEventListeners () {
    super.registerEventListeners()
    this.containerElement.addEventListener(
      Wizard.dispatchedEvents.SELECTED_FINAL_TAB, () => {
        this.show()
      })
    this.containerElement.addEventListener(
      Wizard.dispatchedEvents.DESELECTED_FINAL_TAB, () => {
        this.hide()
      })
  }
}
