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

import { FormSubmitButton } from '../../js/submit-button'

describe("Form Submit Button", () => {

  describe('initialization', () => {
    let formSubmitButtonElement = document.createElement('a')
    let submitButton = new FormSubmitButton(formSubmitButtonElement)
    it('initializes', () => {
      assert.notEqual(submitButton, null)
    })
  })
  describe('get form element', () => {
    describe('when form element exists', () => {
      let formSubmitButtonElement = document.createElement('a')
      let formElement = document.createElement('form')
      formElement.appendChild(formSubmitButtonElement)

      let submitButton = new FormSubmitButton(formSubmitButtonElement)
      it('form element is not null', () => {
        assert.notEqual(submitButton.formElement, null)
      })
    })
    describe('when form element does not exist', () => {
      let formSubmitButtonElement = document.createElement('a')

      let submitButton = new FormSubmitButton(formSubmitButtonElement)
      it('form element is null', () => {
        assert.equal(submitButton.formElement, null)
      })
    })
  })
  describe('get loader', () => {
    describe('when element exists', () => {

    })
    describe('when element does not exist', () => {

    })
  })

  describe('change states', () => {
    let formSubmitButtonElement = document.createElement('a')
    let loaderElement= document.createElement('i')
    loaderElement.classList.add('loader')
    let warningElement = document.createElement('i')
    warningElement.classList.add('warning-icon')

    formSubmitButtonElement.appendChild(loaderElement)
    formSubmitButtonElement.appendChild(warningElement)

    let submitButton = new FormSubmitButton(formSubmitButtonElement)

    describe('set loading', () => {

      it('button is disabled', () => {
        submitButton.setLoading()
        assert.equal(submitButton.disabled, true)
      })
      it('loader is visible', () => {
        submitButton.setLoading()
        assert.equal(submitButton.loader.isVisible, true)
      })
      it('warning is not visible', () => {
        submitButton.setLoading()
        assert.equal(submitButton.warningIcon.isVisible, false)
      })
    })
    describe('unset loading', () => {
      it('button is disabled', () => {
        submitButton.unsetLoading()
        assert.equal(submitButton.disabled, false)
      })
      it('loader is not visible', () => {
        submitButton.unsetLoading()
        assert.equal(submitButton.loader.isVisible, false)
      })
      it('warning is not visible', () => {
        submitButton.unsetLoading()
        assert.equal(submitButton.warningIcon.isVisible, false)
      })
    })
    describe('set warning', () => {
      it('button is disabled when parameter is true', () => {
        submitButton.setWarning(true)
        assert.equal(submitButton.disabled, true)
      })
      it('button is not disabled when parameter is false', () => {
        submitButton.setWarning(false)
        assert.equal(submitButton.disabled, false)
      })
      it('loader is not visible', () => {
        submitButton.setWarning(true)
        assert.equal(submitButton.loader.isVisible, false)
      })
      it('warning is visible', () => {
        submitButton.setWarning(true)
        assert.equal(submitButton.warningIcon.isVisible, true)
      })
    })
    describe('unset warning', () => {
      it('button is not disabled', () => {
        submitButton.unsetWarning()
        assert.equal(submitButton.disabled, false)
      })
      it('loader is not visible', () => {
        submitButton.unsetWarning()
        assert.equal(submitButton.loader.isVisible, false)
      })
      it('warning is visible', () => {
        submitButton.unsetWarning()
        assert.equal(submitButton.warningIcon.isVisible, false)
      })
    })
  })

  describe('events', () => {
    let formElement = document.createElement('form')
    let formSubmitButtonElement = document.createElement('a')
    let loaderElement= document.createElement('i')
    loaderElement.classList.add('loader')
    let warningElement = document.createElement('i')

    warningElement.classList.add('warning-icon')
    formSubmitButtonElement.appendChild(loaderElement)
    formSubmitButtonElement.appendChild(warningElement)
    formElement.appendChild(formSubmitButtonElement)

    let submitButton = new FormSubmitButton(formSubmitButtonElement)
    submitButton.registerEventListeners()

    describe('focus in', () => {

    })
    describe('click', () => {
      let count =0
      it('form submit is triggered on form element', () => {
        formElement.addEventListener('submit', (event) => {
          count ++
        })

        submitButton.element.dispatchEvent(new Event('click'))

        assert.equal(count, 1)
      })
    })

    describe('submit-before', () => {
      it('sets loading', () => {
        formElement.dispatchEvent(new Event('submit-before'))

        assert.equal(submitButton.disabled, true)
        assert.equal(submitButton.loader.isVisible, true)
        assert.equal(submitButton.warningIcon.isVisible, false)
      })
    })
    describe('submit-success', () => {
      it('unsets loading', () => {
        formElement.dispatchEvent(new Event('submit-success'))

        assert.equal(submitButton.disabled, false)
        assert.equal(submitButton.loader.isVisible, false)
        assert.equal(submitButton.warningIcon.isVisible, false)
      })
    })
    describe('submit-failed', () => {
      it('unsets loading', () => {
        formElement.dispatchEvent(new Event('submit-failed'))

        assert.equal(submitButton.disabled, false)
        assert.equal(submitButton.loader.isVisible, false)
        assert.equal(submitButton.warningIcon.isVisible, false)
      })

    })
    describe('validation-failed', () => {
      it('sets warning', () => {
        formElement.dispatchEvent(new Event('validation-failed'))

        assert.equal(submitButton.disabled, false)
        assert.equal(submitButton.loader.isVisible, false)
        assert.equal(submitButton.warningIcon.isVisible, true)
      })
    })
    describe('validation-successful', () => {
      it('unsets warning', () => {
        formElement.dispatchEvent(new Event('validation-successful'))

        assert.equal(submitButton.disabled, false)
        assert.equal(submitButton.loader.isVisible, false)
        assert.equal(submitButton.warningIcon.isVisible, false)
      })
    })

  })
})