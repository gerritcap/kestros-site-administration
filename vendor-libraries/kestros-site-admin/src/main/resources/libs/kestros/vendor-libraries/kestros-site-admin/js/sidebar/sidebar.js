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
 * Kestros SiteAdmin Sidebar.
 */
class Sidebar extends DynamicContentArea {
  /**
   * Events the Sidebar listens for.
   *
   * @returns {{RELOAD: string}} Events the Sidebar listens for.
   */
  static get events() {
    return {
      RELOAD: 'kestros-sidebar-reload'
    };
  }

  /**
   * Events the sidebar dispatches.
   *
   * @returns {{READY: string, LOADED: string}} Events the sidebar dispatches.
   */
  static get dispatchedEvents() {
    return {
      LOADED: 'kestros-site-admin-sidebar-loaded',
      READY: 'kestros-sidebar-ready'
    };
  }

  /**
   * Registers Sidebar events.
   */
  registerEventListeners() {
    super.registerEventListeners();
    // todo this is not a sidebar event. its a reload all event.

    document.addEventListener('kestros-reload-triggered', () => {
      document.dispatchEvent(new Event(Sidebar.events.RELOAD));
    });

    document.addEventListener(Sidebar.events.RELOAD, () => {
      this.loadContent();
    });

    this.element.addEventListener('dynamic-content-loaded', () => {
      document.dispatchEvent(new CustomEvent(Sidebar.dispatchedEvents.LOADED, {}));
    });

    document.dispatchEvent(new Event(Sidebar.dispatchedEvents.READY));
  }
}