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

import { Wizard } from 'kestros-ui-foundation/src/js/wizard/wizard'

/**
 * Wizard which allows for its tabs to show input field validation status.
 */
export class ValidatedWizard extends Wizard {
  /**
   * Events the ValidatedWizard will listen for.
   *
   * @returns {{TAB_CONTENT_WARNING: string, TAB_CONTENT_ERROR: string, NEXT_TAB: string, TAB_CONTENT_SUCCESS: string}} Events the ValidatedWizard will listen for.
   */
  static get events () {
    return {
      TAB_CONTENT_SUCCESS: 'wizard-tab-content-success',
      TAB_CONTENT_ERROR: 'wizard-tab-content-error',
      TAB_CONTENT_WARNING: 'wizard-tab-content-warning',
      NEXT_TAB: 'validated-wizard-next-tab'
    }
  }

  /**
   * Events the ValidatedWizard dispatches.
   *
   * @returns {{TAB_STATUS_AFTER: string, TAB_ERROR: string, TAB_WARNING: string, VALIDATE_TAB: string, TAB_SUCCESS: string, TAB_STATUS_BEFORE: string}} Events the ValidatedWizard dispatches.
   */
  static get dispatchedEvents () {
    return {
      TAB_SUCCESS: 'wizard-tab-success',
      TAB_ERROR: 'wizard-tab-error',
      TAB_WARNING: 'wizard-tab-warning',
      TAB_STATUS_BEFORE: 'wizard-tab-status-before',
      TAB_STATUS_AFTER: 'wizard-tab-status-after',
      VALIDATE_TAB: 'wizard-validate-tab'
    }
  }

  /**
   * Dispatches the specified tab status event, as well as a before and after event.
   *
   * @param {string} eventName - Event to dispatch.
   * @param {Event} event - Event object.
   */
  dispatchTabStatusEvent (eventName, event) {
    this.element.dispatchEvent(
      new CustomEvent(ValidatedWizard.dispatchedEvents.TAB_STATUS_BEFORE,
        event))
    this.element.dispatchEvent(new CustomEvent(eventName, event))
    this.element.dispatchEvent(
      new CustomEvent(ValidatedWizard.dispatchedEvents.TAB_STATUS_AFTER,
        event))
  }

  /**
   * Registers ValidatedWizard event listeners.
   */
  registerEventListeners () {
    super.registerEventListeners()

    this.element.addEventListener(ValidatedWizard.events.TAB_CONTENT_SUCCESS,
      (e) => {
        this.disableNext = false
        this.dispatchTabStatusEvent(
          ValidatedWizard.dispatchedEvents.TAB_SUCCESS,
          e)
      })

    this.element.addEventListener(ValidatedWizard.events.TAB_CONTENT_ERROR,
      (e) => {
        this.disableNext = true
        this.dispatchTabStatusEvent(
          ValidatedWizard.dispatchedEvents.TAB_ERROR, e)
      })

    this.element.addEventListener(ValidatedWizard.events.TAB_CONTENT_WARNING,
      (e) => {
        this.disableNext = false
        this.dispatchTabStatusEvent(
          ValidatedWizard.dispatchedEvents.TAB_WARNING,
          e)
      })

    document.addEventListener(ValidatedWizard.events.NEXT_TAB, (event) => {
      this.proceedToNextTab()
    })

    this.element.addEventListener(ValidatedWizard.events.NEXT_TAB, (event) => {
      this.proceedToNextTab()
    })
  }

  /**
   * Selects the next tab.
   */
  proceedToNextTab () {
    super.selectNextTab()
  }

  /**
   * Instead of immediately selecting the next tab, this will kick off tab validation, which if valid, will select the next tab.
   */
  selectNextTab () {
    this.element.dispatchEvent(
      new CustomEvent(ValidatedWizard.dispatchedEvents.VALIDATE_TAB, {
        detail: {
          wizard: this.name,
          tabIndex: this.currentTabIndex,
          proceedOnComplete: true
        }
      }))
  }
}
