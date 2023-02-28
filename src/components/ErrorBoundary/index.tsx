import { Button, Modal, Result, ResultProps } from "antd";
import React, { PureComponent } from "react";
import { classnames, createBEM } from "../../utils/class-utils";

// import { ImpassiveComponentLoadError } from '../../utils/react-utils';
// import { getRoutePath } from '../../utils/history-utils';

const bem = createBEM("error-boundary");

export default class ErrorBoundary extends PureComponent<ResultProps> {
  state: {
    error: Error | null;
    info: any;
  } = {
    error: null,
    info: {
      componentStack: "",
    },
  };

  componentDidCatch(error: Error | null, info: any) {
    this.setState({ error, info });
  }

  render(): JSX.Element {
    const { children, className, ...restProps } = this.props;

    const { error, info } = this.state;

    if (error) {
      const componentStack =
        info && info.componentStack ? info.componentStack : null;
      const errorMessage = (error && error.name) || (error || "").toString();

      // const isImpassiveComponentLoadError = error instanceof ImpassiveComponentLoadError;
      const isImpassiveComponentLoadError = false;

      return (
        <Result
          className={classnames(bem(), className)}
          status={isImpassiveComponentLoadError ? "warning" : "error"}
          title={
            isImpassiveComponentLoadError
              ? "当前系统已有更新，请刷新重试"
              : "系统异常，请稍后刷新重试"
          }
          subTitle={errorMessage}
          extra={
            <>
              <Button
                type="primary"
                onClick={() => {
                  // window.location.href = getRoutePath(PORTAL_INDEX_PATH);
                  // window.location.href = getRoutePath(PORTAL_INDEX_PATH);
                }}
              >
                回到首页
              </Button>
              <Button
                onClick={() => {
                  Modal.error({
                    title: "错误详情",
                    content: componentStack,
                  });
                }}
              >
                错误详情
              </Button>
            </>
          }
          {...restProps}
        />
      );
    }

    return children as any;
  }
}
