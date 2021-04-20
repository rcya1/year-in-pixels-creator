import React from "react"
import Col from 'react-bootstrap/Col';
import ColorSchemeList from '../../color-scheme/ColorSchemeList'

export default class SBSView extends React.Component {
    
    render() {
        let maxWidth = 250;
        if(this.props.data.colRef.current != null) {
            let colRect = this.props.data.colRef.current.getBoundingClientRect();
            maxWidth = colRect.width - this.props.config.colorsLeftMargin - 50;
        }

        return (<React.Fragment>
            <Col className="text-center">
                <div style={{float: "right"}}>
                    { this.props.title }
                    { this.props.board }
                </div>
            </Col>
            <Col className="text-center" ref={this.props.data.colRef}>
                <div style={{marginTop: this.props.config.colorsTopMargin + "px", float: "left",
                    marginLeft: this.props.config.colorsLeftMargin + "px"}}
                >
                    <ColorSchemeList
                        ref={this.props.data.colorsRef}
                        maxWidth={maxWidth}
                        {...this.props.colorSchemeListProps}
                    />
                </div>
            </Col>
        </React.Fragment>);
    }
}