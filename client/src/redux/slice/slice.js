import { createApi } from "@reduxjs/toolkit/query/react";
import { localStoragekeys, main_backend_url } from "../../imports/mainExports";
import { apiCallHandler } from "../../functions/apiCallHandler";
import { ToastHandler } from "../../components/myToast/ToastHandler";
import { ToastConst } from "../../constants";

const baseQueryFunc = async (payload, api) => {
  const { token } =
    JSON.parse(localStorage.getItem(localStoragekeys.userState)) || {};
  console.log("jaklf testing token", token);
  const requestObj = {
    method: payload.method,
    url: `${main_backend_url}${payload.url}`,
    data: payload.body,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": payload.contentType ?? "application/json",
    },
    // withCredentials: payload.requestingRefresh ? true : false,
  };
  const response = await apiCallHandler(requestObj);
  let responseObj = {};
  if (response.status_code === 200 || response.status_code === 201) {
    if (payload.msz) {
      // alert(response.msg);
      console.log("aklf msg", response);
      ToastHandler(ToastConst.success, response.msg);
    }
    responseObj = {
      data: response,
    };
  } else if (
    response.status_code === 400 ||
    response.status_code === 401 ||
    response.status_code === 402 ||
    response.status_code === 404
  ) {
    if (!payload.skipError) {
      // alert(response.msg);
      ToastHandler(ToastConst.warn, response.msg);
    }
    responseObj = {
      error: response,
    };
  } else {
    ToastHandler(ToastConst.error, response.msg);
    responseObj = {
      error: response,
    };
  }
  return responseObj;
};

export const slice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryFunc,
  endpoints: (builder) => ({}),
});
