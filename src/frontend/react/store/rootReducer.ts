import { combineReducers } from '@reduxjs/toolkit';
import TestModal from './slices/context.slice';

export const rootReducer = combineReducers({
  testModal: TestModal,
});

export type RootState = ReturnType<typeof rootReducer>;
