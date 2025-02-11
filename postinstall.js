import { Chalk } from 'chalk';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
const chalk = new Chalk({ level: 3 });

function log(...args) {
  console.log(chalk.yellow('[react-native-maps]'), ...args);
}

const reactNativeMaps = async () => {
  log(
    '📦 Creating web compatibility of react-native-maps using an empty module loaded on web builds'
  );
  const modulePath = 'node_modules/react-native-maps';
  await writeFile(`${modulePath}/lib/index.web.js`, 'module.exports = {}', 'utf-8');
  await copyFile(`${modulePath}/lib/index.d.ts`, `${modulePath}/lib/index.web.d.ts`);
  const pkg = JSON.parse(await readFile(`${modulePath}/package.json`));
  pkg['react-native'] = 'lib/index.js';
  pkg.main = 'lib/index.web.js';
  await writeFile(`${modulePath}/package.json`, JSON.stringify(pkg, null, 2), 'utf-8');
  log('✅ script ran successfully');
};

reactNativeMaps();
