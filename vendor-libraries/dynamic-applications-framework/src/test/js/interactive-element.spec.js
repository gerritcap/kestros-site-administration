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

import { InteractiveElement } from '../../js/interactive-element'

describe('Interactive Element', function () {

  jsdom({url: 'http://localhost'})

  it('initialized', function () {
    let interactiveElement = new InteractiveElement(null);

    assert.notEqual(interactiveElement, null);
  })

  describe('disabled', () => {
    it('when element exists', function () {
      let element = document.createElement('div')
      let interactiveElement = new InteractiveElement(element);

      interactiveElement.disable()
      assert.equal(true, interactiveElement.disabled)
    })
    it('when element is null', function () {
      let interactiveElement = new InteractiveElement(null);

      interactiveElement.disable()
      assert.equal(false, interactiveElement.disabled)
    })

  })

  describe('updateText', () => {
    it('when element exists', function () {
      let element = document.createElement('p');
      let interactiveElement = new InteractiveElement(element);

      interactiveElement.updateText('my new text');

      assert.equal('my new text', element.innerText);
    })
    it('when element is null', function () {
      let interactiveElement = new InteractiveElement(null);

      interactiveElement.updateText('123')
    })
  })
  describe('enable', () => {
    it('when element exists', function () {
      let element = document.createElement('p');
      let interactiveElement = new InteractiveElement(element);

      assert.equal(false, interactiveElement.disabled);
      interactiveElement.enable()
      assert.equal(false, interactiveElement.disabled);

      interactiveElement.disable()
      assert.equal(true, interactiveElement.disabled);
      interactiveElement.enable()
      assert.equal(false, interactiveElement.disabled);
    })
    it('when element is null', function () {
      let interactiveElement = new InteractiveElement(null);

      interactiveElement.enable()
    })
  })

  describe('show / hide', () => {
    it('when element exists', function () {
      let element = document.createElement('p');
      let interactiveElement = new InteractiveElement(element);

      assert.equal(true, interactiveElement.isVisible);
      assert.equal(false,
          interactiveElement.element.classList.contains('hidden'))

      interactiveElement.hide()
      assert.equal(true,
          interactiveElement.element.classList.contains('hidden'))
      assert.equal(false, interactiveElement.isVisible);

      interactiveElement.show()
      assert.equal(true, interactiveElement.isVisible);
      assert.equal(false,
          interactiveElement.element.classList.contains('hidden'))
    })

    it('when element is null', function () {
      let interactiveElement = new InteractiveElement(null);

      interactiveElement.hide()
      interactiveElement.show()
      assert.equal(false, interactiveElement.isVisible);
    })
  })

  describe('Element Registration', () => {
    it('register element', () => {
      let element = document.createElement('p');
      let interactiveElement = new InteractiveElement(element);
      interactiveElement.register()

      assert.equal('true', interactiveElement.element.dataset.registered)
    })

    it('register element when element is null', () => {
      let interactiveElement = new InteractiveElement(null);
      interactiveElement.register()

      assert.equal(false, interactiveElement.isRegistered())
    })

    it('register element which has already been registered', () => {
      let element = document.createElement('p');
      let interactiveElement = new InteractiveElement(element);
      interactiveElement.register()
      interactiveElement.register()

      assert.equal('true', interactiveElement.element.dataset.registered)
    })

    describe('isRegistered', () => {
      it('when registered', () => {
        let element = document.createElement('p');
        let interactiveElement = new InteractiveElement(element);
        interactiveElement.register()

        assert.equal(true, interactiveElement.isRegistered())
      })

      it('when not registered', () => {
        let element = document.createElement('p');
        let interactiveElement = new InteractiveElement(element);

        assert.equal(false, interactiveElement.isRegistered())
      })
    })
  })

  describe('register document level events', ()=> {
    let interactiveElement = null
    beforeEach(() => {
      let element = document.createElement('p');
      interactiveElement = new InteractiveElement(element);

    })
    it('document level event listener registers properly', ()=> {
      let count = 0
      let eventFunction = function() {
        count ++
      }
      interactiveElement.addEventListener(document,'event', eventFunction)
      document.dispatchEvent(new CustomEvent('event', {}))
      assert.equal(count, 1)
    })
    it('event is removed after interactiveElement is destroyed', () => {
      let count = 0
      let eventFunction = function() {
        count ++
      }
      interactiveElement.addEventListener(document,'event', eventFunction)
      interactiveElement.destroy()
      document.dispatchEvent(new CustomEvent('event', {}))
      assert.equal(count, 0)
    })
    it('document level event listener registers properly when unnamed', ()=> {
      let count = 0
      interactiveElement.addEventListener(document,'event', () => {
        count++
      })
      document.dispatchEvent(new CustomEvent('event', {}))
      assert.equal(count, 1)
    })
    it('event is removed after interactiveElement is destroyed when unnamed', () => {
      let count = 0
      interactiveElement.addEventListener(document,'event',() => {
        count ++
      })
      interactiveElement.destroy()
      document.dispatchEvent(new CustomEvent('event', {}))
      assert.equal(count, 0)
    })

    it('multiple similar events can register to the same element', () => {
      let element2 = document.createElement('div')
      let interactiveElement2 = new InteractiveElement(element2)
      let count = 0

      interactiveElement2.addEventListener(document,'event', () => {
        count++
      })

      interactiveElement.addEventListener(document,'event',() => {
        count ++
      })

      document.dispatchEvent(new CustomEvent('event', {}))
      assert.equal(count, 2)
    })

    it('only relevant event is removed', () => {
      let element2 = document.createElement('div')
      let interactiveElement2 = new InteractiveElement(element2)
      let count = 0

      interactiveElement2.addEventListener(document,'event', () => {
        count++
      })

      interactiveElement.addEventListener(document,'event',() => {
        count ++
      })

      interactiveElement.destroy()
      document.dispatchEvent(new CustomEvent('event', {}))
      assert.equal(count, 1)
    })

  })
})
