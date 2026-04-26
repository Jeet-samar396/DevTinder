import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: [], // 🔥 always use array

  reducers: {
    addConnections: (state, action) => {
      return action.payload || [];
    },
    clearConnections: () => {
      return [];
    },
  },
});

export const { addConnections, clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;