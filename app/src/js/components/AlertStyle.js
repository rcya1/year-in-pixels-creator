import { Alert } from "react-bs-notifier";
import { withStyles } from "react-jss";

const styles = {
  icon: {
    marginTop: "0.35em",
    opacity: 0.2,
    fontSize: "18px",
    paddingRight: "16px",
    verticalAlign: "top",
  },
  close: {
    float: "right",
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: 1,
    color: "#000",
    textShadow: "0 1px 0 #fff",
    opacity: 0.5,
    padding: 0,
    backgroundColor: "transparent",
    border: 0,
    marginLeft: "0.5em",

    "&:hover, &:focus": {
      opacity: 0.75,
    },
  },
};

export let StyledAlert = withStyles(styles)(Alert);
