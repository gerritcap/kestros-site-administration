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

/**
 * Board for containing and controlling popup notifications.
 */
class NotificationBoard extends InteractiveElement {
  /**
   * Constructs NotificationBoard.
   *
   * @param {HTMLElement} element - HTML Element.
   */
  constructor(element) {
    super(element);
    this.currentNotifications = [];
  }

  /**
   * Notification board events.
   *
   * @returns {{CLEAR_ALL_NOTIFICATIONS: string, CLEAR_NOTIFICATION: string, CREATE_NOTIFICATION: string}} Notification board events.
   */
  static get events() {
    return {
      CREATE_NOTIFICATION: 'create-notification',
      CLEAR_ALL_NOTIFICATIONS: 'clear-all-notifications',
      CLEAR_NOTIFICATION: 'clear-notification'
    };
  }

  /**
   * Allowed notification levels.
   *
   * @returns {{SUCCESS: string, ERROR: string, INFO: string, WARNING: string}} Allowed notification levels.
   */
  static get notificationLevels() {
    return {
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info',
      SUCCESS: 'success'
    };
  }

  registerEventListeners() {
    super.registerEventListeners();
    document.addEventListener(NotificationBoard.events.CREATE_NOTIFICATION,
        event => {
          for (const key of Object.keys(NotificationBoard.notificationLevels)) {
            if (event.detail.type
                === NotificationBoard.notificationLevels[key]) {
              this.createNotification(event.detail.title, event.detail.message,
                  event.detail.url, event.detail.type, event.detail.timeToLive);
            }
          }
        });
    document.addEventListener(NotificationBoard.events.CLEAR_NOTIFICATION,
        event => {
          this.removeNotification(event.detail.title, event.detail.message,
              event.detail.type);
        });
  }

  getNotification(title, message, type) {
    for (const notification of this.currentNotifications) {
      if (notification.title === title && notification.message === message
          && notification.type === type) {
        return notification;
      }
    }
    return null;
  }

  createNotification(title, message, url, type, timeToLive) {
    if (this.getNotification(title, message, type) === null) {
      const notification = new Notification(title, message, url, type,
          timeToLive, this.currentNotifications.length, this);
      this.currentNotifications.push(notification);
      notification.create();
    }
  }

  removeNotification(title, message, type) {
    const notification = this.getNotification(title, message, type);
    if (notification !== null) {
      this.currentNotifications.splice(notification.index, 1);
      notification.element.remove();
    }
    this.resetIndexes();
  }

  removeAllNotifications() {
    for (let i = this.currentNotifications.length - 1; i >= 0; i--) {
      this.removeNotification(this.currentNotifications[i].title,
          this.currentNotifications[i].message,
          this.currentNotifications[i].type);
    }
  }

  resetIndexes() {
    let index = 0;
    for (const notification of this.currentNotifications) {
      notification.index = index;
      index++;
    }
  }
}