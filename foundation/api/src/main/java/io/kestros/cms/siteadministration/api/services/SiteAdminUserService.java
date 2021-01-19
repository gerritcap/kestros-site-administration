package io.kestros.cms.siteadministration.api.services;

import io.kestros.cms.siteadministration.api.models.user.SiteAdminUser;
import java.util.List;

public interface SiteAdminUserService {

  SiteAdminUser getCurrentUser();

  SiteAdminUser getUser(String id);

  List<SiteAdminUser> getAllUsers();

  List<SiteAdminUser> getLoggedInUsers();

}
