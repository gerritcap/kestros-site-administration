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

import {Wizard} from '../../../js/wizard/wizard'
import {WizardTab} from '../../../js/wizard/wizard-tab'

describe('Wizard', () => {
  let wizardElement = document.createElement('div')
  wizardElement.setAttribute('data-name', 'wizard-1')
  wizardElement.classList.add('wizard')
  let wizardTabElement1 = document.createElement('div')
  wizardTabElement1.setAttribute('data-name', 'wizard-tab-1')
  let wizardTabElement2 = document.createElement('div')
  wizardTabElement2.setAttribute('data-name', 'wizard-tab-2')
  let wizardTabElement3 = document.createElement('div')
  wizardTabElement3.setAttribute('data-name', 'wizard-tab-3')

  wizardTabElement1.classList.add('tab')
  wizardTabElement2.classList.add('tab')
  wizardTabElement3.classList.add('tab')

  wizardElement.appendChild(wizardTabElement1)
  wizardElement.appendChild(wizardTabElement2)
  wizardElement.appendChild(wizardTabElement3)

  let wizard = new Wizard(wizardElement)
  wizard.registerEventListeners()

  let tab1 = new WizardTab(wizardTabElement1)
  let tab2 = new WizardTab(wizardTabElement2)
  let tab3 = new WizardTab(wizardTabElement3)

  tab1.registerEventListeners()
  tab2.registerEventListeners()
  tab3.registerEventListeners()

  describe('initalization', () => {
    it('not null', () => {
      assert.notEqual(wizard, null)
    })
    it('initial tab index is 0', () => {
      assert.equal(wizard.currentTabIndex, 0)
    })
  })
  it('tab count gets all tabs', () => {
    assert.equal(wizard.tabCount, 3)
  })
  describe('tab navigation', () => {
    it('index starts at 0', () => {
      assert.equal(wizard.currentTabIndex, 0)
    })
    it('only first tab is enabled at start', () => {
      assert.equal(tab1.disabled, false)
      assert.equal(tab2.disabled, true)
      assert.equal(tab3.disabled, true)
    })
    describe('go to second tab', () => {
      it('moves to nex tab', () => {
        wizard.selectNextTab()
        assert.equal(wizard.currentTabIndex, 1)
      })
      it('enables second tab', () => {
        assert.equal(tab1.disabled, false)
        assert.equal(tab2.disabled, false)
        assert.equal(tab3.disabled, true)
      })
      it('does nothing when last tab', () => {
        assert.equal(wizard.currentTabIndex, 1)
        wizard.selectNextTab()
        assert.equal(wizard.currentTabIndex, 2)
        wizard.selectNextTab()
        assert.equal(wizard.currentTabIndex, 2)
      })
    })
    describe('previous tab', () => {
      it('moves to previous', () => {
        assert.equal(wizard.currentTabIndex, 2)
        wizard.selectPreviousTab()
        assert.equal(wizard.currentTabIndex, 1)
      })
      it('does nothing when last tab', () => {
        assert.equal(wizard.currentTabIndex, 1)
        wizard.selectPreviousTab()
        assert.equal(wizard.currentTabIndex, 0)
        wizard.selectPreviousTab()
        assert.equal(wizard.currentTabIndex, 0)
      })
    })
  })

  describe('events', () => {
    describe('wizard-next', () => {
      it('does nothing when wrong wizard', () => {
        assert.equal(wizard.currentTabIndex, 0)
        document.dispatchEvent(new CustomEvent('wizard-next', {
          detail: {
            wizard: 'invalid-wizard'
          }
        }))
        assert.equal(wizard.currentTabIndex, 0)
      })
      it('selected next element', () => {
        assert.equal(wizard.currentTabIndex, 0)
        document.dispatchEvent(new CustomEvent('wizard-next', {
          detail: {
            wizard: 'wizard-1'
          }
        }))
        assert.equal(wizard.currentTabIndex, 1)
      })

      it('deselected initial element', () => {

      })

      it('does nothing when last', () => {
        wizard.selectNextTab()
        assert.equal(wizard.currentTabIndex, 2)
        document.dispatchEvent(new CustomEvent('wizard-next', {
          detail: {
            wizard: 'wizard-1'
          }
        }))
        assert.equal(wizard.currentTabIndex, 2)
      })

    })
    describe('wizard-previous', () => {

      it('does nothing when wrong wizard', () => {
        assert.equal(wizard.currentTabIndex, 2)
        document.dispatchEvent(new CustomEvent('wizard-previous', {
          detail: {
            wizard: 'invalid-wizard'
          }
        }))
        assert.equal(wizard.currentTabIndex, 2)
      })
      it('selected previous element', () => {

      })
      it('deselected initial element', () => {
        assert.equal(wizard.currentTabIndex, 2)
        document.dispatchEvent(new CustomEvent('wizard-previous', {
          detail: {
            wizard: 'wizard-1'
          }
        }))
        assert.equal(wizard.currentTabIndex, 1)
      })

      it('does nothing when first', () => {
        wizard.selectPreviousTab()
        assert.equal(wizard.currentTabIndex, 0)
        document.dispatchEvent(new CustomEvent('wizard-previous', {
          detail: {
            wizard: 'wizard-1'
          }
        }))
        assert.equal(wizard.currentTabIndex, 0)
      })
    })
  })
})