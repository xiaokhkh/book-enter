import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Event from '../../../common/class/Event';
import { RootState } from '../store/rootReducer';
import { addContextListeners, removeContextListeners } from '../store/thunks/context.thunk';

const tabContextMenu = (event: MouseEvent): void => {
  Event.TAB_CTX_MENU.send({ context: 'World', x: event.x, y: event.y });
};

const App = (): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null);
  const isOk = useSelector((state: RootState) => state.testModal.isOk) || false;
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Call add context listeners");
    dispatch(addContextListeners());

    return () => {
      dispatch(removeContextListeners());
    };
  }, []);

  useEffect(() => {
    divRef.current.oncontextmenu = (e) => {
      e.stopPropagation();
      e.preventDefault();
      tabContextMenu(e);
    };
  }, []);

  return (
    <div ref={divRef}>
      <p>Hello World! - Right click to flip the flag: {isOk ? 'OK': 'NOK'}</p>
    </div>
  );
};

export default App;
