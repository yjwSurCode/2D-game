import React from "react";
import "./MapImage.less";

import { ImageMap, Area } from "@qiuz/react-image-map";

export interface AreaType extends Area {
  href?: string;
}

const onMapClick = (area: AreaType, index: number) => {
  const tip = `click map${area.href || index + 1}`;
  console.log(tip);
  alert(tip);
};

const mapArea: any[] = [
  {
    left: "0%",
    top: "6%",
    height: "12%",
    width: "33%",
    style: { background: "rgba(255, 0, 0, 0.5)" },
    onMouseOver: () => console.log("map onMouseOver"),
  },
  {
    width: "33%",
    height: "12%",
    left: "0%",
    top: "36.37931034482759%",
    style: { background: "rgba(255, 0, 0, 0.5)" },
    render: (area: any, index: number) => (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 0, 0.5)",
        }}
      >
        can render map node
      </span>
    ),
    onMouseOver: () => console.log("map onMouseOver"),
  },
];

// in hooks
export default function Example() {
  const img =
    "https://n.sinaimg.cn/sinacn20118/408/w690h518/20190701/a126-hzfeken6884504.jpg";

  const ImageMapComponent = React.useMemo(
    () => (
      <ImageMap
        className="usage-map"
        src={img}
        map={mapArea}
        onMapClick={onMapClick}
      />
    ),
    [img]
  );

  return <div>{ImageMapComponent}</div>;
}
