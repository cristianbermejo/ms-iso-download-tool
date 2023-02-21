import { Button, Divider, mergeClasses, Title2 } from "@fluentui/react-components";
import React from "react";
import { useCommonStyles } from "../../commons/styles/CommonStyles";
import { DownloadProps } from "./Download.props";

export const Download: React.FunctionComponent<DownloadProps> = (props) => {
  // Styles
  const commonClasses = useCommonStyles();
  const verticalStackWithChildrenGap = mergeClasses(commonClasses.verticalStack, commonClasses.verticalChildrenGap);

  return (
    <>
      {props.links.length > 0 &&
        <div className={verticalStackWithChildrenGap}>
          <Divider />
          <Title2>{props.title}</Title2>
          {props.links!.map((link) =>
          <React.Fragment key={link.text}>
            <Button appearance="primary" onClick={() => window.open(link.url)}>{link.text}</Button>
          </React.Fragment>
          )}
        </div>
      }
    </>
  );
};