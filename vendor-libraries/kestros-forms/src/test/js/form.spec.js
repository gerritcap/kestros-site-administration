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

let fetchMock = require('fetch-mock');
let jsdom = require('jsdom-global')
let assert = require('assert');

jsdom({url: 'http://localhost'})

import {Form} from '../../js/form'

describe("Form", () => {

  const responseBody = {
    response: 'data from the server'
  };

  const successfulResponse = {
    status: 200,
    body: responseBody,
    url: 'http://example.com/content/resource.html',
    headers: {
      'Content-Type': 'text/html'
    }
  }

  let formElement = document.createElement('form')
  let validationAlertElement = document.createElement('div')
  validationAlertElement.classList.add('validation-message')
  validationAlertElement.classList.add('hidden')
  let validationAlertTextElement = document.createElement('div')
  validationAlertTextElement.classList.add('alert__text')
  let submitButtonElement = document.createElement('button')
  submitButtonElement.classList.add('submit')

  let loaderIcon = document.createElement('i')
  let warningIcon = document.createElement('i')
  warningIcon.classList.add('hidden')
  loaderIcon.classList.add('loader')
  warningIcon.classList.add('warning-icon')

  validationAlertElement.appendChild(validationAlertTextElement)
  submitButtonElement.appendChild(loaderIcon)
  submitButtonElement.appendChild(warningIcon)
  formElement.appendChild(validationAlertElement)
  formElement.appendChild(submitButtonElement)

  let form = new Form(formElement)
  form.registerEventListeners()
  it('initializes', () => {
    assert.notEqual(form, null)
  })
  it('get submit path', () => {
    formElement.setAttribute('data-submit-path', "/submit-path")
    assert.equal(form.submitPath, '/submit-path')
  })
  it('get default error message', () => {
    formElement.setAttribute('data-default-error-message',
        "Default error message.")
    assert.equal(form.defaultErrorMessage, 'Default error message.')
  })
  it('get submit method', () => {
    formElement.setAttribute('data-submit-method', "POST")
    assert.equal(form.method, 'POST')
  })
  it('is not valid on initialization', () => {
    assert.equal(form.isValid, false)
  })
  it('get invalid message', () => {
    formElement.setAttribute('data-default-invalid-message', "Invalid message.")
    assert.equal(form.invalidMessage, 'Invalid message.')
  })
  it('get data', () => {
    assert.equal(Object.keys(form.data).length, 0)
  })

  describe('events', () => {
    describe('submit', () => {
      afterEach((done) => {
        fetchMock.reset()
        done()
      })

      it('triggers validate', () => {
        let count = 0
        formElement.addEventListener('validate', () => {
          count++
        })
        formElement.dispatchEvent(new Event('submit'))
        assert.equal(count, 1)
      })

      it('triggers submit-before', () => {
        let count = 0
        formElement.addEventListener('submit-before', () => {
          count++
        })
        formElement.dispatchEvent(new Event('submit'))
        assert.equal(count, 1)
      })

      it('triggers submit-after', () => {
        const myMock = fetchMock.post(
            'http://example.com/content/resource.html',
            successfulResponse);

        formElement.setAttribute('data-submit-path',
            'http://example.com/content/resource.html')

        let count = 0
        formElement.addEventListener('submit-after', () => {
          count++
        })
        formElement.dispatchEvent(new Event('submit'))
        assert.equal(count, 1)
      })
    })
  })

  describe('change state', () => {
    describe('set invalid', () => {
      beforeEach(() => {
        form.setValid()
        form.setInvalid('invalid message')
      })

      it('sets data-valid to false', () => {

        assert.equal(formElement.dataset.valid, 'false')
        assert.equal(form.isValid, false)
      })
    })
    describe('set valid', () => {
      beforeEach(() => {
        form.setInvalid('invalid message')
        form.setValid()
      })
      it('sets data-valid to true', () => {
        assert.equal(formElement.dataset.valid, 'true')
        assert.equal(form.isValid, true)
      })
    })
  })

  describe('submission error', () => {

    afterEach(() => {
      validationAlertElement.classList.add('hidden')
      warningIcon.classList.add('hidden')
    })

    it('set validation text to default message when no response status text',
        () => {
          formElement.setAttribute('data-default-error-message',
              'default message')
          assert.equal(validationAlertElement.classList.contains('hidden'),
              true)
          assert.equal(warningIcon.classList.contains('hidden'), true)
          form.submissionError({})
          assert.equal(validationAlertElement.classList.contains('hidden'),
              false)
          assert.equal(validationAlertTextElement.innerText, 'default message')
          assert.equal(warningIcon.classList.contains('hidden'), false)
        })

    it('set validation text response status text when it exists', () => {
      formElement.setAttribute('data-default-error-message',
          'default message')

      assert.equal(validationAlertElement.classList.contains('hidden'), true)
      assert.equal(warningIcon.classList.contains('hidden'), true)
      form.submissionError({statusText: 'response message'})
      assert.equal(validationAlertElement.classList.contains('hidden'), false)
      assert.equal(validationAlertTextElement.innerText, 'response message')
      assert.equal(warningIcon.classList.contains('hidden'), false)
    })

  })
})