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

export class Notification {
  constructor (title, message, url, type, expirationTime, index, board) {
    this._title = title
    this._message = message
    this._url = url
    this._type = type
    this._expirationTime = expirationTime
    this._index = index
    this._board = board
  }

  static get events () {
    return {
      CLEAR_NOTIFICATION: 'clear-notification'
    }
  }

  get element () {
    return this._element
  }

  get closeIcon () {
    return this._element.querySelector('.notification__close-icon')
  }

  get title () {
    return this.element.dataset.title
  }

  get message () {
    return this.element.dataset.message
  }

  get expirationTime () {
    return this.element.dataset.exiprationTime
  }

  get type () {
    return this.element.dataset.type
  }

  set index (index) {
    this._index = index
    this.element.setAttribute('data-index', index)
  }

  get index () {
    return this.element.dataset.index
  }

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

  registerEventListeners () {
    const notification = this
    this.closeIcon.addEventListener('click', () => {
      this._board.element.dispatchEvent(
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
          this._board.element.dispatchEvent(
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
