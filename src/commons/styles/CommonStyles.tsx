import { makeStyles } from "@fluentui/react-components";

export const useCommonStyles = makeStyles({
  errorText: {
    color: "#F00",
  },
  hidden: {
    display: "none",
  },
  horizontalStack: {
    display: "flex",
    flexDirection: "row",
  },
  verticalStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  horizontalChildrenGap: {
    "> :not(:first-child)": {
      marginLeft: "15px"
    }
  },
  verticalChildrenGap: {
    "> :not(:first-child)": {
      marginTop: "15px",
    }
  },
});