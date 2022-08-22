import axios from "axios";
import { store } from "../redux/store";
axios.defaults.baseURL = "http://localhost:5000";
// 对axios进行设置    默认输入路径

// 设置请求头
// axios.defaults.headers; 请求头中的信息
// 通过defaults属性

// 设置 在请求之前拦截
axios.interceptors.request.use(
  function (config) {
    // 在请求之前要加的属性
    // 显示loading
    store.dispatch({
      type: "change_loading",
      payload: true
    });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // 隐藏loading  响应失败
    store.dispatch({
      type: "change_loading",
      payload: false
    });
    return response;
  },
  function (error) {
    // 隐藏loading  响应失败
    store.dispatch({
      type: "change_loading",
      payload: false
    });
    return Promise.reject(error);
  }
);
