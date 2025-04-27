import { createSlice } from "@reduxjs/toolkit";
import { localStoragekeys } from "../../imports/mainExports";

const initialState = {
  userState: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.userState = action.payload;
      localStorage.setItem(
        localStoragekeys.userState,
        JSON.stringify(state.userState)
      );
    },
    userStateUpdate: (state, action) => {
      state.userState = { ...(state.userState || {}), ...action.payload };
      localStorage.setItem(
        localStoragekeys.userState,
        JSON.stringify(state.userState)
      );
    },
    userLogout: (state) => {
      state.userState = null;
      localStorage.removeItem(localStoragekeys.userState);
    },
  },
});

const { userLogin, userLogout, userStateUpdate } = userSlice.actions;
const userReducer = userSlice.reducer;

export { userLogin, userLogout, userStateUpdate, userReducer };
