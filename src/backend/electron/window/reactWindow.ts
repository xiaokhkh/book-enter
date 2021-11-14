import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import Event from '../../../common/class/Event';
import { P_REACT } from '../../../common/class/EndPoint';
import BrowserWindowTemplate from '../class/BrowserWindowTemplate';
import { reactContext, reactTabContext } from '../menu/reactContextMenu';

const title = 'React Window';
const preload = 'preload.js';

const loadListeners = (win: BrowserWindow) => {
  win.webContents.on('did-finish-load', () => {
    if (!win) {
      throw new Error('"win" is not defined');
    } else {
      win.show();
      win.focus();
    }
  });

  Event.MINIMIZE_WINDOW.onMain(() => win.minimize());
  Event.MAXIMIZE_WINDOW.onMain(() => (win.isMaximized() ? win.unmaximize() : win.maximize()));
  Event.CLOSE_WINDOW.onMain(closeAllWindows);

  win.webContents.on('context-menu', (e, { x, y }) => reactContext(win, x, y));
  Event.TAB_CTX_MENU.onMain(({ context, x, y }) => reactContext(win, x, y, reactTabContext(context)));

  win.on('maximize', () => Event.WINDOW_MAXIMIZED.sendMain());
  win.on('unmaximize', () => Event.WINDOW_UN_MAXIMIZED.sendMain());

  app.on('second-instance', () => restoreReactWindow(win));
  win.on('closed', closeAllWindows);
};

const restoreReactWindow = (reactWindow: BrowserWindow): void => {
  if (reactWindow) {
    if (reactWindow.isMinimized()) {
      reactWindow.restore();
    }
    reactWindow.focus();
  }
};

const createReactWindow = (): BrowserWindowTemplate => {
  const opt: BrowserWindowConstructorOptions = {
    width: 1024,
    height: 728,
    minWidth: 240,
    minHeight: 70,
  };
  const win = new BrowserWindowTemplate(title, preload, P_REACT, loadListeners, opt);
  const startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    win.setLoadUrl(startURL);
  } else {
    win.setLoadPath('index.html');
  }

  return win;
};

const closeAllWindows = () => {
  console.log('Closing all windows');
  app.quit();
  app.exit(0);
};

export default createReactWindow;
