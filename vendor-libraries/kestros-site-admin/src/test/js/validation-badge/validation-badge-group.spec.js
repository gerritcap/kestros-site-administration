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

let fetchMock = require('fetch-mock');
let nodeFetch = require('node-fetch')
let jsdom = require('jsdom-global')
let assert = require('assert');

jsdom({url: 'http://localhost'})

import { ValidationBadgeGroup } from '../../../js/validation-badge/validation-badge-group'

describe("ValidationBadgeGroup", () => {

  const responseBody = {

    errorMessages: [
      'error-message-1',
      'error-message-2',
      'error-message-3'
    ],
    warningMessages: [
      'warning-message-1',
      'warning-message-2',
      'warning-message-3'
    ]
  };

  const successfulResponse = {
    status: 200,
    body: responseBody,
    url: 'http://example.com/content/resource.html',
    headers: {
      'Content-Type': 'text/html'
    }
  }

  let badgeGroupElement = null
  let badgeGroup = null
  let errorBadgeElement = null
  let warningBadgeElement = null
  let loaderElement = null

  beforeEach(() => {
    badgeGroupElement = document.createElement('div')
    badgeGroupElement.setAttribute('data-path',
        'http://example.com/content/resource.html')

    loaderElement = document.createElement('div')
    loaderElement.classList.add('loader')
    errorBadgeElement = document.createElement('div')
    errorBadgeElement.classList.add('badge')
    errorBadgeElement.classList.add('errors')
    warningBadgeElement = document.createElement('div')
    warningBadgeElement.classList.add('badge')
    warningBadgeElement.classList.add('warnings')

    badgeGroupElement.appendChild(loaderElement)
    badgeGroupElement.appendChild(errorBadgeElement)
    badgeGroupElement.appendChild(warningBadgeElement)

    badgeGroup = new ValidationBadgeGroup(badgeGroupElement)
    badgeGroup.registerEventListeners()
  })

  it('initializes', () => {
    assert.notEqual(badgeGroup, null)
  })
  it('get path', () => {
    assert.equal(badgeGroup.path, 'http://example.com/content/resource.html')
  })
  it('get error badge element', () => {
    assert.equal(badgeGroup.errorBadgeElement, errorBadgeElement)
  })
  it('get warning badge element', () => {
    assert.equal(badgeGroup.warningBadgeElement, warningBadgeElement)
  })
  it('get loader icon element', () => {
    assert.equal(badgeGroup.loaderIconElement, loaderElement)
  })

  describe('events', () => {
    describe('status updates', () => {
      it('clear all variations triggers event on child badges', () => {
        let errorEventCount = 0
        let warningEventCount = 0

        errorBadgeElement.addEventListener('clear-variations', () => {
          errorEventCount++
        })
        warningBadgeElement.addEventListener('clear-variations', () => {
          warningEventCount++
        })
        badgeGroupElement.dispatchEvent(new CustomEvent('clear-variations'))

        assert.equal(errorEventCount, 1)
        assert.equal(warningEventCount, 1)
      })

      it('mute triggers event on child badges', () => {
        let errorEventCount = 0
        let warningEventCount = 0

        errorBadgeElement.addEventListener('mute', () => {
          errorEventCount++
        })
        warningBadgeElement.addEventListener('mute', () => {
          warningEventCount++
        })
        badgeGroupElement.dispatchEvent(new CustomEvent('mute'))

        assert.equal(errorEventCount, 1)
        assert.equal(warningEventCount, 1)
      })

      it('fill triggers event on child badges', () => {
        let errorEventCount = 0
        let warningEventCount = 0

        errorBadgeElement.addEventListener('fill', () => {
          errorEventCount++
        })
        warningBadgeElement.addEventListener('fill', () => {
          warningEventCount++
        })
        badgeGroupElement.dispatchEvent(new CustomEvent('fill'))

        assert.equal(errorEventCount, 1)
        assert.equal(warningEventCount, 1)
      })
      it('reduce-size triggers event on child badges', () => {
        let errorEventCount = 0
        let warningEventCount = 0

        errorBadgeElement.addEventListener('reduce-size', () => {
          errorEventCount++
        })
        warningBadgeElement.addEventListener('reduce-size', () => {
          warningEventCount++
        })
        badgeGroupElement.dispatchEvent(new CustomEvent('reduce-size'))

        assert.equal(errorEventCount, 1)
        assert.equal(warningEventCount, 1)
      })
      it('enlarge triggers event on child badges', () => {
        let errorEventCount = 0
        let warningEventCount = 0

        errorBadgeElement.addEventListener('enlarge', () => {
          errorEventCount++
        })
        warningBadgeElement.addEventListener('enlarge', () => {
          warningEventCount++
        })
        badgeGroupElement.dispatchEvent(new CustomEvent('enlarge'))

        assert.equal(errorEventCount, 1)
        assert.equal(warningEventCount, 1)
      })
    })
    describe('update', () => {
      afterEach((done) => {
        fetchMock.reset()
        done()
      })

      it('update event updates badge contents and updates child badges',
          (done) => {

            const myMock = fetchMock.get(
                'http://example.com/content/resource.html',
                responseBody);

            let errorEventDetails = {}
            let warningEventDetails = {}
            badgeGroupElement.dispatchEvent(
                new CustomEvent('validation-badge-update'))

            errorBadgeElement.addEventListener('update-content', (event) => {
              errorEventDetails = event
            })
            warningBadgeElement.addEventListener('update-content', (event) => {
              warningEventDetails = event
            })

            setTimeout(function () {
              assert.equal(errorEventDetails.detail.content, 3)
              assert.equal(warningEventDetails.detail.content, 3)
              done();
            }, 10)
          })

    })
  })
})