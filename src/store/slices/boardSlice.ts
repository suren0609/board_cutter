import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IBoard, IBoardSliceInitialState } from "../types";

const initialState: IBoardSliceInitialState = {
  boards: [],
  boardSize: {width: 2800, height: 2070},
};
export const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, { payload }: PayloadAction<IBoard[]>) => {
      state.boards = payload;
    },
    setBoardSize: (state, {payload}: PayloadAction<{width: number, height: number}>) => {
      state.boardSize = payload
    }
  },
});

export const { setBoards, setBoardSize } = boardSlice.actions;
