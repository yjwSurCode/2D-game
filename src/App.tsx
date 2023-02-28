import React, { lazy, Suspense, useEffect, useState, useRef } from "react";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary/index";
import SpinLoading from "./components/SpinLoading";
import { PROJECT_ROUTE_BASE } from "./core/config";
import NotFoundPage from "./pages/NotFoundPage";
import { createFC } from "./utils/react-utils";
import { ConfigProvider, Spin, message } from "antd";

//routes
import { routes } from "../src/route/index";

//redux
import { useDispatch, useSelector } from "react-redux";
import { changeUserAction } from "./store/actions";
import { Provider } from "react-redux";
import configStore from "./store/index";

//com
import UserConfirmation from "./components/UserComfirmation/index";

//Meta Mask
import { useMetaMask, useConnectedMetaMask } from "metamask-react";

import zhCN from "antd/lib/locale/zh_CN";
import "antd/dist/reset.css";
import "animate.css";
import "./App.less";

/*
if (IS_DEV_MODE) {
	(() => import('vconsole'))().then((VConsole) => {
		new VConsole.default();
	});
}
*/

(function (n) {
  const e = n.document,
    t = e.documentElement,
    i = 1920,
    d = i / 100,
    o = "orientationchange" in n ? "orientationchange" : "resize",
    a = function () {
      let n = t.clientWidth || 810;
      n > 1920 && (n = 1920);
      t.style.fontSize = n / d + "px";
    };
  a();
  e.addEventListener &&
    (n.addEventListener(o, a, !1),
    e.addEventListener("DOMContentLoaded", a, !1));
})(window);

const App = createFC("App", () => {
  const [loading, setloading] = useState(true);

  // const {
  //   // typed as string - can not be null
  //   // account,
  //   // typed as string - can not be null
  //   // chainId,
  // } = useConnectedMetaMask();

  const getDirection = () => {
    const width = window.document.documentElement.clientWidth; //获取当前屏幕宽
    const height = window.document.documentElement.clientHeight; //获取当前屏幕高
    if (width < height) {
      console.log("no");
      setloading(true);
    } else {
      setloading(false);
    }
  };

  useEffect(() => {
    getDirection();
  }, []);

  useEffect(() => {
    console.log(status, "status");
  }, [status]);

  window.addEventListener("resize", getDirection);

  const store = configStore();

  return (
    <div>
      <ErrorBoundary>
        <ConfigProvider locale={zhCN}>
          <Spin spinning={loading} delay={0}>
            <Provider store={store}>{useRoutes(routes)}</Provider>
          </Spin>
        </ConfigProvider>
      </ErrorBoundary>
    </div>
  );
});

export default App;
