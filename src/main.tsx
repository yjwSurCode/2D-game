import React from "react";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";

const history: any = createBrowserHistory({});

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider: any, connector: any) {
  console.log("aa-provider, connector", provider, connector);
  return new Web3Provider(provider);
}

import { MetaMaskProvider } from "metamask-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //!1.3.9  React.StrictMode 会使得 useEffect执行两次
  // <Web3ReactProvider getLibrary={getLibrary}>
  //   <React.StrictMode>
  //     <HistoryRouter basename="/poker" history={history}>
  //       {/* <HistoryRouter history={history}> */}
  //       <App />
  //     </HistoryRouter>
  //   </React.StrictMode>
  // </Web3ReactProvider>
  <MetaMaskProvider>
    <HistoryRouter basename="/poker/" history={history}>
      {/* <HistoryRouter history={history}> */}
      <App />
    </HistoryRouter>
  </MetaMaskProvider>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root") as HTMLElement
// );

// 、React18 useEffect 新特性
// 1.这是 React18 才新增的特性。
// 2.仅在开发模式("development")下，且使用了严格模式("Strict Mode")下会触发。
//   生产环境("production")模式下和原来一样，仅执行一次。
// 3.之所以执行两次，是为了模拟立即卸载组件和重新挂载组件。
//   为了帮助开发者提前发现重复挂载造成的 Bug 的代码。
//   同时，也是为了以后 React的新功能做铺垫。
//   未来会给 React 增加一个特性，允许 React 在保留状态的同时，能够做到仅仅对UI部分的添加和删除。
//   让开发者能够提前习惯和适应，做到组件的卸载和重新挂载之后， 重复执行 useEffect的时候不会影响应用正常运行
// ————————————————
// 版权声明：本文为CSDN博主「Ne￡」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/weixin_45549737/article/details/127120729
