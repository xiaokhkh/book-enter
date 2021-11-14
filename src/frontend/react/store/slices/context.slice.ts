import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TestModal {
  isOk: boolean;
}

const initialOkState: TestModal = {
  isOk: false,
};

const TestModal = createSlice({
  name: 'TestModal',
  initialState: initialOkState,
  reducers: {
    setOk(state, { payload: isOK }: PayloadAction<boolean>) {
      state.isOk = isOK;
      console.log('Setting isOK to', isOK);
    },
  },
});

export const { setOk } = TestModal.actions;

export const actions = TestModal.actions;

export default TestModal.reducer;
