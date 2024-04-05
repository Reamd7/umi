import _ from 'lodash-es';
import { extname, parse, relative, sep } from 'node:path';
import * as t from '@babel/types';

/**
 * convert path into componentName
 * like:
 *  - src/index.tsx => SrcIndex
 *  - components/Header.tsx => ComponentHeader
 *
 * @param filePath
 * @returns {string} componentName
 */
export const path2Component = (filePath: string): string => {
  const { ext } = parse(filePath);
  const filePathWithoutExt = filePath
    // remove extension
    .replace(ext, '')
    .split(sep)
    // upperFirst
    .map((item) => _.upperFirst(item.replace(/\W/g, '')))
    .join('');
  return filePathWithoutExt;
};

export default () => {

  return {
    visitor: {
      ExportDefaultDeclaration: {
        enter(path: any, state: any) {
          const def = path.node.declaration;
          const { cwd, filename } = state.file.opts;
          const relativePath = relative(cwd, filename);

          if (
            /^\.(tsx|jsx)$/.test(extname(relativePath)) &&
            // hidden relativePath
            !/(^|\/)\.[^\/\.]/g.test(relativePath) &&
            !relativePath.includes('node_modules')
          ) {
            let componentName = path2Component(relativePath);
            if (!componentName) {
              return;
            }

            // solve identifier conflict
            const identifiers = Object.keys(path.scope.bindings || {});
            // add index if conflict
            let idx = 0;
            // loop util componentName conflict
            while (identifiers.includes(componentName)) {
              componentName = `${componentName}${idx}`;
              idx += 1;
            }

            // generate component name identifier
            const named = t.identifier(componentName);

            if (t.isArrowFunctionExpression(def)) {
              const varDec = t.variableDeclaration('const', [
                t.variableDeclarator(named, def),
              ]);
              const [varDeclPath] = path.insertBefore(varDec);
              path.scope.registerDeclaration(varDeclPath);
              path.replaceWith(t.exportDefaultDeclaration(named));
            } else if (t.isFunctionDeclaration(def) && !def.id) {
              def.id = named;
            }
          }
        },
      },
    },
  };
};
