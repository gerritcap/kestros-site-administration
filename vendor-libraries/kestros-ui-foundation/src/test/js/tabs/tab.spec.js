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

import { Tab } from '../../../js/tabs/tab'

describe('Tab', () => {
  describe('initialize', () => {
    it('initializes', () => {
      let tabElement = document.createElement('div')
      let tab = new Tab(tabElement)

      assert.notEqual(tab, null)
    })
    it('sets active when first tab', () => {
      let tabElement = document.createElement('div')
      let tab = new Tab(tabElement)

      assert.equal(tab.isActive, true)
    })
    it('does not set active when not first tab', () => {
      let parent = document.createElement('div')
      let tabElement1 = document.createElement('div')
      let tabElement2 = document.createElement('div')
      parent.appendChild(tabElement1)
      parent.appendChild(tabElement2)
      let tab = new Tab(tabElement2)

      assert.equal(tab.isActive, false)
    })
  })
  describe('set active', () => {
    let tabElement = document.createElement('div')
    let tab = new Tab(tabElement)
    tab.setInactive()
    tab.setActive()
    it('is active returns true', () => {
      assert.equal(tab.isActive, true)
    })
    it('classlist contains active', () => {
      assert.equal(tab.element.classList.contains('active'), true)
    })
    it('does nothing when disabled', () => {
      tab.setInactive()
      tab.disable()
      tab.setActive()
      assert.equal(tab.element.classList.contains('active'), false)
    })
  })
  describe('set inactive', () => {
    let tabElement = document.createElement('div')
    let tab = new Tab(tabElement)
    tab.setInactive()
    it('is active returns false', () => {
      assert.equal(tab.isActive, false)
    })
    it('classlist doe not contain active', () => {
      assert.equal(tab.element.classList.contains('active'), false)
    })
  })
  describe('active if requested', () => {
    let container = document.createElement('div')
    container.setAttribute('data-name', 'container-1')
    container.classList.add('tabs-container')
    let tabElement = document.createElement('div')
    describe('when requested', () => {
      tabElement.setAttribute('data-name', 'tab-1')
      container.appendChild(tabElement)

      let tab = new Tab(tabElement)
      let event = {
        detail: {
          container: 'container-1',
          name: 'tab-1'
        }
      }
      it('sets to active state', () => {
        tab.setInactive()
        tab.activateIfRequested(event)
        assert.equal(tab.isActive, true)
      })
    })
    describe('when another element is requested', () => {
      tabElement.setAttribute('data-name', 'tab-1')
      container.appendChild(tabElement)

      let tab = new Tab(tabElement)
      let event = {
        detail: {
          container: 'container-1',
          name: 'tab-2'
        }
      }

      it('sets to inactive state', () => {
        tab.setActive()
        tab.activateIfRequested(event)
        assert.equal(tab.isActive, false)
      })
    })
    describe('when event.detail is null or undefined', () => {
      tabElement.setAttribute('data-name', 'tab-1')
      let tab = new Tab(tabElement)
      let event = {}
      it('keeps initial state', () => {
        tab.setActive()
        tab.activateIfRequested(event)
        assert.equal(tab.isActive, true)
      })
    })

  })
  describe('deactivate if requested', () => {
    let container = document.createElement('div')
    container.setAttribute('data-name', 'container-1')
    container.classList.add('tabs-container')
    let tabElement = document.createElement('div')
    describe('when requested', () => {
      tabElement.setAttribute('data-name', 'tab-1')
      container.appendChild(tabElement)

      let tab = new Tab(tabElement)
      let event = {
        detail: {
          container: 'container-1',
          name: 'tab-1'
        }
      }
      it('deactivates when previously active', () => {
        tab.setActive()
        tab.deactivateIfRequested(event)
        assert.equal(tab.isActive, false)
      })
      it('does nothing when already inactive', () => {
        tab.setInactive()
        tab.deactivateIfRequested(event)
        assert.equal(tab.isActive, false)
      })
    })
    describe('when not requested', () => {
      tabElement.setAttribute('data-name', 'tab-1')
      container.appendChild(tabElement)

      let tab = new Tab(tabElement)
      let event = {
        detail: {
          container: 'container-1',
          name: 'tab-2'
        }
      }
      it('does nothing', () => {
        tab.setActive()
        tab.deactivateIfRequested(event)
        assert.equal(tab.isActive, true)
      })
    })
    describe('when invalid event data', () => {
      tabElement.setAttribute('data-name', 'tab-1')
      container.appendChild(tabElement)

      let tab = new Tab(tabElement)
      it('does nothing when event is null', () => {
        tab.setActive()
        tab.deactivateIfRequested(null)
        assert.equal(tab.isActive, true)
      })
      it('does nothing when event is undefined', () => {
        tab.setActive()
        tab.deactivateIfRequested(null)
        assert.equal(tab.isActive, true)
      })
    })
  })
  describe('event listeners', () => {
    let container = document.createElement('div')
    container.setAttribute('data-name', 'container-1')
    container.classList.add('tabs-container')
    let tabElement = document.createElement('div')
    tabElement.setAttribute('data-name', 'tab-1')
    container.appendChild(tabElement)
    let tab = new Tab(tabElement)
    describe('document events', () => {
      describe('tab-activate', () => {
        it('activates tab when requested', () => {
          tab.registerEventListeners()
          let event = {
            detail: {
              container: 'container-1',
              name: 'tab-1'
            }
          }
          tab.setInactive()
          assert.equal(tab.isActive, false)
          document.dispatchEvent(new CustomEvent('tab-activate', event))
          assert.equal(tab.isActive, true)
        })
        it('deactivates tab when not requested', () => {
          tab.registerEventListeners()
          let event = {
            detail: {
              container: 'container-1',
              name: 'tab-2'
            }
          }
          tab.setActive()
          assert.equal(tab.isActive, true)
          document.dispatchEvent(new CustomEvent('tab-activate', event))
          assert.equal(tab.isActive, false)
        })
      })
      describe('tab-deactivate', () => {
        it('deactivates active tab', () => {
          tab.registerEventListeners()
          let event = {
            detail: {
              container: 'container-1',
              name: 'tab-1'
            }
          }
          tab.setActive()
          assert.equal(tab.isActive, true)
          document.dispatchEvent(new CustomEvent('tab-deactivate', event))
          assert.equal(tab.isActive, false)
        })
        it('does not effect inactive tab', () => {
          tab.registerEventListeners()
          let event = {
            detail: {
              container: 'container-1',
              name: 'tab-2'
            }
          }
          tab.setActive()
          assert.equal(tab.isActive, true)
          document.dispatchEvent(new CustomEvent('tab-deactivate', event))
          assert.equal(tab.isActive, true)
        })
      })
    })
    describe('container element events', () => {
      describe('container - tab activate', () => {
        it('activates tab if requested', () => {
          tab.registerEventListeners()
          let event = {
            detail: {
              container: 'container-1',
              name: 'tab-1'
            }
          }

          tab.setInactive()

          container.dispatchEvent(new CustomEvent('tab-activate', event))
          assert.equal(tab.isActive, true)
        })
        it('deactivates tab if not requested', () => {
          tab.registerEventListeners()
          let event = {
            detail: {
              container: 'container-1',
              name: 'tab-2'
            }
          }

          tab.setActive()

          container.dispatchEvent(new CustomEvent('tab-activate', event))
          assert.equal(tab.isActive, false)
        })
      })
    })
    describe('self events', () => {
      describe('click', () => {
        let clickedTabElement = document.createElement('div')
        container.appendChild(clickedTabElement)
        let clickedTab = new Tab(clickedTabElement)
        clickedTab.registerEventListeners()
        it('triggers container event - tab selected', () => {
          let i = 0
          container.addEventListener('tab-selected', () => {
            i++
          })
          clickedTabElement.dispatchEvent(new Event('click'))
          assert.equal(i, 1)
        })
      })
    })
  })
})