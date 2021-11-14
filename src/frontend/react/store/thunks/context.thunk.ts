import { AppThunk } from '../store';
import Event from '../../../../common/class/Event';
import { actions } from '../slices/context.slice';
import ContextMenu, { SLContextMenuData } from '../../../../common/constant/ContextMenu';
import { RootState } from '../rootReducer';

const contextAction = {};

contextAction[ContextMenu.HELLO] = (context: string) => {
  console.log('processing reply from main - Hello', context);
};

const handleTabContextAction = (data: SLContextMenuData<string>, state: RootState, dispatch): void => {
  contextAction[data.selectedItem](data.context);
  console.log(state)
  dispatch(actions.setOk(!state?.testModal?.isOk || false));
};

const listeners: (() => void)[] = [];

export const addContextListeners = (): AppThunk => async (dispatch, getState) => {
  console.log("Added CTX listeners");
  listeners.push(Event.TAB_CTX_MENU.on((data) => {
    return data && handleTabContextAction(data, getState(), dispatch);
  }));
};

export const removeContextListeners = (): AppThunk => async () => {
  console.log("Removed CTX listeners");
  while (listeners.length) listeners.pop()();
};
