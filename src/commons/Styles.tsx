import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  errorText: { color: "#F00" },
  errorFormField: {
    borderTopColor: "#F00",
    borderRightColor: "#F00",
    borderBottomColor: "#F00",
    borderLeftColor: "#F00",
    ":hover": {
      borderTopColor: "#F00",
      borderRightColor: "#F00",
      borderBottomColor: "#F00",
      borderLeftColor: "#F00",
    },
  },
  fiftyPadding: {
    paddingTop: "50px",
    paddingRight: "50px",
    paddingBottom: "50px",
    paddingLeft: "50px",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  hidden: {
    display: "none",
  },
  leftGap: { "> :not(:first-child)": { marginLeft: "15px" }},
  topGap: { "> :not(:first-child)": { marginTop: "15px" }},
  twentyEmWide: { width: "20em" },
  verticallyAligned: { marginTop: "auto", marginBottom: "auto" },
});