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

import {Alert} from '../../../js/alert/alert'

describe("Alert", () => {
  describe('initialize', () => {
    it('initializes', () => {
      let alertElement = document.createElement('div')
      let alert = new Alert(alertElement)

      assert.notEqual(alert, null)
    })

    describe('close icon', () => {
      it('hides close icon when not closable', () => {
        let alertElement = document.createElement('div')
        let closeIcon = document.createElement('span')
        closeIcon.classList.add('alert__close')

        alertElement.appendChild(closeIcon)
        let alert = new Alert(alertElement)

        assert.equal(alert.closeIcon.element.classList.contains('hidden'), true)
      })
      it('shows close icon when not closable', () => {
        let alertElement = document.createElement('div')
        alertElement.classList.add('alert--closable')
        let closeIcon = document.createElement('span')
        closeIcon.classList.add('alert__close')

        alertElement.appendChild(closeIcon)
        let alert = new Alert(alertElement)

        assert.equal(alert.closeIcon.element.classList.contains('hidden'),
            false)
      })
      it('when close icon does not exist', () => {
        let alertElement = document.createElement('div')
        alertElement.classList.add('alert--closable')

        let alert = new Alert(alertElement)

        assert.equal(alert.closeIcon.element, null)
      })
    })

    describe('collapse icon', () => {
      it('hides collapse icon when not closable', () => {
        let alertElement = document.createElement('div')
        let collapseIcon = document.createElement('span')
        collapseIcon.classList.add('alert__collapse')

        alertElement.appendChild(collapseIcon)
        let alert = new Alert(alertElement)

        assert.equal(alert.collapseIcon.element.classList.contains('hidden'),
            true)
      })
      it('shows collapse icon when collapsible and alert icon present', () => {
        let alertElement = document.createElement('div')
        alertElement.classList.add('alert--collapsible')

        let icon = document.createElement('span')
        icon.classList.add('alert__icon')
        let collapseIcon = document.createElement('span')
        collapseIcon.classList.add('alert__collapse')

        alertElement.appendChild(icon)
        alertElement.appendChild(collapseIcon)
        let alert = new Alert(alertElement)

        assert.equal(alert.collapsible, true)
        assert.equal(alert.collapseIcon.element.classList.contains('hidden'),
            false)
      })

      it('hides collapse icon when not alert icon not present', () => {
        let alertElement = document.createElement('div')
        alertElement.classList.add('alert--collapsible')
        let collapseIcon = document.createElement('span')
        collapseIcon.classList.add('alert__collapse')

        alertElement.appendChild(collapseIcon)
        let alert = new Alert(alertElement)

        assert.equal(alert.collapsible, true)
        assert.equal(alert.collapseIcon.element.classList.contains('hidden'),
            true)
      })
    })

  })

  describe('Event Listeners', () => {
    describe('closable', () => {
      it('alert closes when close icon ', () => {
        let alertElement = document.createElement('div')
        alertElement.classList.add('alert--closable')
        let closeIcon = document.createElement('span')
        closeIcon.classList.add('alert__close')

        alertElement.appendChild(closeIcon)
        let alert = new Alert(alertElement)
        alert.registerEventListeners()

        closeIcon.dispatchEvent(new Event('click'))

        assert.equal(alert.element.classList.contains('alert--closed'), true)
      })
      it('alert element is removed after transition end', () => {
        let alertElement = document.createElement('div')
        alertElement.classList.add('alert')
        alertElement.classList.add('alert--closable')
        let closeIcon = document.createElement('span')
        closeIcon.classList.add('alert__close')

        alertElement.appendChild(closeIcon)

        document.body.appendChild(alertElement)
        let alert = new Alert(alertElement)
        alert.registerEventListeners()

        closeIcon.dispatchEvent(new Event('click'))

        alert.element.dispatchEvent(new Event('transitionend'))

        assert.equal(document.body.querySelector('.alert'), null)
      })
    })

    describe('collapsible', () => {
      it('alert expands when icon clicked while in collapsed state', () => {
        let alertElement = document.createElement('div')
        alertElement.classList.add('alert--collapsible')

        let icon = document.createElement('span')
        icon.classList.add('alert__icon')
        let collapseIcon = document.createElement('span')
        collapseIcon.classList.add('alert__collapse')

        alertElement.appendChild(icon)
        alertElement.appendChild(collapseIcon)
        let alert = new Alert(alertElement)
        alert.registerEventListeners()
        alert.collapse()
        assert.equal(alert.collapsed, true)

        icon.dispatchEvent(new Event('click'))

        assert.equal(alert.collapsed, false)
      })

      it('alert collapses when collapse icon clicked while in expanded state',
          () => {
            let alertElement = document.createElement('div')
            alertElement.classList.add('alert--collapsible')

            let icon = document.createElement('span')
            icon.classList.add('alert__icon')
            let collapseIcon = document.createElement('span')
            collapseIcon.classList.add('alert__collapse')

            alertElement.appendChild(icon)
            alertElement.appendChild(collapseIcon)
            let alert = new Alert(alertElement)
            alert.registerEventListeners()

            assert.equal(alert.collapsed, false)
            collapseIcon.dispatchEvent(new Event('click'))
            assert.equal(alert.collapsed, true)
          })

      it('alert text shows after alert is expanded',
          () => {
            let alertElement = document.createElement('div')
            alertElement.classList.add('alert--collapsible')

            let icon = document.createElement('span')
            icon.classList.add('alert__icon')

            let text = document.createElement('span')
            text.classList.add('alert__text')
            let collapseIcon = document.createElement('span')
            collapseIcon.classList.add('alert__collapse')

            alertElement.appendChild(icon)
            alertElement.appendChild(text)
            alertElement.appendChild(collapseIcon)
            let alert = new Alert(alertElement)
            alert.registerEventListeners()

            assert.equal(alert.collapsed, false)
            collapseIcon.dispatchEvent(new Event('click'))
            assert.equal(alert.collapsed, true)
            assert.equal(alert.text.element.classList.contains('hidden'), true)
            icon.dispatchEvent(new Event('click'))
            assert.equal(alert.text.element.classList.contains('hidden'), true)
            alert.element.dispatchEvent(new Event('transitionend'))
            assert.equal(alert.text.element.classList.contains('hidden'), false)
          })

      it('alert event alert-after-collapse fires after transition ends',
          () => {
            let alertElement = document.createElement('div')
            alertElement.classList.add('alert--collapsible')

            let icon = document.createElement('span')
            icon.classList.add('alert__icon')

            let text = document.createElement('span')
            text.classList.add('alert__text')
            let collapseIcon = document.createElement('span')
            collapseIcon.classList.add('alert__collapse')

            alertElement.appendChild(icon)
            alertElement.appendChild(text)
            alertElement.appendChild(collapseIcon)

            let count = 0
            let event
            alertElement.addEventListener('alert-after-collapse', (e) => {
              count += 1
              event = e
            })

            let alert = new Alert(alertElement)
            alert.registerEventListeners()

            assert.equal(alert.collapsed, false)
            collapseIcon.dispatchEvent(new Event('click'))
            assert.equal(count, 0)
            alert.element.dispatchEvent(new Event('transitionend'))
            assert.equal(count, 1)
          })

    })
  })
})