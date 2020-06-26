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
 * Alert element that can be closed or collapsed.
 */
class Alert extends InteractiveElement {
  /**
   * Constructs an Alert.
   *
   * @param {HTMLElement} element - Element that will be initialized as an alert.
   */
  constructor(element) {
    super(element);
    if (!this.closable) {
      this.closeIcon.hide();
    }
    if (!this.collapsible || this.icon.element === null || typeof this.icon.element === 'undefined') {
      this.collapseIcon.hide();
    }
  }

  /**
   * Alert icon element.
   *
   * @returns {InteractiveElement} Alert icon element.
   */
  get icon() {
    return new InteractiveElement(this.element.querySelector('.alert__icon'));
  }

  /**
   * Alert text element.
   *
   * @returns {InteractiveElement} Alert text element.
   */
  get text() {
    return new InteractiveElement(this.element.querySelector('.alert__text'));
  }

  /**
   * Close icon/text. Looks to `.alert__close` child.
   *
   * @returns {InteractiveElement} Close icon/text.
   */
  get closeIcon() {
    return new InteractiveElement(this.element.querySelector('.alert__close'));
  }

  /**
   * Collapse icon/text element.
   *
   * @returns {InteractiveElement} Collapse icon/text element.
   */
  get collapseIcon() {
    return new InteractiveElement(this.element.querySelector('.alert__collapse'));
  }

  /**
   * Whether the alert is closable. Closable alerts contain the `alert--closable` class.
   *
   * @returns {boolean} Whether the alert is closable. Closable alerts contain the `alert--closable` class.
   */
  get closable() {
    return this.element.classList.contains('alert--closable');
  }

  /**
   * Whether the alert is collapsible. Collapsible alerts contain the `alert--collapsible` class.
   *
   * @returns {boolean} Whether the alert is collapsible. Collapsible alerts contain the `alert--collapsible` class.
   */
  get collapsible() {
    return this.element.classList.contains('alert--collapsible');
  }

  /**
   * Whether the alert is collapsed.
   *
   * @returns {boolean} Whether the alert is collapsed.
   */
  get collapsed() {
    return this.element.classList.contains('alert--collapsed');
  }

  /**
   * Registers alert event listeners.
   * Events:
   * alert-before-expand: Triggered immediately before the alert is expanded.
   * Alert-expand: Alert was expanded.
   * Alert-before-collapse: Triggered immediately before the alert is collapsed.
   * Alert-collapse: Alert was collapsed.
   * Alert-before-close: Triggered immediately before the alert is closed.
   * Alert-close: Triggered when the alert is closed.
   */
  registerEventListeners() {
    super.registerEventListeners();

    if (this.icon.element !== null && typeof this.icon.element !== 'undefined') {
      this.icon.element.addEventListener('click', () => {
        this.element.dispatchEvent(new Event('alert-expand'));
      });
    }

    if (this.closeIcon.element !== null && typeof this.closeIcon.element !== 'undefined') {
      this.closeIcon.element.addEventListener('click', () => {
        this.element.dispatchEvent(new Event('alert-close'));
      });
    }

    if (this.collapseIcon.element !== null && typeof this.collapseIcon.element !== 'undefined') {
      this.collapseIcon.element.addEventListener('click', () => {
        this.element.dispatchEvent(new Event('alert-collapse'));
      });
    }

    this.element.addEventListener('alert-close', () => {
      this.element.dispatchEvent(new Event('alert-before-close'));
      this.close();
    });

    this.element.addEventListener('alert-collapse', () => {
      this.element.dispatchEvent(new Event('alert-before-collapse'));
      this.collapse();
    });

    this.element.addEventListener('alert-expand', () => {
      if (this.collapsed) {
        this.element.dispatchEvent(new Event('alert-before-expand'));
        this.expand();
      }
    });
    this.element.addEventListener('transitionend', () => {
      if (this.closable) {
        this.element.dispatchEvent(new Event('alert-after-close'));
      } else if (this.collapsed) {
        this.element.dispatchEvent(new Event('alert-after-collapse'));
      } else {
        this.element.dispatchEvent(new Event('alert-after-expand'));
      }
    });
    this.element.addEventListener('alert-after-close', () => {
      this.element.remove();
    });

    this.element.addEventListener('alert-after-expand', () => {
      this.text.show();
      this.collapseIcon.show();
    });
  }

  /**
   * Closes the alert, so that none of the element is visible.
   *
   * @returns {void}
   */
  close() {
    this.element.classList.add('alert--closed');
  }

  /**
   * Collapses an alert, so that only the icon is visible.
   *
   * @returns {void}
   */
  collapse() {
    this.text.hide();
    this.collapseIcon.hide();
    this.element.classList.add('alert--collapsed');
  }

  /**
   * Expands a collapsed alert.
   *
   * @returns {void}
   */
  expand() {
    this.element.classList.remove('alert--collapsed');
  }

  /**
   * Updates the text within the alert.
   *
   * @param {string} text - Text to update the alert with.
   */
  updateText(text) {
    this.text.updateText(text);
  }
}