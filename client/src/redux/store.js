import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user/userSlice";
import { slice } from "./slice/slice";
import logger from "redux-logger";

const allMiddleWare = [slice.middleware];

// if (process.env.REACT_APP_REDUX_LOGGER) {
allMiddleWare.push(logger);
// }

export const store = configureStore({
  reducer: {
    user: userReducer,
    [slice.reducerPath]: slice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(allMiddleWare),
});
