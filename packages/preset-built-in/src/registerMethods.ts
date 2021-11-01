import { fsExtra, lodash, Mustache } from '@umijs/utils';
import assert from 'assert';
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { IApi } from './types';
import { isTypeScriptFile } from './utils/isTypeScriptFile';

export default (api: IApi) => {
  [
    'onGenerateFiles',
    'onBuildComplete',
    // 'onExit',
    // 'onPatchRoute',
    // 'onPatchRouteBefore',
    // 'onPatchRoutes',
    // 'onPatchRoutesBefore',
    'onPkgJSONChanged', // new
    'onDevCompileDone',
    // 'addBeforeMiddlewares',
    // 'addBeforeMiddewares',
    // 'addDepInfo',
    // 'addDevScripts',
    // 'addMiddlewares',
    // 'addMiddewares',
    'addRuntimePlugin',
    'addRuntimePluginKey',
    // 'addUmiExports',
    // 'addProjectFirstLibraries',
    // 'addPolyfillImports',
    // 'addEntryImportsAhead',
    // 'addEntryImports',
    // 'addEntryCodeAhead',
    // 'addEntryCode',
    'addHTMLMetas',
    'addHTMLLinks',
    'addHTMLStyles',
    'addHTMLHeadScripts',
    'addHTMLScripts',
    'addTmpGenerateWatcherPaths',
    // 'chainWebpack',
    // 'modifyHTML',
    // 'modifyBundler',
    // 'modifyBundleConfigOpts',
    // 'modifyBundleConfig',
    // 'modifyBundleConfigs',
    // 'modifyBabelOpts',
    // 'modifyBabelPresetOpts',
    // 'modifyBundleImplementor',
    // 'modifyHTMLChunks',
    // 'modifyDevHTMLContent',
    // 'modifyExportRouteMap',
    // 'modifyProdHTMLContent',
    // 'modifyPublicPathStr',
    // 'modifyRendererPath',
    // 'modifyRoutes',
  ].forEach((name) => {
    api.registerMethod({ name });
  });

  api.registerMethod({
    name: 'writeTmpFile',
    fn(opts: {
      path: string;
      content?: string;
      tpl?: string;
      tplPath?: string;
      context?: Record<string, string>;
    }) {
      assert(
        api.service.stage >= api.ServiceStage.runCommand,
        `api.writeTmpFile() should not execute in register stage.`,
      );
      const absPath = join(api.paths.absTmpPath, opts.path);
      fsExtra.mkdirpSync(dirname(absPath));
      let content = opts.content;
      if (!content) {
        assert(
          !opts.tplPath ||
            (existsSync(opts.tplPath) && statSync(opts.tplPath).isFile()),
          `opts.tplPath does not exists or is not a file.`,
        );
        const tpl = opts.tplPath
          ? readFileSync(opts.tplPath, 'utf-8')
          : opts.tpl;
        assert(tpl, `opts.tpl or opts.tplPath must be supplied.`);
        assert(
          lodash.isPlainObject(opts.context),
          `opts.context must be plain object.`,
        );
        content = Mustache.render(tpl, opts.context);
      }
      content = [
        isTypeScriptFile(opts.path) && `// @ts-nocheck`,
        '// This file is generated by Umi automatically',
        '// DO NOT CHANGE IT MANUALLY!',
        content,
      ]
        .filter((text) => text !== false)
        .join('\n');
      if (!existsSync(absPath) || readFileSync(absPath, 'utf-8') !== content) {
        writeFileSync(absPath, content, 'utf-8');
      }
    },
  });
};
