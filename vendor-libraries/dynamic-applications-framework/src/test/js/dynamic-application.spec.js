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

import {DynamicApplication} from '../../js/dynamic-application'
import {InteractiveElement} from '../../js/interactive-element'

describe('DynamicApplication', () => {
  jsdom({url: 'http://localhost'})

  describe("debug mode", () => {
    it("when no options", () => {
      let application = new DynamicApplication(null, null)
      assert.equal(false, application.isDebugMode)
    })

    it("when empty options", () => {
      let application = new DynamicApplication(null, {})
      assert.equal(false, application.isDebugMode)
    })

    it("when options are undefined", () => {
      let application = new DynamicApplication(null, undefined)
      assert.equal(false, application.isDebugMode)
    })

    it("when is debug mode", () => {
      let application = new DynamicApplication(null, {
        "debugMode": true
      })
      assert.equal(true, application.isDebugMode)
    })
  })

  describe('register event listeners', () => {
    describe('dynamic-content-loaded', () => {
      it('initializes interactive elements', () => {
        let body = document.createElement('body')
        let element = document.createElement('p')
        element.classList.add('element-type')

        body.appendChild(element)

        let application = new DynamicApplication(body, {})

        application.registerInteractiveElementType('p.element-type',
            InteractiveElement)
        application.registerEventListeners()

        document.dispatchEvent(new CustomEvent('dynamic-content-loaded', {
          detail: {
            element: body
          }
        }))

        assert.equal("true", element.dataset.registered)
        assert.equal(undefined, element.dataset.registeredAs)
      })

    })
  })

  describe('interactive element types', () => {
    it('initial state', () => {
      let application = new DynamicApplication(null, {})
      assert.equal(0, application.interactiveElementTypes.length)
    })
    describe('register interactive element types', () => {
      it('register type', () => {
        let application = new DynamicApplication(null, {})
        application.registerInteractiveElementType('.test', InteractiveElement)
        assert.equal(1, application.interactiveElementTypes.length)
      })
      it('sorted by specificity after registration', () => {
        let application = new DynamicApplication(null, {})
        application.registerInteractiveElementType('button.test .test',
            InteractiveElement)
        application.registerInteractiveElementType('.test', InteractiveElement)
        application.registerInteractiveElementType('button.test',
            InteractiveElement)

        assert.equal(3, application.interactiveElementTypes.length)
        assert.equal('button.test .test',
            application.interactiveElementTypes[0].selector)
        assert.equal('button.test',
            application.interactiveElementTypes[1].selector)
        assert.equal('.test', application.interactiveElementTypes[2].selector)
      })
    })
  })

  describe('initialize interactive elements', () => {
    it('when no interactive element types', () => {
      let body = document.createElement('body');
      let element = document.createElement('p')

      body.appendChild(element)

      let application = new DynamicApplication(body, {})
      application.initializeInteractiveElements(body)

      assert.equal(undefined, element.dataset.registered)
    })

    it('when passed element is undefined', () => {
      let body = document.createElement('body');
      let element = document.createElement('p')

      body.appendChild(element)

      let application = new DynamicApplication(body, {})
      application.initializeInteractiveElements(undefined)

      assert.equal(undefined, element.dataset.registered)
    })

    it('when element has matching element type', () => {
      let body = document.createElement('body');
      let element = document.createElement('p')
      element.classList.add('element-type')

      body.appendChild(element)

      let application = new DynamicApplication(body, {})

      application.registerInteractiveElementType('p.element-type',
          InteractiveElement)

      application.initializeInteractiveElements(body)

      assert.equal("true", element.dataset.registered)
      assert.equal(undefined, element.dataset.registeredAs)
    })

    it('when element has matching element type and debug mode', () => {
      let body = document.createElement('body');
      let element = document.createElement('p')
      element.classList.add('element-type')

      body.appendChild(element)

      let application = new DynamicApplication(body, {
        "debugMode": true
      })

      application.registerInteractiveElementType('p.element-type',
          InteractiveElement)

      application.initializeInteractiveElements(body)

      assert.equal("true", element.dataset.registered)
      assert.equal('InteractiveElement', element.dataset.registeredAs)
    })
    it('when element is null', () => {
      let body = document.createElement('body');
      let element = document.createElement('p')
      element.classList.add('element-type')

      body.appendChild(element)

      let application = new DynamicApplication(body, {
        "debugMode": true
      })

      application.registerInteractiveElementType('p.element-type',
          InteractiveElement)

      application.initializeInteractiveElements(null)

      assert.equal(undefined, element.dataset.registered)
      assert.equal(undefined, element.dataset.registeredAs)
    })
    it('when element is already registered', () => {
      let body = document.createElement('body');
      let element = document.createElement('p')
      element.classList.add('element-type')

      body.appendChild(element)

      let application = new DynamicApplication(body, {
        "debugMode": true
      })
      let InteractiveElement2 = InteractiveElement
      application.registerInteractiveElementType('p.element-type',
          InteractiveElement)
      application.registerInteractiveElementType('p',
          InteractiveElement2)

      application.initializeInteractiveElements(body)

      assert.equal("true", element.dataset.registered)
      assert.equal("InteractiveElement", element.dataset.registeredAs)
    })
  })
})