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

import {WizardNextButton} from '../../../js/wizard/wizard-next-button'

describe('Wizard Next Button', () => {
  let wizardElement = document.createElement('div')
  let wizardNextButtonElement = document.createElement('div')

  wizardElement.setAttribute('data-name', 'wizard-1')
  wizardElement.classList.add('wizard')

  wizardElement.appendChild(wizardNextButtonElement)

  let wizardNextButton = new WizardNextButton(wizardNextButtonElement)
  wizardNextButton.registerEventListeners()
  describe('initialize', () => {
    it('not null', () => {
      assert.notEqual(wizardNextButton, null)
    })
  })
  it('click event name is wizard next', () => {
    assert.equal(wizardNextButton.clickEventName, 'wizard-next')
  })

  describe('events', () => {
    it('clicking triggers wizard next action', () => {
      let count = 0
      let eventWizardName = ''
      wizardElement.addEventListener('wizard-next', (event) => {
        count++
        eventWizardName = event.detail.wizard
      })

      wizardNextButton.element.dispatchEvent(new Event('click'))
      assert.equal(eventWizardName, 'wizard-1')
      assert.equal(count, 1)
    })
  })
})