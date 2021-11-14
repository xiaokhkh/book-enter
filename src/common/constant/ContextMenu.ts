export interface SLContextMenuData<T> {
  context: T;
  x?: number;
  y?: number;
  selectedItem?: ContextMenu;
}

const enum ContextMenu {
  HELLO = 'Hello',
}

export default ContextMenu;
