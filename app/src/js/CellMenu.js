import React from 'react';

import Constants from './Constants'
import DateUtils from './DateUtils';

import '../css/CellMenu.css';

// TODO Fix that if it will go of screen, then it will still show up correctly
// TODO Add the options to the menu and also check if value is out of range (if it is then just change it to 0)
export default class CellMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            comment: ""
        };

        // this.ref = React.createRef();

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // todo look into using this maybe to do the moving b/c it runs after the first render
    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value || prevProps.comment !== this.props.comment) {
            this.setState({
                value: this.props.value,
                comment: this.props.comment
            })
        }
    }

    onChangeValue(e) {
        this.setState({
            value: e.target.value
        })
    }

    onChangeComment(e) {
        this.setState({
            comment: e.target.value
        })
    }
    
    onSubmit(e) {
        e.preventDefault();
        this.props.handleMenuClose();
        this.props.handleMenuSubmit(this.props.month, this.props.day, this.state.value, this.state.comment);
    }

    render() {
        if(this.props.visible) {
            let title = Constants.fullMonthNames[this.props.month] + " " + (this.props.day + 1) + 
                DateUtils.getOrdinalEnding(this.props.day + 1);

            let top = this.props.yPos + document.documentElement.scrollTop;
            let left = this.props.xPos;
            // if(this.ref.current != null) {
            //     let rect = this.ref.current.getBoundingClientRect();
            //     console.log(rect);
            // }
            // console.log(window.innerHeight);

            return (
                <div className="menu"
                    style={{
                        top: top,
                        left: left
                    }}
                    ref={this.ref}>
                    <form onSubmit={this.onSubmit}>
                        <h4 className="menu-title">{title}</h4>
                        <hr className="menu-divider"></hr>
                        <div className="form-group menu-item menu-select">
                            <select required
                                onChange={this.onChangeValue}
                                value={this.state.value}
                                className="form-control form-control-sm"
                            >
                                <option value={0}>Unselected</option>
                                <option value={1}>Test 1</option>
                                <option value={2}>Test 2</option>
                                <option value={3}>Test 3</option>
                            </select>
                        </div>
                        <div className="form-group menu-item menu-comment">
                            <textarea className="form-control form-control-sm"
                                value={this.state.comment}
                                onChange={this.onChangeComment}
                                placeholder="Comment">
                            </textarea>
                        </div>
                        <div className="form-group menu-submit">
                            <input type="submit" value="Save" className="btn btn-primary btn-block" />
                        </div>
                    </form>
                    <div className="menu-close"
                        onClick={this.props.handleMenuClose}
                    >
                        <div className="menu-close-x" >
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return null;
        }
    }
}