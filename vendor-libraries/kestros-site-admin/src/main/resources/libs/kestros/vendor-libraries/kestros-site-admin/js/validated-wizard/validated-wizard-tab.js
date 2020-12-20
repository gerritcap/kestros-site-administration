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
 * Tab for a ValidatedWizard. Should correspond to a ValidatedWizardTabContent object.
 */
class ValidatedWizardTab extends WizardTab {
  /**
   * Constructs ValidatedWizardTab object.
   *
   * @param {HTMLElement} element - Element to construct ValidatedWizardTab object from.
   */
  constructor(element) {
    super(element);
    this.clearStatusOnTab(this);
  }

  /**
   * ValidatedWizardTab status classes.
   *
   * @returns {{SUCCESS: string, ERROR: string, WARNING: string}} ValidatedWizardTab status classes.
   */
  static get classes() {
    return {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning'
    };
  }

  /**
   * Validation status element.
   *
   * @returns {HTMLElement} Validation status element.
   */
  get validationStatusElement() {
    return this.element.querySelector('.wizard-validation');
  }

  /**
   * Registers ValidatedWizardTab event listeners.
   */
  registerEventListeners() {
    super.registerEventListeners();

    this.containerElement.addEventListener(ValidatedWizard.dispatchedEvents.TAB_SUCCESS, event => {
      this.updateStatusIfRequested(event, this.showSuccessOnTab);
    });

    this.containerElement.addEventListener(ValidatedWizard.dispatchedEvents.TAB_ERROR, event => {
      this.updateStatusIfRequested(event, this.showErrorOnTab);
    });

    this.containerElement.addEventListener(ValidatedWizard.dispatchedEvents.TAB_WARNING, event => {
      this.updateStatusIfRequested(event, this.showWarningOnTab);
    });
  }

  /**
   * Updates tab status, if the tab was requested in the event.
   *
   * @param {Event} event - Event object.
   * @param {Function} updateFunction - Function to perform if the current tab was requested.
   */
  updateStatusIfRequested(event, updateFunction) {
    if (event != null && typeof event !== 'undefined' && event.detail !== null && typeof event.detail !== 'undefined') {
      if (event.detail.container === this.containerName) {
        if (event.detail.name === this.name || event.detail.index === this.tabIndex) {
          updateFunction(this);
        }
      }
    }
  }

  /**
   * Clears all status classes from the ValidatedWizardTab.
   *
   * @param {ValidatedWizardTab} tab - Tab to clear status of.
   */
  clearStatusOnTab(tab) {
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.SUCCESS);
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.ERROR);
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.WARNING);
  }

  /**
   * Clears all status classes from the ValidatedWizardTab.
   */
  clearStatus() {
    this.clearStatusOnTab(this);
  }

  /**
   * Puts the tab into a success state.
   *
   * @param {ValidatedWizardTab} tab - Tab to update status of.
   */
  showSuccessOnTab(tab) {
    tab.validationStatusElement.classList.add(ValidatedWizardTab.classes.SUCCESS);
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.ERROR);
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.WARNING);
  }

  /**
   * Puts the tab into a success state.
   */
  showSuccess() {
    this.showSuccessOnTab(this);
  }

  /**
   Puts the tab into an error state.
   *
   * @param {ValidatedWizardTab} tab - Tab to update the status of.
   */
  showErrorOnTab(tab) {
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.SUCCESS);
    tab.validationStatusElement.classList.add(ValidatedWizardTab.classes.ERROR);
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.WARNING);
  }

  /**
   * Puts the tab into an error state.
   */
  showError() {
    this.showErrorOnTab(this);
  }

  /**
   Puts the tab into a warning state.
   *
   * @param {ValidatedWizardTab} tab - Tab to update the status of.
   */
  showWarningOnTab(tab) {
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.SUCCESS);
    tab.validationStatusElement.classList.remove(ValidatedWizardTab.classes.ERROR);
    tab.validationStatusElement.classList.add(ValidatedWizardTab.classes.WARNING);
  }

  /**
   * Puts the tab into a warning state.
   */
  showWarning() {
    this.showWarningOnTab(this);
  }
}