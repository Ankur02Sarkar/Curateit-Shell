import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter as Router } from "react-router-dom";
import "./index.css";
import store from "./store";
import { Provider } from "react-redux";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router initialEntries={["/login", "/"]} initialIndex={0}>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
