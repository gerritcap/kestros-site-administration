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
 * Badge group consisting of an error and warning validator badge.
 */
class ValidationBadgeGroup extends InteractiveElement {

  /**
   * Events the ValidationBadgeGroup listens for.
   *
   * @returns {{MUTE_ALL: string, FILL_ALL: string, CLEAR_VARIATIONS_ALL: string, REDUCE_SIZE_ALL: string, ENLARGE_ALL: string, UPDATE: string}} Events the ValidationBadgeGroup listens for.
   */
  static get events() {
    return {
      UPDATE: 'validation-badge-update',
      CLEAR_VARIATIONS_ALL: 'clear-variations',
      MUTE_ALL: 'mute',
      FILL_ALL: 'fill',
      REDUCE_SIZE_ALL: 'reduce-size',
      ENLARGE_ALL: 'enlarge'
    };
  }

  /**
   * Elements the badge group waits for before declaring itself ready.
   * @returns {HTMLElement[]} Elements the badge group waits for before declaring itself ready.
   */
  get dependentElements() {
    return [this.errorBadgeElement, this.warningBadgeElement];
  }

  /**
   * Validation endpoint path.
   *
   * @returns {string} Validation endpoint path.
   */
  get path() {
    return this.element.dataset.path;
  }

  /**
   * Error badge element.
   *
   * @returns {HTMLElement} Error badge element.
   */
  get errorBadgeElement() {
    return this.element.querySelector('.badge.errors');
  }

  /**
   * Warning badge element.
   *
   * @returns {HTMLElement} Warning badge element.
   */
  get warningBadgeElement() {
    return this.element.querySelector('.badge.warnings');
  }

  /**
   * Loader icon element.
   *
   * @returns {HTMLElement} Loader icon element.
   */
  get loaderIconElement() {
    return this.element.querySelector('.loader');
  }

  /**
   * Fetches validation data, and updates child badges.
   */
  fetchData() {
    fetch(this.path, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
    }).then(data => {
      const errorCount = data.errorMessages.length;
      const warningCount = data.warningMessages.length;

      this.dispatchEventOnBadge(this.errorBadgeElement, Badge.events.UPDATE_CONTENT, {
        detail: {
          content: errorCount
        }
      });
      this.dispatchEventOnBadge(this.warningBadgeElement, Badge.events.UPDATE_CONTENT, {
        detail: {
          content: warningCount
        }
      });

      this.loaderIconElement.classList.add('hidden');

      if (errorCount > 0) {
        this.dispatchEventOnBadge(this.errorBadgeElement, InteractiveElement.events.SHOW, {});
      }
      if (warningCount > 0) {
        this.dispatchEventOnBadge(this.warningBadgeElement, InteractiveElement.events.SHOW, {});
      }
    }).catch(() => {
      console.warn('Failed to load validation badge data for ' + this.path + '.');
    });
  }

  /**
   * Hides all badges.
   */
  hideBadges() {
    this.dispatchEventOnAllBadges(InteractiveElement.events.HIDE);
  }

  /**
   * Shows all badges.
   */
  showBadges() {
    this.dispatchEventOnAllBadges(InteractiveElement.events.SHOW);
  }

  /**
   * Dispatches an event on a specified badge, if it exists.
   *
   * @param {HTMLElement} badgeElement - Badge element to trigger event on.
   * @param {string} eventName - Event to trigger.
   * @param {object} eventData - Event data.
   */
  dispatchEventOnBadge(badgeElement, eventName, eventData) {
    if (badgeElement !== null && typeof badgeElement !== 'undefined') {
      badgeElement.dispatchEvent(new CustomEvent(eventName, eventData));
    }
  }

  /**
   * Dispatches an event on all badges.
   *
   * @param {string} eventName - Event to dispatch.
   */
  dispatchEventOnAllBadges(eventName) {
    this.dispatchEventOnBadge(this.errorBadgeElement, eventName, {});
    this.dispatchEventOnBadge(this.warningBadgeElement, eventName, {});
  }

  /**
   * Updates all badges.
   */
  update() {
    this.hideBadges();
    this.loaderIconElement.classList.remove('hidden');

    this.fetchData();
  }

  /**
   * Registers ValidationBadgeGroup event listeners.
   */
  registerEventListeners() {
    super.registerEventListeners();

    this.element.addEventListener(ValidationBadgeGroup.events.CLEAR_VARIATIONS_ALL, () => {
      this.dispatchEventOnAllBadges(Badge.events.CLEAR_VARIATIONS);
    });
    this.element.addEventListener(ValidationBadgeGroup.events.MUTE_ALL, () => {
      this.dispatchEventOnAllBadges(Badge.events.MUTE);
    });
    this.element.addEventListener(ValidationBadgeGroup.events.FILL_ALL, () => {
      this.dispatchEventOnAllBadges(Badge.events.FILL);
    });
    this.element.addEventListener(ValidationBadgeGroup.events.REDUCE_SIZE_ALL, () => {
      this.dispatchEventOnAllBadges(Badge.events.REDUCE_SIZE);
    });
    this.element.addEventListener(ValidationBadgeGroup.events.ENLARGE_ALL, () => {
      this.dispatchEventOnAllBadges(Badge.events.ENLARGE);
    });

    this.element.addEventListener(InteractiveElement.dispatchedEvents.READY, () => {
      this.update();
    });

    this.element.addEventListener(ValidationBadgeGroup.events.UPDATE, () => {
      this.update();
    });
  }
}