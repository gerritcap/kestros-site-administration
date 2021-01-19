package io.kestros.cms.siteadministration.api.services;

import io.kestros.cms.user.KestrosUser;
import io.kestros.cms.user.group.KestrosUserGroup;
import java.util.Map;

/**
 * Service for sending generic events to logged in users browsers.
 */
public interface BrowserEventService {

  /**
   * Triggers a browser event for all logged in users.
   *
   * @param eventName Event to trigger.
   * @param properties Event properties.
   */
  void triggerBrowserEvent(String eventName, Map<String, Object> properties);

  /**
   * Triggers a browser event for a specified user.
   *
   * @param eventName Event to trigger.
   * @param properties Event properties.
   * @param user User to trigger event for.
   */
  void triggerBrowserEventForUser(String eventName, Map<String, Object> properties,
      KestrosUser user);

  /**
   * Triggers a browser event for a specified user.
   *
   * @param eventName Event to trigger.
   * @param properties Event properties.
   * @param group User Group to trigger event for.
   */
  void triggerBrowserEventForUserGroup(String eventName, Map<String, Object> properties,
      KestrosUserGroup group);
}
