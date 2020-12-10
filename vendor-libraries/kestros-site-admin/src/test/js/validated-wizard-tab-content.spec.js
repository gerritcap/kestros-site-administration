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

import { ValidatedWizardTabContent } from '../../js/validated-wizard/validated-wizard-tab-content'

describe("ValidatedWizardTabContent", () => {
  let wizardElement = null
  let tabContentElement = null
  let wizardTabContent = null
  let input1 = null
  let input2 = null
  let input3 = null
  beforeEach(() => {
    wizardElement = document.createElement('div')
    tabContentElement = document.createElement('div')
    input1 = document.createElement('div')
    input2 = document.createElement('div')
    input3 = document.createElement('div')

    input1.classList.add('input-field')
    input2.classList.add('input-field')
    input3.classList.add('input-field')

    tabContentElement.appendChild(input1)
    tabContentElement.appendChild(input2)
    tabContentElement.appendChild(input3)
    wizardElement.appendChild(tabContentElement)
    wizardElement.classList.add('wizard')

    wizardTabContent = new ValidatedWizardTabContent(tabContentElement)
    wizardTabContent.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(wizardTabContent, null)
  })

  it('get input fields', () => {
    assert.equal(wizardTabContent.inputFieldElements.length, 3)
  })

  describe('events', () => {
    let successCount = 0
    let errorCount = 0
    let warningCount = 0
    beforeEach(() => {
      successCount = 0
      errorCount = 0
      warningCount = 0

      wizardElement.addEventListener('wizard-tab-content-success', () => {
        successCount++
      })
      wizardElement.addEventListener('wizard-tab-content-error', () => {
        errorCount++
      })
      wizardElement.addEventListener('wizard-tab-content-warning', () => {
        warningCount++
      })
    })

    it('triggers success when child fields are valid', () => {
      input1.setAttribute('data-valid', 'true')
      input2.setAttribute('data-valid', 'true')
      input3.setAttribute('data-valid', 'true')

      input1.dispatchEvent(new CustomEvent('field-validation-after', {
        detail: {
          valid: true
        }
      }))

      assert.equal(successCount, 1)
      assert.equal(errorCount, 0)
      assert.equal(warningCount, 0)
    })

    it('triggers error when triggered field is valid, but others are invalid', () => {
      input1.setAttribute('data-valid', 'true')
      input2.setAttribute('data-valid', 'false')
      input3.setAttribute('data-valid', 'false')

      input1.dispatchEvent(new CustomEvent('field-validation-after', {
        detail: {
          valid: true
        }
      }))

      assert.equal(successCount, 0)
      assert.equal(errorCount, 1)
      assert.equal(warningCount, 0)
    })

    it('triggers error when child fields are invalid', () => {
      input1.dispatchEvent(new CustomEvent('field-validation-after', {
        detail: {
          valid: false
        }
      }))

      assert.equal(successCount,0)
      assert.equal(errorCount, 1)
      assert.equal(warningCount, 0)
    })
  })
})