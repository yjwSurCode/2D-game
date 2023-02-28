import React, { useEffect, useState } from "react";
import { createFC } from "../utils/react-utils";
import { useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";
import cookie from "react-cookies";

//ethers
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../core/config";

//Meta Mask
import { useMetaMask, useConnectedMetaMask } from "metamask-react";

//css
import "./MapImage.less";

const MapImage = createFC("MapPage", (props) => {
  // const { ethereum } = window;
  const navigate = useNavigate();
  const { status, connect, account, chainId, ethereum, switchChain, addChain } =
    useMetaMask();
  const [cookies, setCookie] = useCookies(["name"]);

  const goGamePage = () => {
    navigate("/index", { replace: false, state: { name: "zhou" } });

    // setCookie("name", 888, { path: "/", expires: inFifteenMinutes });

    // let inFifteenMinutes = new Date(new Date().getTime() + 24 * 3600 * 1000); //一天
    let inFifteenMinutes = new Date(new Date().getTime() + 5 * 1000); //5秒钟

    cookie.save("expiresTime", "123", { expires: inFifteenMinutes });
  };

  const goSoketPage = () => {
    navigate("/socket", { replace: false, state: { name: "socket" } });
    let inFifteenMinutes = new Date(new Date().getTime() + 5 * 1000); //5秒钟

    cookie.save("expiresTime", "123", { expires: inFifteenMinutes });
  };

  const rederMeta = (status: any) => {
    if (status === "initializing")
      return <div>Synchronisation with MetaMask ongoing...</div>;

    if (status === "unavailable")
      return <div>MetaMask not available :( 用户未安装小狐狸</div>;

    if (status === "notConnected")
      return <button onClick={connect}>Connect to MetaMask</button>;

    if (status === "connecting") return <div>Connecting...</div>;

    if (status === "connected")
      return (
        <div>
          Connected account {account} on chain ID {chainId}
        </div>
      );
  };

  const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      //! 判断加默认
      contractAddress == account ? account : contractAddress,
      contractABI,
      signer
    );

    return transactionsContract;
  };

  const networks = {
    mainnet: "0x1", // 1
    // Test nets
    goerli: "0x5", // 5
    ropsten: "0x3", // 3
    rinkeby: "0x4", // 4
    kovan: "0x2a", // 42
    mumbai: "0x13881", // 80001
    // Layers 2
    arbitrum: "0xa4b1", // 42161
    optimism: "0xa", // 10
    // Side chains
    polygon: "0x89", // 137
    gnosisChain: "0x64", // 100
    // Alt layer 1
    binanceSmartChain: "0x38", // 56
    avalanche: "0xa86a", // 43114
    cronos: "0x19", // 25
    fantom: "0xfa", // 250
  };

  const gnosisChainNetworkParams = {
    chainId: networks.gnosisChain,
    chainName: "Gnosis Chain",
    rpcUrls: ["https://rpc.gnosischain.com/"],
    nativeCurrency: {
      name: "xDAI",
      symbol: "xDAI",
      decimals: 18,
    },
    // 区块浏览器 URL
    blockExplorerUrls: ["https://blockscout.com/xdai/mainnet/"],
  };

  const formData = {
    addressTo: "0xA9c3a37ad77C1D72a4A979cc36318b8FE90C2d09",
    amount: "0.01",
    keyword: "test-key",
    message: "test-message",
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              // useMetaMask();获取
              from: account,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);

        const transactionsCount =
          await transactionsContract.getTransactionCount();

        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const handleMining = () => {
    console.log("挖矿");
  };

  useEffect(() => {
    // 存储用户信息
    // window.localStorage.setItem("userId", "3");
    // window.localStorage.setItem("roomId", "1");
    console.log("aaa-cookies", cookies);
  }, [cookies]);

  console.log(
    "status---->",
    status,
    "connect---->",
    connect,
    "account---->",
    account,
    "chainId---->",
    chainId,
    "ethereum---->",
    ethereum
  );

  return (
    <div>
      {/* //! 如何去主动断开小狐狸连接 */}
      {/* //! 如已连接小狐狸 展示小狐狸信息 未连接要求连接 */}
      {rederMeta(status)}
      <button onClick={() => switchChain("0x1")}>
        Switch to Ethereum Mainnet
      </button>
      <button onClick={() => addChain(gnosisChainNetworkParams)}>
        Add Gnosis chain
      </button>
      <button onClick={() => sendTransaction()}>转账</button>
      {/* <!-- map 客户端图像映射器。通过img标签的usemap与map的name绑定 --> */}
      {/* //! 打包没有public */}
      <div>
        <img
          className="mapImg"
          src="../poker/map.gif"
          useMap="#planetmap"
          alt="Planets"
        />
        <div className="minText">123</div>
      </div>
      <map name="planetmap" id="planetmap">
        <area
          style={{ cursor: "pointer" }}
          shape="circ"
          coords="350,350,100"
          // href="./index"
          // target="_blank"
          alt="Venus"
          onClick={goGamePage}
        />
        <area
          style={{ cursor: "pointer" }}
          shape="circ"
          coords="1500,350,200"
          // href="./index"
          // target="_blank"
          alt="Venus"
          onClick={handleMining}
        />
        {/* <area
          shape="circle"
          coords="1300,500,410"
          // href="https://qq.com"
          target="_blank"
          alt="Sun"
          onClick={goSoketPage}
        /> */}
      </map>
    </div>
  );
});

export default MapImage;
