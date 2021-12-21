import React from "react";
import ColorSchemeList from "../../color-scheme/ColorSchemeList";

// will probably have to switch to a normal columns and just set the width of each of them
class SBSView extends React.Component {
  render() {
    return (
      <div
        className="d-flex"
        ref={this.props.innerRef}
        style={{ backgroundColor: "#FFF" }}
      >
        <div
          className="text-center"
          style={{ width: this.props.config.boardPercentage + "%" }}
        >
          {this.props.title}
          {this.props.board}
        </div>
        <div
          className="text-center"
          style={{ width: 100 - this.props.config.boardPercentage + "%" }}
          ref={this.props.data.colRef}
        >
          <div
            style={{
              marginTop: this.props.config.colorsTopMargin + "px",
              float: "left",
              marginLeft: this.props.config.colorsLeftMargin + "px",
              width: this.props.config.colorsWidth + "%",
            }}
          >
            <ColorSchemeList
              ref={this.props.data.colorsRef}
              {...this.props.colorSchemeListProps}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <SBSView innerRef={ref} {...props} />
));
