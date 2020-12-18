import { InteractiveElement } from 'dynamic-applications-framework/src/js/interactive-element'
import { ValidationBadgeGroup } from '../validation-badge/validation-badge-group'

/**
 * Root Level Sidebar Item that collapses into the sidebar spine.
 */
export class SidebarSpineItem extends InteractiveElement {
  /**
   * Path to the associated site admin page.
   *
   * @returns {string} Path to the associated site admin page.
   */
  get path () {
    return this.element.dataset.path
  }

  /**
   * Whether the current spine item is active.
   *
   * @returns {boolean} Whether the current spine item is active.
   */
  get isActive () {
    return this.element.classList.contains('sidebar__spine-item--active')
  }

  /**
   * Whether a child of the current spine item is active.
   *
   * @returns {boolean} Whether a child of the current spine item is active.
   */
  get isChildActive () {
    if (document.querySelector('.sidebar-item.active') !== null) {
      return document.querySelector('.sidebar-item.active').datasetpath ===
          this.path
    }
    return false
  }

  /**
   * Spine item title.
   *
   * @returns {string} Spine item title.
   */
  get title () {
    return this.element.dataset.title
  }

  /**
   * Whether the spine item is currently collapsed.
   *
   * @returns {boolean} Whether the spine item is currently collapsed.
   */
  get isCollapsed () {
    return this.element.classList.contains('sidebar__spine-item--collapsed')
  }

  /**
   * Title text element.
   *
   * @returns {InteractiveElement} Title text element.
   */
  get titleTextElement () {
    return new InteractiveElement(
      this.element.querySelector('.context-link__title'))
  }

  /**
   * Tooltip bubble element.
   *
   * @returns {InteractiveElement} Tooltip bubble element.
   */
  get tooltipBubble () {
    return new InteractiveElement(this.element.querySelector('.tooltipBubble'))
  }

  /**
   * Path to sidebar content, to load when the item gets collapsed ( if it has a submenu).
   *
   * @returns {string} Path to sidebar content, to load when the item gets collapsed ( if it has a submenu).
   */
  get sidebarPath () {
    if (this.submenu) {
      return this.element.dataset.sidebarPath
    }
    return ''
  }

  /**
   * Path to actionbar content to load on click.
   *
   * @returns {string} Path to actionbar content to load on click.
   */
  get actionbarPath () {
    return this.element.dataset.actionbarPath
  }

  /**
   * Path to content area content to load on click.
   *
   * @returns {string} Path to content area content to load on click.
   */
  get contentAreaPath () {
    return this.element.dataset.contentAreaPath
  }

  /**
   * Whether the spine item has a submenu.
   *
   * @returns {boolean} Whether the spine item has a submenu.
   */
  get submenu () {
    return Boolean(this.element.hasAttribute('data-submenu'))
  }

  /**
   * ValidationBadgeGroup element.
   *
   * @returns {HTMLElement} ValidationBadgeGroup element.
   */
  get validationBadgeGroupElement () {
    return this.element.querySelector('.badge-group.validation-badges')
  }

  /**
   * Collapses the current item. To show only the icon.
   */
  collapse () {
    this.element.classList.add('tooltip')
    this.element.classList.add('tooltip--right')
    this.element.classList.add('sidebar__spine-item--collapsed')
    this.titleTextElement.hide()
  }

  /**
   * Expands the current item.
   */
  expand () {
    this.element.classList.remove('tooltip')
    this.element.classList.remove('tooltip--right')
    this.element.classList.remove('sidebar__spine-item--collapsed')
    this.titleTextElement.show()
  }

  /**
   * Registers event listeners.
   */
  registerEventListeners () {
    document.addEventListener('kestros-sidebar-update', (event) => {
      if (this.path !== '/libs/kestros/site-admin.html') {
        if (event.detail.path.startsWith(this.path.split('.html')[0])) {
          this.setActive()
        }
      }
    })

    document.addEventListener('kestros-sidebar-component-area-update', () => {
      if (window.location.pathname.split('.html')[0] === this.path.split(
        '.html')[0]) {
        this.setActive()
      }
    })

    document.addEventListener('kestros-sidebar-component-area-update',
      (event) => {
        if (this.path !== null && typeof this.path !== 'undefined') {
          if (this.path.split('.html')[0] !== '/libs/kestros/site-admin') {
            if (window.location.pathname.split(
              '.html')[0].startsWith(this.path.split('.html')[0])) {
              const newSidebarContent = event.detail !== null &&
                    typeof event.detail !==
                    'undefined' && event.detail.path !==
                    '/libs/kestros/site-admin/jcr:content/sidebar/content-area.html'
              if (this.submenu || newSidebarContent) {
                document.dispatchEvent(
                  new Event('sidebar-root-navigation-collapse'))
              } else {
                document.dispatchEvent(
                  new Event('sidebar-root-navigation-expand'))
              }
              this.setActive()
            }
          }
        }
      })

    document.addEventListener('sidebar-root-navigation-collapse', () => {
      this.setInactive()
      this.collapse()
    })

    document.addEventListener('sidebar-root-navigation-expand', () => {
      this.setInactive()
      this.tooltipBubble.hide()
      this.expand()
    })

    this.element.addEventListener('transitionend', () => {
      if (this.isCollapsed) {
        this.tooltipBubble.show()
      } else {
        this.tooltipBubble.hide()
      }
    })

    this.element.addEventListener('click', (event) => {
      event.preventDefault()

      if (!this.disabled && !this.isChildActive) {
        document.title = this.title

        const urlPath = this.path
        window.history.pushState({}, '', urlPath)

        if (this.submenu) {
          document.dispatchEvent(new Event('sidebar-root-navigation-collapse'))

          document.dispatchEvent(
            new CustomEvent('kestros-sidebar-component-area-update', {
              detail: {
                path: this.sidebarPath,
                context: ''
              }
            }))
        } else {
          document.dispatchEvent(new Event('sidebar-root-navigation-expand'))
        }

        document.dispatchEvent(new CustomEvent('kestros-actionbar-update', {
          detail: {
            path: this.actionbarPath
          }
        }))

        document.dispatchEvent(new CustomEvent('kestros-content-area-update', {
          detail: {
            path: this.contentAreaPath
          }
        }))
        this.setActive()
      }
    })
  }

  /**
   * Sets the spine item to an active state.
   */
  setActive () {
    this.element.classList.add('sidebar__spine-item--active')
    this.element.dispatchEvent(new Event('sidebar-item-active'))
    if (this.validationBadgeGroupElement !== null) {
      this.validationBadgeGroupElement.dispatchEvent(new CustomEvent(
        ValidationBadgeGroup.events.FILL_ALL))
    }
  }

  /**
   * Sets the spine item to an inactive state.
   */
  setInactive () {
    this.element.classList.remove('sidebar__spine-item--active')
    this.element.dispatchEvent(new Event('sidebar-item-inactive'))
    if (this.validationBadgeGroupElement !== null) {
      this.validationBadgeGroupElement.dispatchEvent(new CustomEvent(
        ValidationBadgeGroup.events.MUTE_ALL))
    }
  }
}
