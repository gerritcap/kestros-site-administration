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

import {BaseValidator} from '../../js/base-validator'

describe("BaseValidator", () => {
  let validatorElement = document.createElement('div')
  validatorElement.setAttribute('data-message', 'Validator message.')

  let inputFieldDiv = document.createElement('div')
  inputFieldDiv.classList.add('input-field')

  inputFieldDiv.appendChild(validatorElement)

  let validator = new BaseValidator(validatorElement)
  validator.registerEventListeners()
  it('initializes', () => {
    assert.notEqual(validator, null)
  })

  it('input field returns proper div', () => {
    assert.equal(validator.inputField.element, inputFieldDiv)
  })

  it('isValid is false when not specifically true', () => {
    assert.equal(validator.isValid(true), true)
    assert.equal(validator.isValid(false), false)
    assert.equal(validator.isValid('any'), false)
  })

  it('get message returns message', () => {
    assert.equal(validator.message, 'Validator message.')
  })

  describe('events', () => {
    describe('validate input field', () => {
      it('triggers field-invalid on parent field div when not valid', () => {
        let count = 0
        inputFieldDiv.addEventListener('field-invalid', () => {
          count++
        })

        inputFieldDiv.dispatchEvent(new CustomEvent('run-validators', {
          detail: {
            value: false
          }
        }))

        assert.equal(count, 1)
      })
      it('triggers no events when valid', () => {
        let count = 0
        inputFieldDiv.addEventListener('field-invalid', () => {
          count++
        })

        inputFieldDiv.dispatchEvent(new CustomEvent('run-validators', {
          detail: {
            value: true
          }
        }))
        assert.equal(count, 0)
      })
    })
  })
})