import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ColorSchemeList from "../../color-scheme/ColorSchemeList";

class StackedView extends React.Component {
  render() {
    return (
      <Container
        ref={this.props.innerRef}
        className="mw-100"
        style={{ backgroundColor: "#FFF" }}
      >
        <Row>
          <Col className="text-center">
            <div className="mx-auto">
              {this.props.title}
              {this.props.board}
              <div
                className="mx-auto mb-4"
                style={{
                  marginTop: this.props.config.colorsTopMargin + "px",
                  width: this.props.config.colorsWidth + "%",
                }}
              >
                <ColorSchemeList
                  ref={this.props.data.colorsRef}
                  {...this.props.colorSchemeListProps}
                  notResizable
                />
              </div>
              {this.props.stats}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <StackedView innerRef={ref} {...props} />
));
