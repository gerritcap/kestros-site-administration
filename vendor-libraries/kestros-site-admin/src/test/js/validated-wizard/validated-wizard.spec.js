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

import {ValidatedWizard} from '../../../js/validated-wizard/validated-wizard'

describe("ValidatedWizard", () => {
  let wizardElement = null
  let wizard = null

  beforeEach(() => {
    wizardElement = document.createElement('div')
    wizardElement.setAttribute('data-name', 'wizard-1')

    wizard = new ValidatedWizard(wizardElement)
    wizard.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(wizard, null)
  })

  describe('events', () => {

    describe('triggers event status updates when content event detected',
        () => {
          let beforeCount = 0
          let afterCount = 0

          beforeEach(() => {
            beforeCount = 0
            afterCount = 0

            wizardElement.addEventListener('wizard-tab-status-before', () => {
              beforeCount++
            })
            wizardElement.addEventListener('wizard-tab-status-after', () => {
              afterCount++
            })
          })

          it('tab success event', () => {
            let count = 0
            wizardElement.addEventListener('wizard-tab-success', () => {
              count++
            })
            wizardElement.dispatchEvent(
                new CustomEvent('wizard-tab-content-success'))

            assert.equal(count, 1)
            assert.equal(beforeCount, 1)
            assert.equal(afterCount, 1)
          })
          it('tab error event', () => {
            let count = 0
            wizardElement.addEventListener('wizard-tab-error', () => {
              count++
            })

            wizardElement.dispatchEvent(
                new CustomEvent('wizard-tab-content-error'))

            assert.equal(count, 1)
            assert.equal(beforeCount, 1)
            assert.equal(afterCount, 1)
          })
          it('tab warning event', () => {
            let count = 0
            wizardElement.addEventListener('wizard-tab-warning', () => {
              count++
            })
            wizardElement.dispatchEvent(
                new CustomEvent('wizard-tab-content-warning'))

            assert.equal(count, 1)
            assert.equal(beforeCount, 1)
            assert.equal(afterCount, 1)
          })
        })

    describe('next-tab proceeds wizard to next tab', () => {
      beforeEach(() => {
        let wizardTabElement1 = document.createElement('div')
        wizardTabElement1.setAttribute('data-name', 'wizard-tab-1')
        let wizardTabElement2 = document.createElement('div')
        wizardTabElement2.setAttribute('data-name', 'wizard-tab-2')
        let wizardTabElement3 = document.createElement('div')
        wizardTabElement3.setAttribute('data-name', 'wizard-tab-3')

        wizardElement.appendChild(wizardTabElement1)
        wizardElement.appendChild(wizardTabElement2)
        wizardElement.appendChild(wizardTabElement3)
      })

      it('document level next tab proceeds wizard to next tab', () => {
        assert.equal(wizard.currentTabIndex, 0)
        document.dispatchEvent(new CustomEvent('validated-wizard-next-tab'))
        assert.equal(wizard.currentTabIndex, 1)
      })

      it('element level next tab proceeds wizard to next tab', () => {
        assert.equal(wizard.currentTabIndex, 0)
        wizardElement.dispatchEvent(
            new CustomEvent('validated-wizard-next-tab'))
        assert.equal(wizard.currentTabIndex, 1)
      })
    })

    describe('wizard-next', () => {
      it('does not proceed to next tab', () => {
        wizardElement.dispatchEvent(new CustomEvent('wizard-next', {
          detail: {
            wizard: 'wizard-1'
          }
        }))

        assert.equal(wizard.currentTabIndex, 0)
      })

      it('fires validation', () => {
        let count = 0

        wizardElement.addEventListener('wizard-validate-tab', (event) => {
          count++
        })

        wizardElement.dispatchEvent(new CustomEvent('wizard-next', {
          detail: {
            wizard: 'wizard-1'
          }
        }))

        assert.equal(count, 1)
      })

      it('does nothing if event does not correspond to the wizard', () => {
        let count = 0
        wizardElement.addEventListener('wizard-validate-tab', () => {
          count++
        })

        wizardElement.dispatchEvent(new CustomEvent('wizard-next', {
          detail: {
            wizard: 'wizard-2'
          }
        }))

        assert.equal(count, 0)
      })
    })

  })

  describe('select next tab', () => {

    it('triggers validation on current tab.', () => {
      let count = 0
      let eventObject = null
      wizardElement.addEventListener('wizard-validate-tab', (e) => {
        count++
        eventObject = e
      })
      wizard.selectNextTab()

      assert.equal(eventObject.detail.wizard, 'wizard-1')
      assert.equal(eventObject.detail.tabIndex, '0')
      assert.equal(eventObject.detail.proceedOnComplete, true)
      assert.equal(count, 1)
    })
  })
})