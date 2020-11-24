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
 * Button for stepping back through wizard tabs.
 */
class WizardPreviousButton extends WizardButton {
  /**
   * Event fired at the parent wizard element level when button is clicked.
   *
   * @returns {string} Event fired at the parent wizard element level when button is clicked.
   */
  get clickEventName() {
    return Wizard.events.WIZARD_PREVIOUS;
  }
}