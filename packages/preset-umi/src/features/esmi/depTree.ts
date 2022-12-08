import Arborist from '@npmcli/arborist';
import type { IApi } from '../../types';

export async function getDepTree(
  data: NonNullable<IApi['appData']['deps']>,
): Promise<any> {
  const deps = data.pkgInfo.exports.reduce<string[]>(
    (prev, curr) => prev.concat(curr.deps.map((d) => d.name)),
    [],
  );

  const arborist = new Arborist({
    path: process.cwd(),
    lockfileVersion: 3,
    update: false,
    log: 'error' as any,
    legacyPeerDeps: false,
    strictPeerDeps: false,
  });
  const idealTree = await arborist.loadActual({});
  const meta = idealTree.meta!;
  const lock = meta.commit();
  const { packages } = lock;

  if (!packages) throw new Error(`本地生成依赖树失败`);

  const packageKeys = Object.keys(packages);

  const result: Record<string, any> = {};

  function collectDependencies(name: string, orders: string[]) {
    const pkgJson = packages![name];
    const { dependencies = {} } = pkgJson;

    Object.keys(dependencies).forEach((dep) => {
      const isCircularDependency = orders.some((n) => n === dep);
      // 检查循环依赖
      if (!isCircularDependency) {
        let findKey = [name, 'node_modules', dep].join('/');
        while (findKey && !packageKeys.includes(findKey)) {
          const findPaths = findKey.split('node_modules');
          findPaths.splice(findPaths.length - 2, 1);
          findKey = findPaths.join('node_modules');
        }

        result[findKey] = packages![findKey];
        collectDependencies(findKey, orders.concat(dep));
      }
    });
  }

  deps.forEach((name) => {
    // 如果找不到就再向 @umijs/plugins 找
    const pkgKey =
      packageKeys.find((n) => n === `node_modules/${name}`) ??
      packageKeys.find(
        (n) => n === `node_modules/@umijs/plugins/node_modules/${name}`,
      );
    if (pkgKey) {
      result[pkgKey] = packages[pkgKey];
      collectDependencies(pkgKey, [name]);
    }
  });

  return {
    packageLockJson: {
      packages: result,
      dependencies: {},
    },
  };
}
