import IndexPage from "../pages/IndexPage";
// import MapImage from "../pages/MapImage";
import MapImage from "../pages/MapImages";
import SocketPage from "../components/Websocket";

const NotFound = () => {
  return <div>NotFound</div>;
};

export const routes = [
  {
    path: "",
    element: <MapImage />,
    meta: {
      title: "地图页",
      needLogin: true,
    },
  },
  {
    path: "/index",
    element: <IndexPage />,
    meta: {
      title: "首页",
      needLogin: false,
    },
  },
  {
    path: "/socket",
    element: <SocketPage />,
    meta: {
      title: "测试ws页面",
      needLogin: false,
    },
  },
  // {
  //   // 子路由添加 * 号
  //   path: "/c/*",
  //   element: <C />,
  //   // 定义二级路由，注意不要加 /
  //   children: [
  //     {
  //       path: "cc",
  //       element: <CC />,
  //     },
  //     {
  //       path: "*",
  //       element: <NotFound />,
  //     },
  //   ],
  // },
  {
    path: "*",
    element: <NotFound />,
  },
];
