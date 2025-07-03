const fs = require('fs');
const path = require('path');

const appDelegatePath = path.join(__dirname, '../ios/ReCol/AppDelegate.mm');
const newAppDelegatePath = path.join(__dirname, '../ios/ReCol/AppDelegate.m');

// AppDelegate.mmが存在する場合、AppDelegate.mにリネーム
if (fs.existsSync(appDelegatePath)) {
  fs.renameSync(appDelegatePath, newAppDelegatePath);
  console.log('AppDelegate.mm renamed to AppDelegate.m');
}
