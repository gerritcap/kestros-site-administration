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

let jsdom = require('jsdom-global')
let assert = require('assert');

jsdom({url: 'http://localhost'})

import {ValidatedWizardSubmitButton} from '../../../js/validated-wizard/validated-wizard-submit-button'

describe("ValidatedWizardSubmitButton", () => {
  let wizardElement = null
  let wizardSubmitButtonElement = null
  let submitButton = null
  beforeEach(() => {
    wizardElement = document.createElement('div')
    wizardElement.classList.add('wizard')
    wizardSubmitButtonElement = document.createElement('button')
    let loadingIcon = document.createElement('i')
    let warningIcon = document.createElement('i')

    wizardSubmitButtonElement.appendChild(loadingIcon)
    wizardSubmitButtonElement.appendChild(warningIcon)
    wizardElement.appendChild(wizardSubmitButtonElement)

    submitButton = new ValidatedWizardSubmitButton(wizardSubmitButtonElement)
    submitButton.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(submitButton, null)
  })
  it('hidden on initialization', () => {
    assert.equal(submitButton.isVisible, false)
  })

  describe('events', () => {

    it('shows when container element proceeds to final tab', () => {
      submitButton.hide()
      wizardElement.dispatchEvent(new CustomEvent('wizard-selected-final-tab'))
      assert.equal(submitButton.isVisible, true)
    })

    it('shows when container element moves to non-final tab', () => {
      submitButton.show()
      wizardElement.dispatchEvent(new CustomEvent('wizard-deselected-final-tab'))
      assert.equal(submitButton.isVisible, false)
    })
  })

})