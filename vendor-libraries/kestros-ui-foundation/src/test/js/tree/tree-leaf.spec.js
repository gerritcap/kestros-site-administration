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

import {TreeLeaf} from '../../../js/tree/tree-leaf'

describe('TreeLeaf', () => {
  let treeElement = null
  let treeLeafElement = null
  let toggleIconElement = null
  let linkElement = null
  let activeStatusIconElement = null
  let childContainerElement = null
  let childElement1 = null
  let childElement2 = null
  let childElement3 = null

  let treeLeaf = null

  beforeEach(() => {
    treeElement = document.createElement('div')
    treeLeafElement = document.createElement('div')
    toggleIconElement = document.createElement('div')
    linkElement = document.createElement('div')
    activeStatusIconElement = document.createElement('div')
    childContainerElement = document.createElement('div')
    childElement1 = document.createElement('div')
    childElement2 = document.createElement('div')
    childElement3 = document.createElement('div')


    childContainerElement.classList.add('tree__nested-container')
    treeLeafElement.classList.add('tree__leaf--closed')
    toggleIconElement.classList.add('tree__toggle')
    linkElement.classList.add('tree__link')
    activeStatusIconElement.classList.add('tree__status')

    treeLeafElement.appendChild(toggleIconElement)
    treeLeafElement.appendChild(linkElement)
    treeLeafElement.appendChild(activeStatusIconElement)
    treeLeafElement.appendChild(childContainerElement)
    treeElement.classList.add('tree')
    treeElement.appendChild(treeLeafElement)

    treeLeaf = new TreeLeaf(treeLeafElement)
    treeLeaf.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(treeLeaf, null)
  })
  it('get tree element', () => {
    assert.equal(treeLeaf.treeElement, treeElement)
  })
  it('get child leaves', () => {

  })
  it('get toggle icon element', () => {
    assert.equal(treeLeaf.toggleIconElement, toggleIconElement)
  })
  it('get link element', () => {
    assert.equal(treeLeaf.linkElement, linkElement)
  })
  it('get active status icon element', () => {
    assert.equal(treeLeaf.activeStatusIconElement, activeStatusIconElement)
  })
  describe('events', () => {
    describe('activate', () => {
      it('sets leaf element to active', () => {

        assert.equal(treeLeafElement.classList.contains('tree__leaf--active'), false)
        treeLeafElement.dispatchEvent(new CustomEvent('tree-leaf-activate'))

        assert.equal(treeLeafElement.classList.contains('tree__leaf--active'), true)
      })
      it('does not open leaf', () => {
        assert.equal(treeLeafElement.classList.contains('tree__leaf--open'), false)
        treeLeafElement.dispatchEvent(new CustomEvent('tree-leaf-activate'))

        assert.equal(treeLeafElement.classList.contains('tree__leaf--open'), false)
      })

    })
    describe('deactivate', () => {
      it('remove active class from tree element', () => {
        treeLeafElement.dispatchEvent(new CustomEvent('tree-leaf-activate'))
        assert.equal(treeLeafElement.classList.contains('tree__leaf--active'), true)
        treeLeafElement.dispatchEvent(new CustomEvent('tree-leaf-deactivate'))

        assert.equal(treeLeafElement.classList.contains('tree__leaf--active'), false)
      })
      it('does not close leaf', () => {
        treeLeafElement.dispatchEvent(new CustomEvent('tree-leaf-activate'))
        treeLeafElement.dispatchEvent(new CustomEvent('tree-leaf-open'))

        treeLeafElement.dispatchEvent(new CustomEvent('tree-leaf-deactivate'))

        assert.equal(treeLeafElement.classList.contains('tree__leaf--closed'), false)
        assert.equal(treeLeafElement.classList.contains('tree__leaf--open'), true)
      })

    })
    describe('click toggle', () => {
      it('rotates icon', () => {
        assert.equal(toggleIconElement.classList.contains('fa-rotate-90'),
            false)

        toggleIconElement.dispatchEvent(new CustomEvent('click'))

        assert.equal(toggleIconElement.classList.contains('fa-rotate-90'), true)

        toggleIconElement.dispatchEvent(new CustomEvent('click'))

        assert.equal(toggleIconElement.classList.contains('fa-rotate-90'),
            false)
      })

      it('opens current', () => {

        assert.equal(treeLeafElement.classList.contains('tree__leaf--closed'),
            true)
        assert.equal(treeLeafElement.classList.contains('tree__leaf--open'),
            false)

        toggleIconElement.dispatchEvent(new CustomEvent('click'))
        assert.equal(treeLeafElement.classList.contains('tree__leaf--closed'),
            false)
        assert.equal(treeLeafElement.classList.contains('tree__leaf--open'),
            true)

        toggleIconElement.dispatchEvent(new CustomEvent('click'))
        assert.equal(treeLeafElement.classList.contains('tree__leaf--closed'),
            true)
        assert.equal(treeLeafElement.classList.contains('tree__leaf--open'),
            false)
      })
    })
    describe('click link', () => {
      it('activates clicked item', () => {
        assert.equal(treeLeafElement.classList.contains('tree__leaf--active'),
            false)

        linkElement.dispatchEvent(new CustomEvent('click'))

        assert.equal(treeLeafElement.classList.contains('tree__leaf--active'),
            true)
      })
      it('does not open item', () => {
        assert.equal(treeLeafElement.classList.contains('tree__leaf--closed'),
            true)

        assert.equal(treeLeafElement.classList.contains('tree__leaf--closed'),
            true)
      })
    })
  })
})
