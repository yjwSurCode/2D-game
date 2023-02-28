git commit --amend  
git rebase --continue  
git push --force origin master
git pull

用户 action 参数是个枚举 CALL:跟注，PASS:过牌，BET:加注，FOLD:弃牌

react router6 对比 react router5

# {/_ 使用 Routes 替换曾经的 Switch _/}

# v6 移除了 Redirect 组件，改用 Navigate 组件。

# 嵌套 要加 <Outlet />

{/_ 重定向到首页 _/}
<Route path="\*" element={<Navigate to="/"/>} />

import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
<React.StrictMode>
<App />
</React.StrictMode>
);

<BrowserRouter basename="/v">
            <Suspense fallback={<SpinLoading />}>
              {/* <Routes>
                <Route path="" element={<MapImage />} />
                <Route path="/index" element={<IndexPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes> */}
            </Suspense>
          </BrowserRouter>

# 5 版本

<BrowserRouter
getUserConfirmation={(message, callback) => {
UserConfirmation(message, callback);
}} >
<Switch>
<Route path={"/home"} exact component={Home} />
<Route path={"/my"} exact component={My} />
<Redirect to={"/home"} />
</Switch>
</BrowserRouter>

// const navigate = useNavigate();

const goGamePage = () => {
console.log("000");
// navigate("/index", { replace: true, state: { name: "zhou" } });
};

# 5 版本

useHistory

/\*

- @Author: hongbin
- @Date: 2022-04-16 13:26:39
- @LastEditors: hongbin
- @LastEditTime: 2022-04-16 21:00:02
- @Description:拖动进度条组件
  \*/

import { FC, ReactElement, useRef } from "react";
import styled from "styled-components";
import { flexCenter } from "../../styled";

interface IProps {
/\*\*

- 0-1
  \*/
  value: number;
  /\*\*
- callback 0-1
  \*/
  onChange: (percent: number) => void;
  }

const ProgressBar: FC<IProps> = ({ value, onChange }): ReactElement => {
const totalRef = useRef<HTMLDivElement>(null);

return (
<Container>

<div ref={totalRef}>
<div style={{ width: value * 100 + "%" }} />
</div>
<div
onMouseDown={(e) => {
const { offsetWidth } = totalRef.current!;
const stop = e.currentTarget;
const { offsetLeft } = stop;
stop.style["left"] = offsetLeft + "px";
const { pageX: start } = e;
const move = (e: MouseEvent) => {
let val = offsetLeft + e.pageX - start;
if (val <= 0) val = 0;
if (val >= offsetWidth) val = offsetWidth;
// stop.style["left"] = val + "px";
onChange(val / offsetWidth);
};

          const clear = () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", clear);
            document.removeEventListener("mouseleave", clear);
          };
          document.addEventListener("mousemove", move);
          document.addEventListener("mouseup", clear);
          document.addEventListener("mouseleave", clear);
        }}
        style={{ left: value * 100 + "%" }}
      ></div>
    </Container>

);
};

export default ProgressBar;

const Container = styled.div`  position: relative;
  width: 10vw;
  height: 1vw;
  ${flexCenter};
  & > :first-child {
    width: inherit;
    height: 0.5vw;
    background-color: var(--tint-color);
    border-radius: 10vw;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.05vw;
    div {
      width: 5vw;
      height: 0.4vw;
      background-color: var(--deep-color);
      border-radius: 0.4vw;
    }
  }
  & > :last-child {
    width: 1vw;
    height: 1vw;
    background-color: var(--deep-color);
    border-radius: 1vw;
    position: absolute;
    cursor: pointer;
    transform: translateX(-0.5vw);
    svg {
      width: 0.9vw;
    }
  }`;

# 6 热区组件

  <!-- react-image-map -->

### 部署

WHY？？？ 可能是 ES modules 的限制吧，不能从 file 协议加载

在 vite.config.js 中设置正确的 base。

如果你要部署在 https://<USERNAME>.github.io/ 上，你可以省略 base 使其默认为 '/'。

如果你要部署在 https://<USERNAME>.github.io/<REPO>/ 上，例如你的仓库地址为 https://github.com/<USERNAME>/<REPO>，那么请设置 base 为 '/<REPO>/'。

vite 动态加载静态资源图片，修复打包后图片 404 问题。
/\*\*\*

- @description vite 动态加载静态资源图片
- @params string name - 图片名称
  \*/
  export const dynamicGetImg = (name: string) => {
  try {
  return new URL(`../assets/menu-icon/${name}`, import.meta.url).href
  } catch (error) {
  console.log(error)
  }
  }

        {/* //! 打包没有public */}
        <img src="../poker/map.gif" useMap="#planetmap" alt="Planets" />

用户 a 在房间 用户 b 加入  
 a 用户更新页面 触发开始游戏
b 用户更新页面 触发开始游戏

a 是当前操作玩家

a b 倒计时 结束之后 只能 a 触发 action 接口

（a 触发 pass）游戏结束

倒计时迁移到 b b 继续下注 进入下一轮 桌面牌更新

一直循环 直到游戏结束

# web3

yarn add ethers

yarn add web3

yarn add web3-react@unstable 5.0.5

npm i ethereumjs-abi

fatal: unable to access 'https://github.com/ethereumjs/ethereumjs-abi.git/': Failed to connect to github.com port 443 after 31 ms: Connection refused

yarn add @web3-react/core

# 2： npm i metamask-react

yarn add @web3-react/core @web3-react/injected-connector

yarn add @ethersproject/providers

status--> connected
connect--> ƒ () {
if (!isAvailable) {
console.warn("`enable` method has been called while MetaMask is not available or synchronising. Nothing will be done in this case.");
return Promi… }
account--> 0xc66322e0da931889cff7947212f9a3131b3c9018
chainId--> 0x1
ethereum--> Proxy {\_events: {…}, \_eventsCount: 0, \_maxListeners: 100, \_log: u, \_state: {…}, …}

<!-- 密码  -->

bind little today pepper pluck armor hobby memory maid funny stock cereal

<!-- 地址 -->

0xc66322e0da931889CFF7947212f9A3131b3C9018

# 3 RPC 含义加密

首字母缩写词 RPC 代表远程过程调用。 RPC 允许远程与服务器通信，并提供在单独位置执行程序的能力。在区块链术语中，RPC 是一组允许客户端（例如 Metamask）与区块链交互的协议。

# RPC 的用途是什么？

为了与区块链交互，我们需要一种通过合适的通用选项访问网络服务器的方法，以执行查看余额、创建交易或与智能合约交互等操作。 RPC 使我们能够与服务器建立连接。
