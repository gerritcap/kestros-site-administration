const jsdom = require("jsdom-global")
const assert = require('assert')

import { SidebarSpineItem } from '../../../js/sidebar/sidebar-spine-item'

describe('Sidebar Spine Item', () => {
  jsdom(``, {
    url: 'https://example.org/path.html'
  })

  afterEach(() => {
    jsdom(``, {
      url: 'https://example.org/path.html'
    })
  })

  describe('initialize', () => {

    it('initializes', () => {
      let element = document.createElement('li')
      let spineItem = new SidebarSpineItem(element)

      assert.notEqual(null, spineItem)
    })

    it('sets active when path is same as window.location', () => {
      let element = document.createElement('li')
      element.setAttribute('data-path', '/path.html')
      let spineItem = new SidebarSpineItem(element)

      assert.equal(false, spineItem.isActive)
    })

    it('sets active when path is same as window.location and sidebar root is updated',
        () => {
          let element = document.createElement('li')
          element.setAttribute('data-path', '/path.html')
          let spineItem = new SidebarSpineItem(element)
          spineItem.registerEventListeners()

          assert.equal(false, spineItem.isActive)

          document.dispatchEvent(
              new Event('kestros-sidebar-component-area-update'))
          assert.equal(spineItem.isActive, true)
        })

    it('not active when path is different from window.location', () => {
      let element = document.createElement('li')

      element.setAttribute('data-path', '/different-path.html')
      let spineItem = new SidebarSpineItem(element)

      assert.equal(false, spineItem.isActive)
    })

    it('dispatches sidebar-root-navigation-collapse when has submenu', () => {
      let count = 0
      document.addEventListener('sidebar-root-navigation-collapse', () => {
        count += 1
      })
      let element = document.createElement('li')
      element.setAttribute('data-path', '/path.html')
      element.setAttribute('data-submenu', 'true')

      let spineItem = new SidebarSpineItem(element)
      spineItem.registerEventListeners()

      document.dispatchEvent(new Event('kestros-sidebar-component-area-update'))

      assert.equal(1, count)
    })

    it('dispatches sidebar-root-navigation-expand when does not have submenu',
        () => {
          let count = 0
          document.addEventListener('sidebar-root-navigation-expand', () => {
            count += 1
          })
          let element = document.createElement('li')
          element.setAttribute('data-path', '/path.html')

          let spineItem = new SidebarSpineItem(element)
          spineItem.registerEventListeners()

          document.dispatchEvent(
              new Event('kestros-sidebar-component-area-update'))

          assert.equal(1, count)
        })
  })

  it('path', () => {
    let element = document.createElement('li')
    element.setAttribute('data-path', '/path.html')
    let spineItem = new SidebarSpineItem(element)

    assert.equal('/path.html', spineItem.path)
  })

  it('title', () => {
    let element = document.createElement('li')
    element.setAttribute('data-title', 'Title')
    let spineItem = new SidebarSpineItem(element)

    assert.equal('Title', spineItem.title)
  })

  describe('active', () => {
    it('set active', () => {
      let element = document.createElement('li')
      let spineItem = new SidebarSpineItem(element)

      spineItem.setActive()

      assert.equal(true,
          spineItem.element.classList.contains('sidebar__spine-item--active'))
      assert.equal(true, spineItem.isActive)
    })
    it('set inactive', () => {
      let element = document.createElement('li')
      let spineItem = new SidebarSpineItem(element)

      spineItem.setActive()
      spineItem.setInactive()

      assert.equal(false,
          spineItem.element.classList.contains('sidebar__spine-item--active'))
      assert.equal(false, spineItem.isActive)
    })
  })

  describe('expand/collapse', () => {
    it('collapse', () => {
      let element = document.createElement('li')
      let spineItem = new SidebarSpineItem(element)

      spineItem.collapse()

      assert.equal(true,
          spineItem.element.classList.contains(
              'sidebar__spine-item--collapsed'))
      assert.equal(true, spineItem.isCollapsed)

    })

    it('expand', () => {
      let element = document.createElement('li')
      let spineItem = new SidebarSpineItem(element)

      spineItem.collapse()
      spineItem.expand()

      assert.equal(false,
          spineItem.element.classList.contains(
              'sidebar__spine-item--collapsed'))
      assert.equal(false, spineItem.isCollapsed)

    })
  })

  describe('sidebar path', () => {
    it('when has submenu', () => {
      let element = document.createElement('li')
      element.setAttribute('data-sidebar-path', '/sidebar')
      element.setAttribute('data-submenu', 'true')
      let spineItem = new SidebarSpineItem(element)

      assert.equal('/sidebar', spineItem.sidebarPath)
    })

    it('when no submenu', () => {
      let element = document.createElement('li')
      element.setAttribute('data-sidebar', '/sidebar')
      let spineItem = new SidebarSpineItem(element)

      assert.equal('', spineItem.sidebarPath)
    })

  })

  it('actionbar path', () => {
    let element = document.createElement('li')
    element.setAttribute('data-actionbar-path', '/actionbar')
    let spineItem = new SidebarSpineItem(element)

    assert.equal('/actionbar', spineItem.actionbarPath)
  })

  it('content area path', () => {
    let element = document.createElement('li')
    element.setAttribute('data-content-area-path', '/content-area')
    let spineItem = new SidebarSpineItem(element)

    assert.equal('/content-area', spineItem.contentAreaPath)
  })

  it('tooltip bubble', () => {
    let element = document.createElement('li')
    let tooltipBubble = document.createElement('span')
    tooltipBubble.classList.add('tooltipBubble')
    element.append(tooltipBubble)
    let spineItem = new SidebarSpineItem(element)

    assert.notEqual(null, spineItem.tooltipBubble.element)
  })

  describe('register event listeners', () => {
    describe('click', () => {
      it('activates item when not disabled and not active', () => {
        let element = document.createElement('li')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        element.dispatchEvent(new Event('click'))

        assert.equal(true, spineItem.isActive)
      })

      it('does not activate item when disabled and not active', () => {
        let element = document.createElement('li')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.disable()

        element.dispatchEvent(new Event('click'))

        assert.equal(false, spineItem.isActive)
      })

      it('does not activate item when not disabled and active', () => {
        let element = document.createElement('li')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.setActive()

        element.dispatchEvent(new Event('click'))

        assert.equal(true, spineItem.isActive)

        spineItem.setInactive()
        assert.equal(false, spineItem.isActive)
      })
      it('triggers sidebar-root-navigation-collapse when has submenu', () => {
        let count = 0
        document.addEventListener('sidebar-root-navigation-collapse', () => {
          count += 1
        })
        let element = document.createElement('li')
        element.setAttribute('data-submenu', 'true')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()

        element.dispatchEvent(new Event('click'))

        assert.equal(1, count)
      })
      it('triggers kestros-sidebar-component-area-update when has submenu',
          () => {
            let count = 0
            document.addEventListener('sidebar-root-navigation-collapse',
                () => {
                  count += 1
                })
            let element = document.createElement('li')
            element.setAttribute('data-submenu', 'true')
            let spineItem = new SidebarSpineItem(element)
            spineItem.registerEventListeners()

            element.dispatchEvent(new Event('click'))
            assert.equal(1, count)
          })
    })

    describe('kestros-sidebar-component-area-update', () => {
      it('sets active when same page', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('kestros-sidebar-component-area-update'))

        assert.equal(true, spineItem.isActive)
      })
      it('does not set active when same page', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/different-path.html')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('kestros-sidebar-component-area-update'))

        assert.equal(false, spineItem.isActive)
      })
    })

    describe('kestros-sidebar-component-area-update', () => {
      it('sets active when same page', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('kestros-sidebar-component-area-update'))

        assert.equal(true, spineItem.isActive)
      })

      it('triggers root navigation collapse when has submenu', () => {

        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        element.setAttribute('data-submenu', 'true')

        let spineItem = new SidebarSpineItem(element)

        let count = 0
        document.addEventListener('sidebar-root-navigation-collapse', () => {
          count += 1
        })

        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('kestros-sidebar-component-area-update'))

        assert.equal(true, spineItem.isActive)
        assert.equal(1, count)
      })
    })

    describe('sidebar-root-navigation-ready', () => {

      it('does not set active when same page', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/different-path.html')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('sidebar-root-navigation-ready'))

        assert.equal(false, spineItem.isActive)
      })

    })

    describe('sidebar-component-area-update', () => {
      it('sets active when same page', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('kestros-sidebar-component-area-update'))

        assert.equal(true, spineItem.isActive)
      })
      it('does not set active when same page', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/different-path.html')
        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('sidebar-component-area-ready'))

        assert.equal(false, spineItem.isActive)
      })

      it('triggers root navigation collapse when has submenu', () => {

        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        element.setAttribute('data-submenu', 'true')

        let spineItem = new SidebarSpineItem(element)

        let count = 0
        document.addEventListener('sidebar-root-navigation-collapse', () => {
          count += 1
        })

        spineItem.registerEventListeners()
        document.dispatchEvent(
            new Event('kestros-sidebar-component-area-update'))

        assert.equal(true, spineItem.isActive)
        assert.equal(1, count)
      })
    })

    describe('sidebar-root-navigation-collapse', () => {
      it('goes inactive when sidebar is collapsed', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        element.setAttribute('data-submenu', 'true')

        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.setActive()

        assert.equal(true, spineItem.isActive)
        document.dispatchEvent(new Event('sidebar-root-navigation-collapse'))
        assert.equal(false, spineItem.isActive)
      })
      it('collapses when sidebar is collapsed', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        element.setAttribute('data-submenu', 'true')

        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.setActive()

        assert.equal(false, spineItem.isCollapsed)
        document.dispatchEvent(new Event('sidebar-root-navigation-collapse'))
        assert.equal(true, spineItem.isCollapsed)
      })
    })

    describe('sidebar-root-navigation-expand', () => {
      it('goes inactive when sidebar is expanded', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        element.setAttribute('data-submenu', 'true')

        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.collapse()

        assert.equal(true, spineItem.isCollapsed)
        document.dispatchEvent(new Event('sidebar-root-navigation-expand'))
        assert.equal(false, spineItem.isCollapsed)
      })
      it('expands when sidebar is expanded', () => {
        let element = document.createElement('li')
        element.setAttribute('data-path', '/path.html')
        element.setAttribute('data-submenu', 'true')

        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.collapse()

        assert.equal(true, spineItem.isCollapsed)
        document.dispatchEvent(new Event('sidebar-root-navigation-expand'))
        assert.equal(false, spineItem.isCollapsed)
      })
    })

    describe('transitionend', () => {
      it('shows tooltip bubble if collapsed', () => {
        let element = document.createElement('li')
        let tooltipBubble = document.createElement('span')
        tooltipBubble.classList.add('tooltipBubble')
        element.append(tooltipBubble)

        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.collapse()

        element.dispatchEvent(new Event('transitionend'))

        assert.equal(true, spineItem.tooltipBubble.isVisible)

      })

      it('hides tooltip bubble if not collapsed', () => {
        let element = document.createElement('li')
        let tooltipBubble = document.createElement('span')
        tooltipBubble.classList.add('tooltipBubble')
        element.append(tooltipBubble)

        let spineItem = new SidebarSpineItem(element)
        spineItem.registerEventListeners()
        spineItem.expand()

        element.dispatchEvent(new Event('transitionend'))

        assert.equal(false, spineItem.tooltipBubble.isVisible)

      })
    })

  })
})