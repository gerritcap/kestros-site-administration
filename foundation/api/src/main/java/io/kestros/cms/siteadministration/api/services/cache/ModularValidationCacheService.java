package io.kestros.cms.siteadministration.api.services.cache;

import io.kestros.commons.validation.services.ModelValidationCacheService;
import io.kestros.commons.validation.services.ModelValidationService;
import java.util.List;
import org.apache.sling.api.resource.ResourceResolver;

public interface ModularValidationCacheService extends ModelValidationCacheService {

  List<Class> getCacheableModelTypes();

  void rebuildCache(ResourceResolver resourceResolver);
}
