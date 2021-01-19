package io.kestros.cms.siteadministration.api.services.cache;

import io.kestros.commons.validation.services.ModelValidationCacheService;
import java.util.List;

public interface GlobalValidationCacheService extends ModelValidationCacheService {

  List<ModularValidationCacheService> getAllModularValidationCacheServices();

  List<ModularValidationCacheServiceRegistrationHandler> getAllModularValidationCacheServiceRegistrationHandlers();

}
