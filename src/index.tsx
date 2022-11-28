import React from "react";
import ReactDOM from "react-dom";

//import { createStore } from "redux";
import { legacy_createStore as createStore } from "redux";
//import { configureStore } from "redux";
import reportWebVitals from "./reportWebVitals";

import { rootReducer } from "./redux/rootReducer";
import { Provider } from "react-redux";
//import { store } from "./store";

import "./index.css";
import App from "./App";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// ReactDOM.render(
//   <Provider store={store}>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </Provider>,
//   document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
