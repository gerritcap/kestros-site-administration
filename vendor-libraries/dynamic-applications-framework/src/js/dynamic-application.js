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

import { InteractiveElementType } from './interactive-element-type'

/**
 * Dynamic Application which allows for interactive element types to be
 * registered to it.  When content is loaded, the DOM objects are checked
 * against the registered InteractiveElementTypes and registered as the
 * closest matching type.
 */
export class DynamicApplication {
  constructor (element, options) {
    this.element = element
    this._interactiveElementTypes = []
    this.options = options
    this.registerEventListeners()
  }

  /**
   * Whether the application is in debug mode.
   *
   * @returns {boolean} Whether the application is in debug mode.
   */
  get isDebugMode () {
    if (this.options !== null && typeof this.options !== 'undefined') {
      return this.options.debugMode === true
    }
    return false
  }

  /**
   * Registered InteractiveElement types.
   *
   * @returns {[]} Registered InteractiveElement types.
   */
  get interactiveElementTypes () {
    return this._interactiveElementTypes
  }

  /**
   * Registers event listener to begin initializing InteractiveElements within
   * a DynamicContentArea when any have finished loading.
   */
  registerEventListeners () {
    document.addEventListener('dynamic-content-loaded', (event) => {
      this.initializeInteractiveElements(event.detail.element)
    })
  }

  /**
   * Initializes all InteractiveElements within a specified element.  To be
   * initialized, elements must match the selector of an InteractiveElement type.
   *
   * Elements that match multiple InteractiveElement type selectors will be
   * registered to the one with the highest specificity.
   *
   * @param {HTMLElement} element - Element to initialize ancestors from.
   */
  initializeInteractiveElements (element) {
    if (element !== null && typeof element !== 'undefined') {
      for (const interactiveElementType of this.interactiveElementTypes) {
        for (const contentElement of
          element.querySelectorAll(interactiveElementType.selector)) {
          if (!contentElement.dataset.registered) {
            const interactiveElement = new interactiveElementType.type( // eslint-disable-line new-cap
              contentElement)
            if (typeof interactiveElement.register !== 'undefined') {
              interactiveElement.register()
            }
            if (this.isDebugMode) {
              contentElement.setAttribute('data-registered-as',
                interactiveElementType.type.name)
            }
          }
        }
      }
    }
  }

  /**
   * Registers and InteractiveElement type to the application.
   *
   * @param {string} selector - Selector of elements that will be registered as the specified
   * type.
   * @param {object} type - Class which extends InteractiveElement.
   */
  registerInteractiveElementType (selector, type) {
    this.interactiveElementTypes.push(
      new InteractiveElementType(selector, type))
    this.interactiveElementTypes.sort(
      this.specificityComperator())
  }

  /**
   * Compares the specificity of two InteractiveElement types.
   *
   * @returns {function(*, *): number} Which selector is more specific.
   */
  specificityComperator () {
    return function (a, b) {
      return a.specificity > b.specificity ? -1 : 1
    }
  }
}
