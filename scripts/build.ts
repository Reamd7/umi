import shell from 'shelljs';
import fs from 'node:fs';
import path from 'node:path';
import {promisify} from 'node:util'

const fsPromiseExists = promisify(fs.exists);
const root = process.cwd()
const packages = path.join(root, './packages');
const subModules = fs.readdirSync(packages).map(subDir => {
  return {
    name: subDir,
    packageJson: path.join(packages, subDir, './package.json'),
  }
});

function isObject(data: any): data is Record<string, any> {
  return typeof data === "object" && data !== null
}

function isString(data: any): data is string {
  return typeof data === "string"
}

Promise.all(
  subModules.map(async subModuleInfo => {
    if ((await fsPromiseExists(subModuleInfo.packageJson))) {
      const packageJsonData = JSON.parse(
        await fs.promises.readFile(subModuleInfo.packageJson, {
          encoding: "utf8"
        })
      );
      if (
        isObject(packageJsonData) && 
        isObject(packageJsonData.devDependencies) && 
        isString(packageJsonData.devDependencies.father) && 
        packageJsonData.devDependencies.father.startsWith("4.")
      ) {
        return subModuleInfo
      }
    }

    return false
  })
).then(subModulesInfoList => {
  const pnpmArgs = subModulesInfoList.map(info => {
    if (info) {
      return `--filter ${info.name}`
    }
    return ''
  }).filter(v => !!v).join(" ");
  console.log(
    `pnpm ${pnpmArgs} build`
  )
  shell.exec(
    `pnpm ${pnpmArgs} build`,
  )
})