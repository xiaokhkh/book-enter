import { platform } from 'os';
import { Platform, build, CliOptions } from 'electron-builder';

let target;

if (platform() == 'win32') {
  target = Platform.WINDOWS.createTarget();
} else if (platform() == 'linux') {
  target = Platform.LINUX.createTarget();
}

export const packageOptions: CliOptions = {
  targets: target,
  config: {
    appId: 'com.electron.electron.react.webpack.starter',
    productName: 'electron-preact-webpack-starter',
    files: ['build/**', '!node_modules'],
    asar: true,
    electronDist: 'node_modules/electron/dist',
    directories: {
      output: 'out',
    },
    win: {
      target: ['dir'],
    },
  },
};

build(packageOptions).catch((error) => console.log(error));
