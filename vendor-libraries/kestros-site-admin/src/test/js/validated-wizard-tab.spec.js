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

import {ValidatedWizardTab} from '../../js/validated-wizard/validated-wizard-tab'

describe("ValidatedWizardTab", () => {
  let wizardElement = null
  let tabElement = null
  let wizardTab = null
  let validationStatusElement = null

  beforeEach(() => {
    wizardElement = document.createElement('div')
    tabElement = document.createElement('div')
    validationStatusElement = document.createElement('div')

    wizardElement.setAttribute('data-name', 'wizard-1')
    tabElement.setAttribute('data-name', 'tab-1')
    validationStatusElement.classList.add('wizard-validation')


    wizardElement.appendChild(tabElement)
    wizardElement.classList.add('wizard')
    tabElement.appendChild(validationStatusElement)

    wizardTab = new ValidatedWizardTab(tabElement)
    wizardTab.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(wizardTab, null)
  })

  describe('state changes', () => {
    beforeEach(() => {
      validationStatusElement.classList.add('success')
      tabElement.classList.add('error')
      tabElement.classList.add('warning')
    })

    it('clearStatusOnTab removes all states', () => {
      wizardTab.clearStatus(wizardTab)

      assert.equal(validationStatusElement.classList.contains('success'), false)
      assert.equal(validationStatusElement.classList.contains('error'), false)
      assert.equal(validationStatusElement.classList.contains('warning'), false)
    })

    it('showSuccessOnTab shows only success class', () => {
      wizardTab.showSuccess(wizardTab)

      assert.equal(validationStatusElement.classList.contains('success'), true)
      assert.equal(validationStatusElement.classList.contains('error'), false)
      assert.equal(validationStatusElement.classList.contains('warning'), false)
    })

    it('showErrorOnTab shows only error class', () => {
      wizardTab.showError(wizardTab)

      assert.equal(validationStatusElement.classList.contains('success'), false)
      assert.equal(validationStatusElement.classList.contains('error'), true)
      assert.equal(validationStatusElement.classList.contains('warning'), false)
    })
    it('showWarningOnTab shows only warning class', () => {
      wizardTab.showWarning(wizardTab)

      assert.equal(validationStatusElement.classList.contains('success'), false)
      assert.equal(validationStatusElement.classList.contains('error'), false)
      assert.equal(validationStatusElement.classList.contains('warning'), true)
    })
  })

  describe('events', () => {
    it('tab success', () => {
      wizardElement.dispatchEvent( new CustomEvent('wizard-tab-success', {
        detail: {
          container: 'wizard-1',
          name: 'tab-1',
        }
      }))

      assert.equal(validationStatusElement.classList.contains('success'), true)
      assert.equal(validationStatusElement.classList.contains('error'), false)
      assert.equal(validationStatusElement.classList.contains('warning'), false)
    })
    it('tab error', () => {
      wizardElement.dispatchEvent( new CustomEvent('wizard-tab-error', {
        detail: {
          container: 'wizard-1',
          name: 'tab-1',
        }
      }))

      assert.equal(validationStatusElement.classList.contains('success'), false)
      assert.equal(validationStatusElement.classList.contains('error'), true)
      assert.equal(validationStatusElement.classList.contains('warning'), false)
    })
    it('tab warning', () => {
      wizardElement.dispatchEvent( new CustomEvent('wizard-tab-warning', {
        detail: {
          container: 'wizard-1',
          name: 'tab-1',
        }
      }))

      assert.equal(validationStatusElement.classList.contains('success'), false)
      assert.equal(validationStatusElement.classList.contains('error'), false)
      assert.equal(validationStatusElement.classList.contains('warning'), true)
    })
    it('event details do not match current tab (wrong wizard)', () => {
      wizardElement.dispatchEvent( new CustomEvent('wizard-tab-success', {
        detail: {
          container: 'wizard-2',
          name: 'tab-1',
        }
      }))

      assert.equal(validationStatusElement.classList.contains('success'), false)
      assert.equal(validationStatusElement.classList.contains('error'), false)
      assert.equal(validationStatusElement.classList.contains('warning'), false)
    })

    it('event details do not match current tab (wrong tab)', () => {
      wizardElement.dispatchEvent( new CustomEvent('wizard-tab-success', {
        detail: {
          container: 'wizard-1',
          name: 'tab-2',
        }
      }))

      assert.equal(validationStatusElement.classList.contains('success'), false)
      assert.equal(validationStatusElement.classList.contains('error'), false)
      assert.equal(validationStatusElement.classList.contains('warning'), false)
    })
  })
})