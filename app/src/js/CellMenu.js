import React from 'react';
import Select from 'react-select'
import chroma from 'chroma-js';

import Constants from './Constants'
import DateUtils from './DateUtils';

import '../css/CellMenu.css';

// TODO Fix that if it will go of screen, then it will still show up correctly
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

    onChangeValue(newValue) {
        this.setState({
            value: newValue.value
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

            let options = this.props.options.map((option, index) => {
                return {
                    value: index + 1,
                    label: option[3],
                    color: "rgb(" + option[0] + "," + option[1] + "," + option[2] + ")"
                };
            });

            options.unshift({
                value: 0,
                label: "Unselected",
                color: "#FFF"
            });

            const dot = (color = '#ccc') => {
                if(chroma(color).css() !== chroma("#FFF").css()) return {
                    alignItems: 'center',
                    display: 'flex',
                
                    ':before': {
                        backgroundColor: color,
                        borderRadius: 10,
                        content: '" "',
                        display: 'block',
                        marginRight: 8,
                        height: 10,
                        width: 10,
                    },
                }
                return null;    
            };
              
            const colourStyles = {
                control: styles => ({ 
                    ...styles,
                    backgroundColor: 'white',
                    fontSize: '.875rem'
                }),
                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                    const color = chroma(data.color);
                    let backgroundColor = chroma('#FFF').css();
                    if(color.css() === chroma('#FFF').css()) {
                        if(isFocused) {
                            backgroundColor = chroma('#DDD').css();
                        }
                    }
                    else {
                        if(isSelected) {
                            backgroundColor = color.css();
                        }
                        else if(isFocused) {
                            backgroundColor = color.alpha(0.6).css();
                        }
                    }
                    return {
                        ...styles,
                        ...dot(data.color),
                        backgroundColor: backgroundColor,
                        color: 'black',
                        fontSize: '.875rem',
                
                        ':active': {
                            ...styles[':active'],
                            backgroundColor: isSelected ? data.color : color.alpha(0.3).css(),
                        },
                    };
                },
                input: styles => ({ ...styles, ...dot('#FFF') }),
                placeholder: styles => ({ ...styles, ...dot('#FFF ') }),
                singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
            };

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
                            <Select
                                value={options[this.state.value]}
                                options={options}
                                onChange={this.onChangeValue}
                                styles={colourStyles}
                            >    
                            </Select>
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