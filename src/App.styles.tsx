import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
    fiftyPaddding: {
        paddingTop: "50px",
        paddingRight: "50px",
        paddingBottom: "50px",
        paddingLeft: "50px",
    },
    head: {
        height: "50px",
        paddingLeft: "25px",
        color: "#FFF",
        backgroundColor: tokens.colorBrandForeground1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
})