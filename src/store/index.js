import axios from "axios";
import { multiClientMiddleware } from "redux-axios-middleware";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers";
import session from "../utils/session";
import { UNAUTHORIZED_ACTION_TYPES } from "../utils/constants";
import { errorMsg, successMsg } from "../actions/login";
import { message } from "antd";

const axiosClients = {
  default: {
    client: axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      responseType: "json",
    }),
  },
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      multiClientMiddleware(axiosClients, {
        getRequestOptions: (action) => {
          action.payload.request.headers = action.payload.request.headers || {};
          action.payload.request.headers["Access-Control-Allow-Origin"] = "*";

          if (UNAUTHORIZED_ACTION_TYPES.indexOf(action.type) === -1 && session.token !== "undefined") {
            action.payload.request.headers[
              "Authorization"
            ] = `Bearer ${session.token}`;
          }

          return action;
        },
        onComplete: ({ action }) => {
          if (action.payload && action.payload.status && action.payload?.data) {
            store.dispatch(
              successMsg({
                data: action.payload.data,
              })
            );
          }
          if (action.payload && action.payload.data && action.payload.data.msg) {
            message.error(action.payload.data.msg)
          }
          if (action.error && action.error.response?.status === 401) {
            store.dispatch(
              errorMsg({
                data: "Not authorized to the app."
              })
            )
          }
          if (action.error && action.error.response?.data) {
            store.dispatch(
              errorMsg({
                data: action.error.response.data,
              })
            );
          }
        }
      })
    )
  )
);

export default store;
