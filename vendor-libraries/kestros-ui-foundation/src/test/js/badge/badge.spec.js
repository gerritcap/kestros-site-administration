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

import { Badge } from '../../../js/badge/badge'

describe("Badge", () => {
  let badgeElement = document.createElement('div')
  let badge = new Badge(badgeElement)
  badge.registerEventListeners()

  describe('initialization', () => {
    it('not null', () => {
      assert.notEqual(badge, null)
    })
  })

  describe('enlarge', () => {
    it('enlarge adds class', () => {
      badge.enlarge()
      assert.equal(badge.element.classList.contains('badge--large'), true)
    })
    it('reduce size removes class', () => {
      badge.reduceSize()
      assert.equal(badge.element.classList.contains('badge--large'), false)
    })
  })

  describe('fill', () => {
    badge.mute()
    badge.fill()
    it('adds badge--filed class', () => {
      assert.equal(badge.element.classList.contains('badge--filled'), true)
    })
    it('removes badge--muted class', () => {
      assert.equal(badge.element.classList.contains('badge--muted'), false)
    })
  })

  describe('mute', () => {
    it('adds badge--muted class', () => {
      badge.mute()
      assert.equal(badge.element.classList.contains('badge--muted'), true)
    })
    it('remove badge--filled class', () => {
      assert.equal(badge.element.classList.contains('badge--filled'), false)
    })
  })

  describe('clear variations', () => {
    it('remove badge--filled class', () => {
      badge.fill()
      badge.clearVariations()
      assert.equal(badge.element.classList.contains('badge--filled'), false)
    })
    it('remove badge--muted class', () => {
      badge.mute()
      badge.clearVariations()
      assert.equal(badge.element.classList.contains('badge--muted'), false)
    })
    it('does not effect size variations', () => {
      badge.enlarge()
      badge.clearVariations()
      assert.equal(badge.element.classList.contains('badge--large'), true)
    })
  })

  describe('events', () => {
    it('updates inner html on update-content event', () => {
      badgeElement.dispatchEvent(new CustomEvent('update-content', {
        detail: {
          content: 'new content'
        }
      }))

      assert.equal(badge.element.innerHTML, 'new content')
    })
  })

})