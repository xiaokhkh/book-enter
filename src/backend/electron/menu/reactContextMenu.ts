import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import ContextMenu from '../../../common/constant/ContextMenu';
import Event from '../../../common/class/Event';

const getMenuOption = (context: string, selectedItem: ContextMenu): MenuItemConstructorOptions => {
  return {
    label: selectedItem + " " + context,
    click: () => Event.TAB_CTX_MENU.sendMain({ context, selectedItem }),
  };
};

export const reactTabContext = (context: string): MenuItemConstructorOptions[] => {
  return [getMenuOption(context, ContextMenu.HELLO), { type: 'separator' }];
};

export const reactContext = (win: BrowserWindow, x: number, y: number, extra?: MenuItemConstructorOptions[]): void => {
  console.log('Call to context menu at X:', x, ' Y:', y);
  const template: MenuItemConstructorOptions[] = [];

  if (extra) {
    template.push(...extra);
  }

  if (process.env.ELECTRON_START_URL) {
    if (template.length > 0) {
      template.push({ type: 'separator' });
    }
    template.push({ label: 'Reload', click: () => win.reload() });
    template.push({ label: 'Inspect element', click: () => win.webContents.inspectElement(x, y) });
  }

  template.length > 0 && Menu.buildFromTemplate(template).popup({ window: win });
};
