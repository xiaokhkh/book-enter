import { WebContents } from 'electron';

export class EndPoint {
  private readonly webContentsList: WebContents[] = [];

  add(webContents: WebContents): void {
    this.webContentsList.push(webContents);
  }

  //Round robin load balancing
  get(): WebContents {
    const webContents = this.webContentsList.shift();

    this.webContentsList.push(webContents);

    return webContents;
  }

  getAll(): WebContents[] {
    return this.webContentsList;
  }

  contains(id: number): boolean {
    return this.webContentsList.find((it) => it.id === id) != null;
  }
}

export const P_REACT = new EndPoint();
