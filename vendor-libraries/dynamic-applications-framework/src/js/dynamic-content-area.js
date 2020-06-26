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

import { InteractiveElement } from './interactive-element'

/**
 * Container element which can dynamically load in content from an external resource.
 */
export class DynamicContentArea extends InteractiveElement {
  /**
   * Constructs DynamicContentArea.
   *
   * @param {HTMLElement} element - Container element.
   */
  constructor (element) {
    super(element)
    this.allowedErrorRetries = 3
    this._loader = null
    this._contentArea = null
    if (this.element !== null && typeof this.element !== 'undefined') {
      if (typeof this.element.dataset.allowedErrorRetries !== 'undefined') {
        this.allowedErrorRetries = this.element.dataset.allowedErrorRetries
      }
      this.errorRetryCount = 0
    }
  }

  /**
   * Path to the resource that is dynamically loaded.
   *
   * @returns {string} Path to the resource that is dynamically loaded.
   */
  get path () {
    return this.element.dataset.path
  }

  /**
   * The loader Element associated to the current section.
   *
   * @returns {InteractiveElement} Loader Element.
   */
  get loader () {
    if (this._loader === null) {
      if (this.element !== null && typeof this.element !== 'undefined') {
        this._loader = new InteractiveElement(
          this.element.querySelector('.loader'))
      }
    }
    return this._loader
  }

  /**
   * The content area of the current dynamic section.
   *
   * @returns {InteractiveElement} The content area of the current dynamic section.
   */
  get contentArea () {
    if (this._contentArea === null) {
      if (this.element !== null && typeof this.element !== 'undefined') {
        this._contentArea = new InteractiveElement(
          this.element.querySelector('.content-area'))
      }
    }
    return this._contentArea
  }

  /**
   * Whether the section is currently loading.
   *
   * @returns {boolean} Whether the section is currently loading.
   */
  get isLoading () {
    return this.loader.isVisible
  }

  get requestPath () {
    if (this.path !== null && typeof this.path !== 'undefined') {
      let requestedPath = this.path
      if (!requestedPath.includes('.html')) {
        requestedPath += '.html'
      }
      return requestedPath
    }
    return undefined
  }

  register () {
    this.loadContent()
    return super.register()
  }

  registerEventListeners () {
    super.registerEventListeners()
    this.element.addEventListener('dynamic-content-refresh', () => {
      this.loadContent()
    })
  }

  /**
   * Updates the resource that is to be dynamically reloaded, then reloads the content section.
   *
   * @param {string} path - Path to the resource that is dynamically loaded.
   * @returns {void}
   */
  updateContent (path) {
    // TODO can we avoid the issue where mismatches occur when clicking links while content area is loading??
    // if (!this.isLoading) {
    this.element.setAttribute('data-path', path)
    this.loadContent()
    // }
  }

  loadContent () {
    this.showLoading()
    this.element.dispatchEvent(new Event('dynamic-content-loading'))
    if (this.requestPath !== null && typeof this.requestPath !== 'undefined') {
      fetch(this.requestPath, {
        method: 'GET',
        credentials: 'same-origin'
      })
        .then((res) => {
          if (res.ok && res.status === 200) {
            return res.text()
          }
        }).then((html) => {
          if (typeof html !== 'undefined') {
            this.contentArea.element.innerHTML = html
            this.showContent()

            document.dispatchEvent(new CustomEvent('dynamic-content-loaded', {
              detail: {
                element: this.element
              }
            }))
            this.element.dispatchEvent(new Event('dynamic-content-loaded'))

            this.errorRetryCount = 0
          } else {
            this.errorRetryCount += 1
            if (this.allowedErrorRetries > this.errorRetryCount) {
              this.loadContent()
            } else {
              this.element.dispatchEvent(new Event('dynamic-content-failed'))
              this.errorRetryCount = 0
            }
          }
        })
    }
  }

  showLoading () {
    this.element.style.height = this.element.offsetHeight
    this.loader.show()
    this.contentArea.hide()
  }

  showContent () {
    this.element.style.height = ''
    this.element.style.minHeight = ''
    this.loader.hide()
    this.contentArea.show()
  }
}
