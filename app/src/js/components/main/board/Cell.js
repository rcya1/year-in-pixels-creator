import React from 'react';
import { InvalidCellsDisplayType } from 'js/util/SettingsUtils'

let squareLength = 30;

let getCellStyle = (active, valid, invalidCellsDisplayType, backgroundColor) => {
    let colorOptions;

    switch(invalidCellsDisplayType) {
        case InvalidCellsDisplayType.NORMAL:
            colorOptions = {
                border: active ? "3px solid rgba(0, 0, 0, 0.7)" : "1px solid rgb(0, 0, 0)",
                backgroundColor: backgroundColor,
            };
            break;
        case InvalidCellsDisplayType.INVISIBLE:
            colorOptions = {
                border: valid ? (active ? "3px solid rgba(0, 0, 0, 0.7)" : "1px solid rgb(0, 0, 0)") : "none",
                backgroundColor: backgroundColor,
            };
            break;
        case InvalidCellsDisplayType.GRAYED_OUT:
            colorOptions = {
                border: active ? "3px solid rgba(0, 0, 0, 0.7)" : "1px solid rgb(0, 0, 0)",
                backgroundColor: valid ? backgroundColor : "rgba(0, 0, 0, 0.25)",
            };
            break;
        default: 
            colorOptions = {

            };
            break;
    }
    
    return {
        width: squareLength + "px",
        height: squareLength + "px",
        cursor: "pointer",
        position: "relative",
        zIndex: "-1",
        ...colorOptions
    }
};

let todayTriangle = {
    content: "",
    position: "absolute",
    top: "0",
    right: "0",
    width: 0, 
    height: 0, 
    display: "block",
    borderLeft: "10px solid transparent",
    borderBottom: "10px solid transparent",
    borderTop: "10px solid black",
};

export default class Cell extends React.Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        let backgroundColor = "";
        if(this.props.value) {
            let length = this.props.colorSchemes.length;
            let value = parseInt(this.props.value) - 1;

            if(value >= 0 && value < length) {
                let color = this.props.colorSchemes[value];
                backgroundColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
            }
        }

        return (
            <td 
                style={getCellStyle(this.props.active, this.props.valid, this.props.invalidCellsDisplayType, backgroundColor)}
                ref={this.ref}
                onClick = {(e) => {
                    if(this.props.valid) {
                        e.stopPropagation();
                        this.props.handleClick(() => {
                            if(this.ref.current == null) return [-1, -1];
                            let rect = this.ref.current.getBoundingClientRect();
                            return [rect.x + rect.width * 3 / 4, rect.y + rect.height / 2];
                        }, this.props.month, this.props.day)}
                    }
                }
            >
                {this.props.showTodayMarker && <span style={todayTriangle}></span>}
            </td>
        )
    }
}