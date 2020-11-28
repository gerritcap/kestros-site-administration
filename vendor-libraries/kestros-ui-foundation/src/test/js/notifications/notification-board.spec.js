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

import {NotificationBoard} from '../../../js/notifications/notification-board'

describe("Notification Board", () => {

  describe('initialization', () => {
    let notificationBoardElement = document.createElement('div')
    let notificationBoard = new NotificationBoard(notificationBoardElement)
    it('not null', () => {
      assert.notEqual(notificationBoard, null)
    })
  })

  describe('create notification', () => {

    describe('create single notification', () => {
      let notificationBoardElement = document.createElement('div')
      let notificationBoard = new NotificationBoard(notificationBoardElement)

      it('creates new notification element', () => {
        notificationBoard.createNotification('Title', 'Message',
            'https://www.kestros.io', NotificationBoard.notificationLevels.INFO,
            5)
        assert.equal(
            notificationBoard.element.querySelectorAll('.notification').length,
            1)
      })
      it('appends current notifications array', () => {
        assert.equal(notificationBoard.currentNotifications.length, 1)
      })
    })

    describe('create multiple notifications', () => {
      let notificationBoardElement = document.createElement('div')
      let notificationBoard = new NotificationBoard(notificationBoardElement)

      notificationBoard.createNotification('Title', 'Message',
          'https://www.kestros.io', NotificationBoard.notificationLevels.INFO,
          5)

      notificationBoard.createNotification('Title-2', 'Message-2',
          'https://www.kestros.io', NotificationBoard.notificationLevels.INFO,
          5)

      it('order is correct when creating multiple notifications', () => {
        assert.equal(notificationBoard.currentNotifications[0].title, 'Title')
        assert.equal(notificationBoard.currentNotifications[1].title, 'Title-2')
      })
    })

  })

  describe('remove notification', () => {

    it('notification is removed from array', () => {
      let notificationBoardElement = document.createElement('div')
      let notificationBoard = new NotificationBoard(notificationBoardElement)

      notificationBoard.createNotification('Title', 'Message',
          'https://www.kestros.io', NotificationBoard.notificationLevels.INFO,
          5)
      assert.equal(
          notificationBoard.element.querySelectorAll('.notification').length, 1)
      assert.equal(
          notificationBoard.currentNotifications.length, 1)
      notificationBoard.removeNotification('Title', 'Message',
          NotificationBoard.notificationLevels.INFO)
      assert.equal(
          notificationBoard.element.querySelectorAll('.notification').length, 0)
      assert.equal(
          notificationBoard.currentNotifications.length, 0)
    })

    it('correct notification is removed when multiple (removing first)', () => {
      let notificationBoardElement = document.createElement('div')
      let notificationBoard = new NotificationBoard(notificationBoardElement)

      notificationBoard.createNotification('Title', 'Message',
          'https://www.kestros.io', NotificationBoard.notificationLevels.INFO,
          5)
      notificationBoard.createNotification('Title-2', 'Message-2',
          'https://www.kestros.io', NotificationBoard.notificationLevels.INFO,
          5)

      assert.equal(
          notificationBoard.element.querySelectorAll('.notification').length, 2)
      assert.equal(
          notificationBoard.currentNotifications.length, 2)

      assert.equal(notificationBoard.currentNotifications[0].title, 'Title')
      assert.equal(notificationBoard.currentNotifications[1].title, 'Title-2')
      notificationBoard.removeNotification('Title', 'Message',
          NotificationBoard.notificationLevels.INFO)

      assert.equal(
          notificationBoard.element.querySelectorAll('.notification').length, 1)
      assert.equal(
          notificationBoard.currentNotifications.length, 1)
      assert.equal(notificationBoard.currentNotifications[0].title, 'Title-2')
      assert.equal(notificationBoard.currentNotifications[0].index, 0)
    })

    it('correct notification is removed when multiple (removing second)',
        () => {
          let notificationBoardElement = document.createElement('div')
          let notificationBoard = new NotificationBoard(
              notificationBoardElement)

          notificationBoard.createNotification('Title', 'Message',
              'https://www.kestros.io',
              NotificationBoard.notificationLevels.INFO,
              5)
          notificationBoard.createNotification('Title-2', 'Message-2',
              'https://www.kestros.io',
              NotificationBoard.notificationLevels.INFO,
              5)

          assert.equal(
              notificationBoard.element.querySelectorAll(
                  '.notification').length, 2)
          assert.equal(
              notificationBoard.currentNotifications.length, 2)

          assert.equal(notificationBoard.currentNotifications[0].title, 'Title')
          assert.equal(notificationBoard.currentNotifications[1].title,
              'Title-2')
          notificationBoard.removeNotification('Title-2', 'Message-2',
              NotificationBoard.notificationLevels.INFO)

          assert.equal(
              notificationBoard.element.querySelectorAll(
                  '.notification').length, 1)
          assert.equal(
              notificationBoard.currentNotifications.length, 1)
          assert.equal(notificationBoard.currentNotifications[0].title, 'Title')
          assert.equal(notificationBoard.currentNotifications[0].index, 0)
        })
  })

  describe('remove all notifications', () => {
    it('removes all notifications',
        () => {
          let notificationBoardElement = document.createElement('div')
          let notificationBoard = new NotificationBoard(
              notificationBoardElement)

          notificationBoard.createNotification('Title', 'Message',
              'https://www.kestros.io',
              NotificationBoard.notificationLevels.INFO,
              5)
          notificationBoard.createNotification('Title-2', 'Message-2',
              'https://www.kestros.io',
              NotificationBoard.notificationLevels.INFO,
              5)

          assert.equal(
              notificationBoard.element.querySelectorAll(
                  '.notification').length, 2)
          assert.equal(
              notificationBoard.currentNotifications.length, 2)

          assert.equal(notificationBoard.currentNotifications[0].title, 'Title')
          assert.equal(notificationBoard.currentNotifications[1].title,
              'Title-2')

          notificationBoard.removeAllNotifications()

          assert.equal(
              notificationBoard.element.querySelectorAll(
                  '.notification').length, 0)
          assert.equal(
              notificationBoard.currentNotifications.length, 0)
        })
  })

  describe('events', () => {
    it('create notification', () => {
      let notificationBoardElement = document.createElement('div')
      let notificationBoard = new NotificationBoard(
          notificationBoardElement)
      notificationBoard.registerEventListeners()

      document.dispatchEvent(new CustomEvent('create-notification', {
        detail: {
          title: 'Title',
          message: 'Message',
          url: 'https://www.kestros.io',
          type: 'info',
          timeToLive: 5
        }
      }))
      assert.equal(notificationBoard.currentNotifications.length, 1)
    })

    it('clear notification', () => {
      let notificationBoardElement = document.createElement('div')
      let notificationBoard = new NotificationBoard(
          notificationBoardElement)
      notificationBoard.registerEventListeners()

      document.dispatchEvent(new CustomEvent('create-notification', {
        detail: {
          title: 'Title',
          message: 'Message',
          url: 'https://www.kestros.io',
          type: 'info',
          timeToLive: 5
        }
      }))
      document.dispatchEvent(new CustomEvent('clear-notification', {
        detail: {
          title: 'Title',
          message: 'Message',
          type: 'info'
        }
      }))
      assert.equal(notificationBoard.currentNotifications.length, 0)
    })
  })
})