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

import {WizardButton} from '../../../js/wizard/wizard-button'

describe('Baseline Wizard Button', () => {
  let wizardElement = document.createElement('div')
  let wizardButtonElement = document.createElement('div')

  wizardElement.setAttribute('data-name', 'wizard-1')
  wizardElement.classList.add('wizard')

  wizardElement.appendChild(wizardButtonElement)

  let wizardButton = new WizardButton(wizardButtonElement)

  describe('initialize', () => {
    it('not null', () => {
      assert.notEqual(wizardButton, null)
    })
  })
  it('container element is closest wizard', () => {
    assert.notEqual(wizardButton.containerElement, null)
    assert.equal(wizardButton.containerElement, wizardElement)
  })
  it('event details pass proper wizard name', () => {
    assert.equal(wizardButton.eventDetails.detail.wizard, 'wizard-1')
  })
})