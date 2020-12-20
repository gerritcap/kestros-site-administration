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

import {Tree} from '../../../js/tree/tree'

describe('Tree', () => {
  let treeElement = null
  let childElement1 = null
  let childElement2 = null
  let childElement3 = null
  let grandChildElement1 = null
  let grandChildElement2 = null
  let grandChildElement3 = null
  let grandChildElement4 = null
  let grandChildElement5 = null
  let grandChildElement6 = null
  let grandChildElement7 = null
  let grandChildElement8 = null
  let grandChildElement9 = null

  let tree = null

  beforeEach(() => {
    treeElement = document.createElement('div')
    childElement1 = document.createElement('div')
    childElement2 = document.createElement('div')
    childElement3 = document.createElement('div')
    grandChildElement1 = document.createElement('div')
    grandChildElement2 = document.createElement('div')
    grandChildElement3 = document.createElement('div')
    grandChildElement4 = document.createElement('div')
    grandChildElement5 = document.createElement('div')
    grandChildElement6 = document.createElement('div')
    grandChildElement7 = document.createElement('div')
    grandChildElement8 = document.createElement('div')
    grandChildElement9 = document.createElement('div')

    childElement1.classList.add('tree__leaf')
    childElement2.classList.add('tree__leaf')
    childElement3.classList.add('tree__leaf')
    grandChildElement1.classList.add('tree__leaf')
    grandChildElement2.classList.add('tree__leaf')
    grandChildElement3.classList.add('tree__leaf')
    grandChildElement4.classList.add('tree__leaf')
    grandChildElement5.classList.add('tree__leaf')
    grandChildElement6.classList.add('tree__leaf')
    grandChildElement7.classList.add('tree__leaf')
    grandChildElement8.classList.add('tree__leaf')
    grandChildElement9.classList.add('tree__leaf')

    childElement1.appendChild(grandChildElement1)
    childElement1.appendChild(grandChildElement2)
    childElement1.appendChild(grandChildElement3)
    childElement2.appendChild(grandChildElement4)
    childElement2.appendChild(grandChildElement5)
    childElement2.appendChild(grandChildElement6)
    childElement3.appendChild(grandChildElement7)
    childElement3.appendChild(grandChildElement8)
    childElement3.appendChild(grandChildElement9)

    treeElement.appendChild(childElement1)
    treeElement.appendChild(childElement2)
    treeElement.appendChild(childElement3)

    tree = new Tree(treeElement)
    tree.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(tree, null)
  })

  it('active item is null after initialization', () => {
    assert.equal(tree.activeItem, null)
  })

  it('set active item updates activeItem', () => {
    tree.activeItem = childElement1
    assert.equal(tree.activeItem, childElement1)
  })

  xit('get top level leaves', () => {
    assert.equal(tree.topLevelLeaves.length, 3)
  })

  it('get all leaves', () => {
    assert.equal(tree.allLeaves.length, 12)
  })

  describe('events', () => {
    describe('activate item', () => {
      it('updates active item', () => {
        assert.equal(tree.activeItem, null)

        treeElement.dispatchEvent(new CustomEvent('tree-item-activated', {
          detail: {
            element: childElement1
          }
        }))

        assert.equal(tree.activeItem, childElement1)
      })
      it('deactivates previously active item', () => {
        let count = 0
        tree.activeItem = childElement1

        assert.equal(tree.activeItem, childElement1)

        childElement1.addEventListener('tree-leaf-deactivate', () => {
          count++
        })

        treeElement.dispatchEvent(new CustomEvent('tree-item-activated', {
          detail: {
            element: childElement2
          }
        }))
        assert.equal(count, 1)
        assert.equal(tree.activeItem, childElement2)
      })
    })
    describe('open/close all', () => {
      it('open all opens all', (done) => {

        let count =0

        for(let leaf of tree.allLeaves) {
          leaf.addEventListener('tree-leaf-open', () => {
            console.log('here')
            count ++
          })
        }

        treeElement.dispatchEvent(new CustomEvent('tree-open-all'))

        setTimeout(function () {
          assert.equal(count, 12)
          done()
        }, 10)
      })
      it('close all closes all', (done) => {
        let count =0

        for(let leaf of tree.allLeaves) {
          leaf.addEventListener('tree-leaf-close', () => {
            count ++
          })
        }

        treeElement.dispatchEvent(new CustomEvent('tree-close-all'))

        setTimeout(function () {
          assert.equal(count, 12)
          done()
        }, 10)
      })
    })
  })

})
