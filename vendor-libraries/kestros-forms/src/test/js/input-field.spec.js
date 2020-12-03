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

import {InputField} from '../../js/input-field'

describe("InputField", () => {
  let inputField = null
  let inputFieldElement = null
  let formElement = null
  let inputFieldDivElement = null
  beforeEach(() => {
    formElement = document.createElement('form')
    inputFieldDivElement = document.createElement('div')
    inputFieldElement = document.createElement('input')
    let validationAlertElement = document.createElement('div')
    validationAlertElement.classList.add('input-validation-message')

    let submitButtonElement = document.createElement('button')
    submitButtonElement.setAttribute('type', 'submit')

    let validatorElement = document.createElement('div')
    validatorElement.classList.add('validator')

    inputFieldDivElement.appendChild(inputFieldElement)
    inputFieldDivElement.appendChild(validationAlertElement)
    inputFieldDivElement.appendChild(validatorElement)
    formElement.appendChild(inputFieldDivElement)
    inputFieldElement.setAttribute('required', true)

    inputField = new InputField(inputFieldDivElement)
    inputField.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(inputField, null)
  })

  it('get validation alert is not null', () => {
    assert.notEqual(inputField.validationAlert, null)
  })

  it('get required', () => {
    assert.equal(inputField.required, true)
  })

  describe('get value', () => {
    it('get value when empty', () => {
      assert.equal(inputField.value, '')
      assert.equal(inputField.isEmpty, true)
    })
    it('get value when has value', () => {
      inputFieldElement.value = 'value'
      assert.equal(inputField.value, 'value')
      assert.equal(inputField.isEmpty, false)
    })
    it('when value is null', () => {
      inputFieldElement.remove()
      assert.equal(inputField.value, null)
      assert.equal(inputField.isEmpty, true)
    })
  })

  describe('get validators', () => {
    it('picks up all validators when present', () => {
      assert.equal(inputField.validators.length, 1)
    })
  })

  describe('change state', () => {
    describe('set valid', () => {

      it('data-valid is true', () => {
        inputField.setInvalid('message')
        inputField.setValid()
        assert.equal(inputField.isValid, true)
      })
      it('does not have error class', () => {
        inputField.setInvalid('message')
        inputField.setValid()
        assert.equal(inputField.element.classList.contains('error'), false)
      })
      it('validation alert is hidden', () => {
        inputField.setInvalid('message')
        inputField.setValid()
        assert.equal(inputField.validationAlert.isVisible, false)
      })
      it('is valid returns true when data-valid is boolean attribute', () => {
        inputFieldDivElement.setAttribute('data-valid', false)
        inputFieldDivElement.setAttribute('data-valid', true)
        assert.equal(inputField.isValid, true)
      })
    })
    describe('set invalid', () => {
      it('data-valid is false', () => {
        inputField.setValid()
        inputField.setInvalid('message')
        assert.equal(inputField.isValid, false)
      })
      it('has error class', () => {
        inputField.setValid()
        inputField.setInvalid('message')
        assert.equal(inputField.element.classList.contains('error'), true)
      })
      it('validation alert is visible', () => {
        inputField.setValid()
        inputField.setInvalid('message')
        assert.equal(inputField.validationAlert.isVisible, true)
      })
    })

  })
  describe('validate', () => {
    describe('when required and is empty', () => {
      it('sets to invalid', () => {
        inputFieldElement.value = ''
        inputField.validate()
        assert.equal(inputField.isValid, false)
      })
    })
    describe('when required and not empty', () => {
      afterEach(() => {
        inputField.element.value = ''
      })

      it('sets to valid', () => {
        inputField.setInvalid()
        inputFieldElement.value = 'value'
        inputField.validate()

        assert.equal(inputField.value, 'value')
        assert.equal(inputField.isValid, true)
      })
    })
  })
  describe('events', () => {

    describe('form validate', () => {
      it('triggers validate event on field', () => {
        let count = 0
        inputField.element.addEventListener('validate', () => {
          count++
        })
        formElement.dispatchEvent(new Event('form-validate'))
        assert.equal(count, 1)
      })
    })

    describe('invalid field', () => {
      beforeEach(() => {
        inputField.setValid()
      })

      it('sets field to invalid state', () => {
        inputFieldDivElement.dispatchEvent(new CustomEvent('field-invalid', {
          detail: {
            message: 'field is invalid'
          }
        }))

        assert.equal(inputField.isValid, false)
      })
      it('triggers form level field-invalid event', () => {
        let count = 0
        formElement.addEventListener('field-invalid', () => {
          count++
        })

        inputFieldDivElement.dispatchEvent(new CustomEvent('field-invalid', {
          detail: {
            message: 'field is invalid'
          }
        }))

        assert.equal(count, 1)
      })
    })


    describe('validate', () => {
      it('triggers run-validators event when field is valid', () => {
        let count = 0
        inputField.setValid()
        inputFieldElement.value='value'

        inputFieldDivElement.addEventListener('run-validators', () => {
          count++
        })

        inputField.validate()

        assert.equal(count, 1)
      })
      it('does not trigger run-validators event when field is invalid', () => {
        let count = 0
        inputField.setInvalid()

        inputFieldDivElement.addEventListener('run-validators', () => {
          count++
        })

        inputField.validate()

        assert.equal(count, 0)
      })

    })
    describe('blur', () => {
      it('triggers validate event', () => {
        let count = 0
        inputField.element.addEventListener('validate', () => {
          count++
        })

        inputFieldElement.dispatchEvent(new Event('blur'))

        assert.equal(count, 1)
      })

      xit('triggers form level validate event when related target type is submit',
          () => {
            let count = 0
            formElement.addEventListener('validate', () => {
              count++
            })

            inputFieldElement.dispatchEvent(new Event('blur'))

            assert.equal(count, 1)
          })

    })
  })
})