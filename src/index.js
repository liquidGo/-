import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.css";
// import App from "./App";
import IndexRoute from "./router/IndexRoute";
// import "./util/http"; //导入axios修改的默认数据
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IndexRoute />);
