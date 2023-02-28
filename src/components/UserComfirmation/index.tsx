import React from "react";
import ReactDOM from "react-dom";
import { Modal } from "antd";

const container = document.createElement("div");

const UserConfirmation = (payload: any, callback: any) => {
  const { action, location, curHref, message } = JSON.parse(payload);

  const handlerModalClose = (callbackState: boolean) => {
    ReactDOM.unmountComponentAtNode(container);

    callback(callbackState);

    if (!callbackState && action === "POP") {
      (window as any).history.replaceState(null, null, curHref);
    }
  };

  ReactDOM.render(
    <Modal
      open={true}
      onCancel={() => handlerModalClose(false)}
      onOk={() => handlerModalClose(true)}
      title="Warning"
    >
      {message}
    </Modal>,
    container
  );
};
export default UserConfirmation;
