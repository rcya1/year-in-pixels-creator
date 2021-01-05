import React from 'react';

import '../css/Cell.css'

export default class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        let className = "cell cell-inactive";
        if(this.props.active) className = "cell cell-active";

        const colors = [
            [125, 125, 117], 
            [184, 183, 118],
            [175, 125, 197],
            [126, 252, 238],
            [253, 250, 117],
            [253, 125, 236]];

        let generatedStyle;
        if(this.props.data) {
            let color = colors[parseInt(this.props.data)];
            generatedStyle = {
                backgroundColor: "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")"
            }
        }

        return (
            <td 
                className={className}
                ref={this.ref}
                style={generatedStyle}
                onClick = {() => {
                    let rect = this.ref.current.getBoundingClientRect();
                    if(this.props.valid) {
                        this.props.handleClick(rect.x + rect.width * 3 / 4, rect.y + rect.height / 2, 
                            this.props.month, this.props.day)}
                    }
                }
            >
            </td>
        )
    }
}