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

import { Sidebar } from '../../../js/sidebar/sidebar'


describe("Kestros Site Admin Sidebar", () => {
  jsdom({url: 'http://localhost'})

  describe('initialization', () => {
    it('fires kestros-sidebar-ready', () => {
      let count = 0
      document.addEventListener('kestros-sidebar-ready', () => {
        count += 1
      })
      let sidebarElement = document.createElement('div')
      let sidebar = new Sidebar(sidebarElement)
      sidebar.registerEventListeners()

      assert.equal(count, 1)
    })
  })

  describe('Events', () => {

    describe('content loaded', () => {
      afterEach((done) => {
        jsdom({url: 'http://localhost'})
        done()
      })
      it('triggers sidebar-loaded when content loaded', () => {
        let count = 0
        document.addEventListener('kestros-site-admin-sidebar-loaded',
            () => {
              count += 1
            })
        let sidebarElement = document.createElement('div')
        let sidebar = new Sidebar(sidebarElement)
        sidebar.registerEventListeners()
        sidebarElement.dispatchEvent(new Event('dynamic-content-loaded'))

        assert.equal(count, 1)
      })

      it('does not trigger event when content is not loaded', () => {
        let count = 0
        document.addEventListener('kestros-site-admin-sidebar-loaded', () => {
          count += 1
        })
        let sidebarElement = document.createElement('div')
        let sidebar = new Sidebar(sidebarElement)
        sidebar.registerEventListeners()

        assert.equal(count, 0)
      })
    })
    describe('reload sidebar', () => {
      afterEach(() => {
        jsdom({url: 'http://localhost'})
      })
      it('sidebar reloads when global reload is triggered', () => {
        let count = 0
        document.addEventListener('kestros-sidebar-reload',
            () => {
              count += 1
            })
        let sidebarElement = document.createElement('div')
        let sidebar = new Sidebar(sidebarElement)
        sidebar.registerEventListeners()

        document.dispatchEvent(new Event('kestros-reload-triggered'))

        assert.equal(count, 1)
      })
    })
    xdescribe('Sidebar update Event', () => {
      afterEach((done) => {
        jsdom({url: 'http://localhost'})
        done()
      })
      it('triggered with event.detail.path', () => {
        let count = 0
        document.addEventListener('kestros-sidebar-update',
            () => {
              count += 1
            })
        let sidebarElement = document.createElement('div')
        let sidebar = new Sidebar(sidebarElement)
        sidebar.registerEventListeners()

        document.dispatchEvent(new CustomEvent('kestros-sidebar-update', {
          detail: {
            path: '/path'
          }
        }))

        assert.equal(sidebar.path, '/path')
        assert.equal(count, 1)
      })
      it('when event path is empty string', () => {
        let count = 0
        document.addEventListener('kestros-sidebar-update',
            () => {
              count += 1
            })
        let sidebarElement = document.createElement('div')
        let sidebar = new Sidebar(sidebarElement)
        sidebar.registerEventListeners()

        document.dispatchEvent(new CustomEvent('kestros-sidebar-update', {
          'detail': {
            'path': ''
          }
        }))

        assert.equal(sidebar.path, undefined)
        assert.equal(count, 1)
      })

      it('triggered when no event details', () => {
        let count = 0
        document.addEventListener('kestros-sidebar-update',
            () => {
              count += 1
            })
        let sidebarElement = document.createElement('div')
        let sidebar = new Sidebar(sidebarElement)
        sidebar.registerEventListeners()

        document.dispatchEvent(new CustomEvent('kestros-sidebar-update', {}))

        assert.equal(sidebar.path, undefined)
        assert.equal(count, 1)
      })
    })
  })

})


describe("Sidebar", () => {
  let sidebarElement = null
  let sidebar = null

  beforeEach(() => {
    sidebarElement = document.createElement('div')

    sidebar = new Sidebar(sidebarElement)
    sidebar.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(sidebar, null)
  })

  describe('events', () => {

  })
})