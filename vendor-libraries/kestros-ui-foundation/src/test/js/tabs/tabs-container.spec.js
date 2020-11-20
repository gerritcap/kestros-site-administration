let jsdom = require('jsdom-global')
let assert = require('assert');

jsdom({url: 'http://localhost'})

import {TabsContainer} from '../../../js/tabs/tabs-container'

describe("Tabs Container", () => {
  let containerElement = document.createElement('div')
  containerElement.setAttribute('data-name', 'container-1')
  let tab1 = document.createElement('div')
  let tab2 = document.createElement('div')
  tab1.classList.add('tab')
  tab2.classList.add('tab')
  tab1.setAttribute('data-name', 'tab-1')
  tab2.setAttribute('data-name', 'tab-2')
  containerElement.appendChild(tab1)
  containerElement.appendChild(tab2)
  let container = new TabsContainer(containerElement)
  container.registerEventListeners()

  describe('initialization', () => {
    it('not null when initialized', () => {
      assert.notEqual(container, null)
    })
  })
  it('get name', () => {
    assert.equal(container.name, 'container-1')
  })

  describe('events', () => {
    describe('tabs-reset', () => {
      it('activates 0 index tab', () => {
        let selectedName = ''
        containerElement.addEventListener('tab-selected', (event) => {
          selectedName = event.detail.name
        })
        containerElement.dispatchEvent(
            new CustomEvent('tabs-reset', container.getEvent('tab-1')))
        assert.equal(selectedName, 'tab-1')
      })
    })
  })
  describe('tab-selected', () => {
    it('triggers tab-activate-before', () => {
      let selectedName = ''
      containerElement.addEventListener('tab-activate-before', (event) => {
        selectedName = event.detail.name
      })
      containerElement.dispatchEvent(
          new CustomEvent('tab-selected', container.getEvent('tab-1')))
      assert.equal(selectedName, 'tab-1')
    })
    it('triggers tab-activate', () => {
      let selectedName = ''
      containerElement.addEventListener('tab-activate', (event) => {
        selectedName = event.detail.name
      })
      containerElement.dispatchEvent(
          new CustomEvent('tab-selected', container.getEvent('tab-1')))
      assert.equal(selectedName, 'tab-1')
    })
    it('triggers tab-activate-after', () => {
      let selectedName = ''
      containerElement.addEventListener('tab-activate-after', (event) => {
        selectedName = event.detail.name
      })
      containerElement.dispatchEvent(
          new CustomEvent('tab-selected', container.getEvent('tab-1')))
      assert.equal(selectedName, 'tab-1')
    })
  })
})