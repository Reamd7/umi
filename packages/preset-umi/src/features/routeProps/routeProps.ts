import type { IApi } from '../../types';
import { setupRouteExportExtractor } from '../../utils/routeExportExtractor';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(Joi) {
        return Joi.object({});
      },
    },
    enableBy: api.EnableBy.config,
  });

  const entryFile = 'core/routeProps.ts';
  const outFile = 'core/routeProps.js';

  setupRouteExportExtractor({
    api,
    entryFile,
    outFile,
    propertyName: 'routeProps',
  });
};
