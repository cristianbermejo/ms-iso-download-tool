import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  errorText: {
    color: "#F00",
  },
  verticallyAligned: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  horizontalStack: {
    display: "flex",
    flexDirection: "row",
  },
  productKeyInput: {
    width: "32ch",
    boxSizing: "content-box",
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