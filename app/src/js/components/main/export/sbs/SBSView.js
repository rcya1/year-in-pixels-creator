import React from "react"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ColorSchemeList from '../../color-scheme/ColorSchemeList'

class SBSView extends React.Component {
    
    render() {
        return (<Container
            ref={this.props.innerRef}
            style={{backgroundColor: "#FFF"}}
        >
            <Row>
                <Col className="text-center">
                    <div style={{float: "right"}}>
                        { this.props.title }
                        { this.props.board }
                    </div>
                </Col>
                <Col className="text-center" ref={this.props.data.colRef}>
                    <div style={{
                        marginTop: this.props.config.colorsTopMargin + "px",
                        float: "left",
                        marginLeft: this.props.config.colorsLeftMargin + "px",
                        width: this.props.config.colorsWidth + "%"
                    }}
                    >
                        <ColorSchemeList
                            ref={this.props.data.colorsRef}
                            {...this.props.colorSchemeListProps}
                        />
                    </div>
                </Col>
            </Row>
        </Container>);
    }
}

export default React.forwardRef((props, ref) => <SBSView 
    innerRef={ref} {...props}
/>);
