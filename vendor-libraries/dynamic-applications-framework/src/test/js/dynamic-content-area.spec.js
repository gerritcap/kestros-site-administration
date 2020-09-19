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

import {DynamicContentArea} from '../../js/dynamic-content-area'

describe('DynamicContentArea', () => {
  jsdom({url: 'http://localhost'})


  const responseBody = {
    response: 'data from the server'
  };

  const successfulResponse = {
    status: 200,
    body: responseBody,
    url: 'http://example.com/content/resource.html',
    headers: {
      'Content-Type': 'text/html'
    }
  }

  describe('initialize', () => {
    it('when element is null', () => {
      let dynamicContentArea = new DynamicContentArea(null);

      assert.notEqual(dynamicContentArea, null)
    })

    it('when has element', () => {
      let element = document.createElement('div')

      let dynamicContentArea = new DynamicContentArea(element);

      assert.notEqual(dynamicContentArea, null)
      assert.equal(3, dynamicContentArea.allowedErrorRetries)
      assert.equal(0, dynamicContentArea.errorRetryCount)
    })
  })

  describe('get path', () => {
    it('no pat set', () => {
      let element = document.createElement('div')

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal(undefined, dynamicContentArea.path)
    })
    it('has path', () => {
      let element = document.createElement('div')
      element.setAttribute('data-path', '/path')

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal('/path', dynamicContentArea.path)
    })

    it('request path', () => {
      let element = document.createElement('div')
      element.setAttribute('data-path', '/path')

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal('/path.html', dynamicContentArea.requestPath)
    })
  })

  describe('update content', () => {
    afterEach((done) => {
      fetchMock.reset()
      done()
    })

    it('update to new content path', (done) => {
      let element = document.createElement('div')
      let contentArea = document.createElement('div')
      contentArea.classList.add('content-area')
      element.appendChild(contentArea)

      let dynamicContentArea = new DynamicContentArea(element);

      const myMock = fetchMock.get('http://example.com/content/resource.html',
          successfulResponse);

      dynamicContentArea.updateContent(
          'http://example.com/content/resource.html')
      dynamicContentArea.loadContent()

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)

      assert.equal(true,
          myMock.called('http://example.com/content/resource.html'))

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)
      assert.equal(dynamicContentArea.errorRetryCount, 0)
      setTimeout(function () {
        assert.equal(true, dynamicContentArea.contentArea.isVisible)
        assert.equal(false, dynamicContentArea.loader.isVisible)
        done();
      }, 10)
    })

    it('request fails', (done) => {
      let element = document.createElement('div')
      element.setAttribute("data-allowed-error-retries",
          '0')
      let contentArea = document.createElement('div')
      contentArea.classList.add('content-area')
      element.appendChild(contentArea)

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal(dynamicContentArea.allowedErrorRetries, 0)

      const myMock = fetchMock.once('http://example.com/content/resource.html',
          {
            status: 404
          }, {method: 'GET'});

      nodeFetch.default = myMock;

      dynamicContentArea.updateContent(
          'http://example.com/content/resource.html')

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)

      assert.equal(true,
          myMock.called('http://example.com/content/resource.html'))

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)
      setTimeout(function () {
        assert.equal(false, dynamicContentArea.contentArea.isVisible)
        assert.equal(0, dynamicContentArea.errorRetryCount)
        done();
      }, 10)
    })

    it('retry request allowed', (done) => {

      let count = 0

      let element = document.createElement('div')
      element.setAttribute("data-allowed-error-retries",
          '3')

      element.addEventListener('dynamic-content-failed', () => {
        count++
      })

      let contentArea = document.createElement('div')
      contentArea.classList.add('content-area')
      let loader = document.createElement('div')
      loader.classList.add('loader')

      element.appendChild(contentArea)
      element.appendChild(loader)

      let dynamicContentArea = new DynamicContentArea(element);

      fetchMock.get(`*`, 404, {overwriteRoutes: false, repeat: 3});
      fetchMock.get(`*`, {
        status: 200,
        body: responseBody,
        headers: {
          'Content-Type': 'text/html'
        }
      }, {overwriteRoutes: false, repeat: 1});

      dynamicContentArea.updateContent(
          'http://example.com/content/resource.html')

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)
      setTimeout(function () {
        assert.equal(0, dynamicContentArea.errorRetryCount)
        assert.equal(count, 1)
        done();
      }, 10)
    })

    it('retry request failed then succeeds', (done) => {
      let count = 0

      let element = document.createElement('div')
      element.setAttribute("data-allowed-error-retries",
          '3')

      element.addEventListener('dynamic-content-failed', () => {
        count++
      })
      let contentArea = document.createElement('div')
      contentArea.classList.add('content-area')
      let loader = document.createElement('div')
      loader.classList.add('loader')

      element.appendChild(contentArea)
      element.appendChild(loader)

      let dynamicContentArea = new DynamicContentArea(element);

      fetchMock.get(`*`, 404, {overwriteRoutes: false, repeat: 1});
      fetchMock.get(`*`, {
        status: 200,
        body: responseBody,
        headers: {
          'Content-Type': 'text/html'
        }
      }, {overwriteRoutes: false, repeat: 1});

      dynamicContentArea.updateContent(
          'http://example.com/content/resource.html')

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)
      setTimeout(function () {
        assert.equal(0, dynamicContentArea.errorRetryCount)
        assert.equal(count, 0)
        done();
      }, 10)
    })
  })
  describe('register', () => {

    afterEach((done) => {
      fetchMock.reset()
      done()
    })

    it('registration loads content', (done) => {
      let element = document.createElement('div')
      let contentArea = document.createElement('div')
      contentArea.classList.add('content-area')
      element.appendChild(contentArea)

      let dynamicContentArea = new DynamicContentArea(element);

      const myMock = fetchMock.get('http://example.com/content/resource.html',
          successfulResponse);

      dynamicContentArea.updateContent(
          'http://example.com/content/resource.html')
      dynamicContentArea.register()

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)

      assert.equal(true,
          myMock.called('http://example.com/content/resource.html'))

      assert.equal('http://example.com/content/resource.html',
          dynamicContentArea.path)
      assert.equal(dynamicContentArea.errorRetryCount, 0)
      setTimeout(function () {
        assert.equal('true', dynamicContentArea.element.dataset.registered)
        assert.equal(true, dynamicContentArea.contentArea.isVisible)
        assert.equal(false, dynamicContentArea.loader.isVisible)
        done();
      }, 10)
    })
  })
  describe('loader', () => {
    it('when has loaded', () => {
      let element = document.createElement('div')
      let loader = document.createElement('div')
      loader.classList.add('loader')
      element.appendChild(loader)

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal(dynamicContentArea.loader.element, loader)
    })
    it('when no loader element', () => {
      let element = document.createElement('div')

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal(dynamicContentArea.loader.element, null)
    })
  })

  describe('content area', () => {
    it('when has content area', () => {
      let element = document.createElement('div')
      let contentArea = document.createElement('div')
      contentArea.classList.add('content-area')
      element.appendChild(contentArea)

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal(dynamicContentArea.contentArea.element, contentArea)
    })
    it('when no content area', () => {
      let element = document.createElement('div')

      let dynamicContentArea = new DynamicContentArea(element);

      assert.equal(dynamicContentArea.loader.element, null)
    })
  })

  describe('is loading', () => {
    it('when loader is hidden', () => {
      let element = document.createElement('div')
      let loader = document.createElement('div')
      loader.classList.add('loader')
      element.appendChild(loader)

      let dynamicContentArea = new DynamicContentArea(element);
      dynamicContentArea.loader.hide()

      assert.equal(dynamicContentArea.isLoading, false)
    })

    it('when loader is visible', () => {
      let element = document.createElement('div')
      let loader = document.createElement('div')
      loader.classList.add('loader')
      element.appendChild(loader)

      let dynamicContentArea = new DynamicContentArea(element);
      dynamicContentArea.loader.show()

      assert.equal(dynamicContentArea.isLoading, true)
    })

  })

  describe('showLoading', () => {
    it('when content area and loader exist', () => {
      let element = document.createElement('div')
      let loader = document.createElement('div')
      loader.classList.add('loader')
      let contentArea = document.createElement('div')
      contentArea.classList.add('content-area')

      element.appendChild(loader)
      element.appendChild(contentArea)

      let dynamicContentArea = new DynamicContentArea(element);
      dynamicContentArea.showLoading()

      assert.equal(dynamicContentArea.isLoading, true)
    })
    it('when loader does not exist', () => {
      let element = document.createElement('div')

      let dynamicContentArea = new DynamicContentArea(element);
      dynamicContentArea.showLoading()

      assert.equal(dynamicContentArea.isLoading, false)
    })
  })
})