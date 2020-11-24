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
 * Button for controlling wizard tabs.
 */
class WizardButton extends InteractiveElement {
  /**
   * Parent wizard element.
   *
   * @returns {null|*|Element} Parent wizard element.
   */
  get containerElement() {
    return this.element.closest('.wizard');
  }

  /**
   * Parent wizard element name.
   *
   * @returns {string} Parent wizard element name.
   */
  get containerName() {
    return this.containerElement.dataset.name;
  }

  /**
   * Event to trigger when clicked.
   *
   * @returns {string} Event to trigger when clicked.
   */
  get clickEventName() {
    return '';
  }

  /**
   * Event details passed when click event is triggered.
   *
   * @returns {{detail: {wizard: string}}} Event details passed when click event is triggered.
   */
  get eventDetails() {
    return {
      detail: {
        wizard: this.containerName
      }
    };
  }

  /**
   * Registers wizard button events.
   */
  registerEventListeners() {
    super.registerEventListeners();

    this.element.addEventListener('click', event => {
      event.preventDefault();
      this.containerElement.dispatchEvent(new CustomEvent(this.clickEventName, this.eventDetails));
    });
  }
}