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

import {TabsElement} from '../../../js/tabs/tabs-element'

describe("Tabs Element", () => {
  describe('initialize', () => {
    it('initializes', () => {
      let tabsElementElement = document.createElement('div')
      let tabsElement = new TabsElement(tabsElementElement)

      assert.notEqual(tabsElement, null)
    })
  })
  describe('get tab index', () => {
    it('when first element', () => {
      let tabsElementElement = document.createElement('div')
      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal(0, tabsElement.tabIndex)
    })

    it('when second element', () => {
      let parentElement = document.createElement('div')
      let tabsElementElement1 = document.createElement('div')
      let tabsElementElement2 = document.createElement('div')

      parentElement.appendChild(tabsElementElement1)
      parentElement.appendChild(tabsElementElement2)

      let tabsElement = new TabsElement(tabsElementElement2)

      assert.equal(1, tabsElement.tabIndex)
    })
  })
  describe('get tabs container', () => {
    it('when container element exists', () => {
      let containerElement = document.createElement('div')
      containerElement.classList.add('tabs-container')
      let tabsElementElement = document.createElement('div')
      containerElement.appendChild(tabsElementElement)

      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal(containerElement, tabsElement.containerElement)
    })

    it('when container element does not exist', () => {
      let tabsElementElement = document.createElement('div')
      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal(null, tabsElement.containerElement)
    })
  })

  describe('get name', () => {
    it('when has name data', () => {
      let tabsElementElement = document.createElement('div')
      tabsElementElement.setAttribute('data-name', 'tab-name')
      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal('tab-name', tabsElement.name)
    })

    it('when does not have name data', () => {
      let tabsElementElement = document.createElement('div')
      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal(null, tabsElement.name)
    })
  })

  describe('get container name', () => {
    it('when container element has name', () => {
      let containerElement = document.createElement('div')
      containerElement.classList.add('tabs-container')
      containerElement.setAttribute('data-name', 'container-1')
      let tabsElementElement = document.createElement('div')
      containerElement.appendChild(tabsElementElement)

      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal('container-1', tabsElement.containerName)
    })

    it('when container element does not have name', () => {
      let containerElement = document.createElement('div')
      containerElement.classList.add('tabs-container')
      let tabsElementElement = document.createElement('div')
      containerElement.appendChild(tabsElementElement)

      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal(null, tabsElement.containerName)
    })
    it('when container element does not exist', () => {
      let tabsElementElement = document.createElement('div')
      let tabsElement = new TabsElement(tabsElementElement)

      assert.equal(undefined, tabsElement.containerName)
    })
  })
})