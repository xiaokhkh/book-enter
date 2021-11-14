import { IpcRenderer, IpcRendererEvent } from 'electron';
import { PayloadAction } from '@reduxjs/toolkit';
import { SLContextMenuData } from '../constant/ContextMenu';
import { EndPoint, P_REACT } from './EndPoint';

let lastChannelId = 0;

/**
 * Event class for wrapping Electron IPC event calls b/w Main and Render processes with type safety.<br>
 * Type declaration:
 * - PEventClass() -> type is set to void
 * - PEventClass<X>() -> type is set to X and the type is check at both source and destination.
 *
 * Source and destination logic:
 * - PEventClass() -> call goes to main process, where some action is done and no return action is done
 * - PEventClass(A) -> call goes to main process, where some action is done, then result is sent to A
 * - PEventClass(A, B) -> call goes to B, where some action is done then result is sent to A
 *
 * All these calls can be done from any process, not just the involved A or B.<br>
 * For example, in C we could call PEventClass(A, B), where A could process data sent by C and then return the result to B.
 */
export class PEventClass<T = void> {
  private readonly channel: string;
  private readonly origin?: EndPoint;
  private readonly destination?: EndPoint;

  public constructor(origin?: EndPoint, destination?: EndPoint) {
    this.channel = (++lastChannelId).toString();
    this.origin = origin;
    this.destination = destination;
  }

  /*
   * Render Process methods
   */
  send(arg?: T): void {
    global.ipcRenderer.send(this.channel, arg);
  }

  on(
    fn: (arg: T, event: IpcRendererEvent) => T | Promise<T> | void | Promise<void> | PayloadAction<unknown>
  ): () => IpcRenderer {
    global.ipcRenderer.on(this.channel, (event, arg: T) => fn(arg, event));

    return () => global.ipcRenderer.removeListener(this.channel, (event, arg: T) => fn(arg, event));
  }

  /*
   * Main Process methods
   */
  onMain(fn?: (arg: T) => T | Promise<T> | void | Promise<void> | PayloadAction<T>): void {
    global.ipcMain.on(this.channel, async (event, arg: T) => {
      if (this.destination) {
        if (!this.origin?.contains(event.sender.id)) {
          this.origin.get().send(this.channel, arg);
        } else {
          this.destination.get().send(this.channel, arg);
        }
      } else {
        if (this.origin) {
          this.origin.get().send(this.channel, await fn(arg));
        } else {
          await fn(arg);
        }
      }
    });
  }

  sendMain(arg?: T): void {
    if (this.destination) {
      this.destination.get().send(this.channel, arg);
    } else {
      this.origin?.get()?.send(this.channel, arg);
    }
  }
}

const Event = {
  // React
  MINIMIZE_WINDOW: new PEventClass(),
  MAXIMIZE_WINDOW: new PEventClass(),
  CLOSE_WINDOW: new PEventClass(),
  WINDOW_MAXIMIZED: new PEventClass(P_REACT),
  WINDOW_UN_MAXIMIZED: new PEventClass(P_REACT),

  // Context Menu
  TAB_CTX_MENU: new PEventClass<SLContextMenuData<string>>(P_REACT),
};

export default Event;
