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

import {TabContent} from '../../../js/tabs/tab-content'

describe("Tab Content", () => {
  let container = document.createElement('div')
  container.setAttribute('data-name', 'container-1')
  container.classList.add('tabs-container')
  let tabContentElement1 = document.createElement('div')
  let tabContentElement2 = document.createElement('div')
  tabContentElement1.setAttribute('data-name', 'tab-content-1')
  tabContentElement2.setAttribute('data-name', 'tab-content-2')

  container.append(tabContentElement1)
  container.append(tabContentElement2)
  let tabContent1 = new TabContent(tabContentElement1)
  let tabContent2 = new TabContent(tabContentElement2)
  describe('initialization', () => {
    it('not null', () => {
      assert.notEqual(tabContent1, null)
    })
    it('shows when tab index is 0', () => {
      assert.equal(tabContent1.isVisible, true)
    })
    it('hides when tab index is not 0', () => {
      assert.equal(tabContent2.isVisible, false)
    })
  })
  describe('tabIndex', () => {
    it('first is 0', () => {
      assert.equal(tabContent1.tabIndex, 0)
    })
    it('second is 1', () => {
      assert.equal(tabContent2.tabIndex, 1)
    })
  })
  describe('events', () => {
    tabContent1.registerEventListeners()
    tabContent2.registerEventListeners()
    describe('tab-activate', () => {
      it('shows when matching name and container', () => {
        container.dispatchEvent(new CustomEvent('tab-activate', {
          detail: {
            container: 'container-1',
            name: 'tab-content-1'
          }
        }))

        assert.equal(tabContent1.isVisible, true)
        assert.equal(tabContent2.isVisible, false)
      })
      it('hides when container matches, but name does not', () => {
        container.dispatchEvent(new CustomEvent('tab-activate', {
          detail: {
            container: 'container-1',
            name: 'tab-content-2'
          }
        }))
        assert.equal(tabContent1.isVisible, false)
        assert.equal(tabContent2.isVisible, true)
      })
      it('does nothing when container does not match', () => {
        container.dispatchEvent(new CustomEvent('tab-activate', {
          detail: {
            container: 'container-2',
            name: 'tab-content-1'
          }
        }))
        assert.equal(tabContent1.isVisible, false)
        assert.equal(tabContent2.isVisible, true)
      })
    })
  })
})