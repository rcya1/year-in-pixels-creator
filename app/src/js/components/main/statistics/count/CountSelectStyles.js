import chroma from "chroma-js";

export const selectStyles = {
  container: (styles) => ({
    ...styles,
    maxWidth: "250px",
    textAlign: "center",
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    fontSize: "1.0rem",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    let backgroundColor = chroma("#FFF").css();
    if (isSelected) {
      backgroundColor = chroma("#DDD").css();
    } else if (isFocused) {
      backgroundColor = chroma("#DDD").alpha(0.6).css();
    }
    return {
      ...styles,
      backgroundColor: backgroundColor,
      color: "black",
      fontSize: "1.0rem",
      maxWidth: "250px",
    };
  },
};
