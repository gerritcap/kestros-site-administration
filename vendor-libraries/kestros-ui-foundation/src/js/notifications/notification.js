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

import { NotificationBoard } from './notification-board'

/**
 * Notification which is created by and rendered withing a NotificationBoard.
 */
export class Notification {
  /**
   * Constructs and renders a new notification element.
   *
   * @param {string} title - Title.
   * @param {string} message - Message.
   * @param {string} url - URL.
   * @param {string} type - Type.
   * @param {integer} expirationTime - Time before notification automatically closes.
   * @param {integer} index - Notification index.
   * @param {NotificationBoard} board - Parent board.
   */
  constructor (title, message, url, type, expirationTime, index, board) {
    this._title = title
    this._message = message
    this._url = url
    this._type = type
    this._expirationTime = expirationTime
    this._index = index
    this._board = board
  }

  /**
   * Notification events.
   *
   * @returns {{CLEAR_NOTIFICATION: string}} Notification events.
   */
  static get events () {
    return {
      CLEAR_NOTIFICATION: 'clear-notification'
    }
  }

  /**
   * Notification DOM element.
   *
   * @returns {HTMLDivElement} Notification DOM element.
   */
  get element () {
    return this._element
  }

  /**
   * Notification close icon element.
   *
   * @returns {Element} Notification close icon element.
   */
  get closeIcon () {
    return this._element.querySelector('.notification__close-icon')
  }

  /**
   * Notification title.
   *
   * @returns {string} Notification title.
   */
  get title () {
    return this.element.dataset.title
  }

  /**
   * Notification message.
   *
   * @returns {string} Notification message.
   */
  get message () {
    return this.element.dataset.message
  }

  /**
   * Notification expiration time.
   *
   * @returns {integer} Notification expiration time.
   */
  get expirationTime () {
    return this.element.dataset.exiprationTime
  }

  /**
   * Notification type.
   *
   * @returns {string} Notification type.
   */
  get type () {
    return this.element.dataset.type
  }

  /**
   * Notification index.
   *
   * @returns {integer} Notification index.
   */
  get index () {
    return this.element.dataset.index
  }

  /**
   * Sets the notification index.
   *
   * @param {integer} index - New index value.
   */
  set index (index) {
    this._index = index
    this.element.setAttribute('data-index', index)
  }

  /**
   * Creates the notification DOM elements.
   */
  create () {
    const notification = document.createElement('div')

    notification.setAttribute('data-title', this._title)
    notification.setAttribute('data-message', this._message)
    notification.setAttribute('data-type', this._type)
    notification.setAttribute('data-index', this._index)

    notification.classList.add('notification')
    notification.classList.add('notification--' + this._type)

    const notificationHeader = document.createElement('div')
    notificationHeader.classList.add('notification__header')
    const notificationTitle = document.createElement('div')
    notificationTitle.classList.add('notification__title')
    notificationTitle.innerText = this._title

    const closeIconWrapper = document.createElement('div')

    closeIconWrapper.classList.add('notification__close-icon')
    const icon = document.createElement('i')
    icon.classList.add('fas')
    icon.classList.add('fa-times')
    closeIconWrapper.appendChild(icon)

    notificationHeader.appendChild(notificationTitle)
    notificationHeader.appendChild(closeIconWrapper)

    const notificationBody = document.createElement('div')
    notificationBody.classList.add('notification__body')

    if (this._url !== '#' && this._url !== '' && typeof this._url !==
        'undefined') {
      const bodyAnchor = document.createElement('a')
      bodyAnchor.innerText = this._message
      bodyAnchor.setAttribute('href', this._url)
      bodyAnchor.setAttribute('target', '_blank')
      notificationBody.appendChild(bodyAnchor)
    } else {
      notificationBody.innerText = this._message
    }

    notification.appendChild(notificationHeader)
    notification.appendChild(notificationBody)

    this._board.element.appendChild(notification)
    this._element = notification
    this.registerEventListeners()
  }

  /**
   * Registers notification event listeners.
   */
  registerEventListeners () {
    const notification = this
    this.closeIcon.addEventListener('click', () => {
      document.dispatchEvent(
        new CustomEvent(NotificationBoard.events.CLEAR_NOTIFICATION, {
          detail: {
            title: this.title,
            message: this.message,
            type: this.type
          }
        }))
    })
    if (this.expirationTime > 0) {
      setTimeout(
        function () {
          document.dispatchEvent(
            new CustomEvent(NotificationBoard.events.CLEAR_NOTIFICATION, {
              detail: {
                title: this.title,
                message: this.message,
                type: this.type
              }
            }))
        }, notification.expirationTime * 1000)
    }
  }
}
