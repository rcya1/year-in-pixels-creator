import React from 'react';

import '../css/CellMenu.css';

export default class CellMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.visible) {
            return (
                <div>
                    <ul
                        className="menu"
                        style={{
                            top: this.props.yPos,
                            left: this.props.xPos
                        }}>
                        <li>Test 1</li>
                        <li>Test 2</li>
                        <li>Test 3</li>
                        <li>
                            <button onClick={this.props.handleMenuClose}>Close</button>
                        </li>
                    </ul>
                </div>
            )
        }
        else {
            return null;
        }
    }
}