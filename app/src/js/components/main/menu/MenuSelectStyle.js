import chroma from "chroma-js";

const dot = function (color = "#ccc") {
  if (chroma(color).css() !== chroma("#FFF").css())
    return {
      alignItems: "center",
      display: "flex",

      ":before": {
        backgroundColor: color,
        border: "1px solid rgba(80, 80, 80, 10)",
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10,
      },
    };
  return null;
};

export const selectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    fontSize: ".875rem",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    let backgroundColor = chroma("#FFF").css();
    if (color.css() === chroma("#FFF").css()) {
      if (isFocused) {
        backgroundColor = chroma("#DDD").css();
      }
    } else {
      if (isSelected) {
        backgroundColor = color.css();
      } else if (isFocused) {
        backgroundColor = color.alpha(0.6).css();
      }
    }
    return {
      ...styles,
      ...dot(data.color),
      backgroundColor: backgroundColor,
      color: "black",
      fontSize: ".875rem",

      ":active": {
        ...styles[":active"],
        backgroundColor: isSelected ? data.color : color.alpha(0.3).css(),
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot("#FFF") }),
  placeholder: (styles) => ({ ...styles, ...dot("#FFF ") }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};
