import type * as traverse from '@babel/traverse';
import type { types as t } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import { extname } from 'path';

export interface IOpts {
  flag?: string;
}

const CSS_EXT_NAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

export default declare(({ types: t, traverse, assertVersion }, opts: IOpts) => {
  assertVersion("7.24.4");
  return {
    visitor: {
      ImportDeclaration(
        path: traverse.NodePath<t.ImportDeclaration>,
      ) {
        const {
          specifiers,
          source,
          source: { value },
        } = path.node;
        if (specifiers.length && CSS_EXT_NAMES.includes(extname(value))) {
          source.value = `${value}?${opts.flag || 'modules'}`;
        }
      },

      // e.g.
      // const styles = await import('./index.less');
      VariableDeclarator(
        path: traverse.NodePath<t.VariableDeclarator>,
      ) {
        const { node } = path;
        if (
          t.isAwaitExpression(node.init) &&
          t.isCallExpression(node.init.argument) &&
          t.isImport(node.init.argument.callee) &&
          node.init.argument.arguments.length === 1 &&
          t.isStringLiteral(node.init.argument.arguments[0]) &&
          CSS_EXT_NAMES.includes(extname(node.init.argument.arguments[0].value))
        ) {
          node.init.argument.arguments[0].value = `${node.init.argument.arguments[0].value
            }?${opts.flag || 'modules'}`;
        }
      },
    }
  };
});
