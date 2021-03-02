import Board from './Board'

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CellMenu from './menu/CellMenu';
import ColorSchemeList from './color-scheme/ColorSchemeList';
import { inLg } from '../../util/BootstrapUtils';
import { getIndex } from '../../util/DateUtils';

import '../../../css/Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuXPos: 0,
            menuYPos: 0,
            menuXOffset: 0,
            menuYOffset: 0,
            menuVisible: false,
            currentlySelected: [-1, -1],

            inLg: inLg()
        }

        this.menuXYProvider = null;
        this.handleResize = this.handleResize.bind(this);
        this.updateMenu = this.updateMenu.bind(this);
        this.updateMenuOffset = this.updateMenuOffset.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.updateMenu);
        window.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.updateMenu);
        window.removeEventListener('click', this.handleClick);
    }

    handleResize() {
        this.updateMenu();
        if(this.state.inLg !== inLg()) {
            this.setState({
                inLg: inLg()
            });
        }
    }

    updateMenu() {
        if(this.menuXYProvider != null) {
            let xy = this.menuXYProvider();
            this.setState({
                menuXPos: xy[0],
                menuYPos: xy[1],
                menuXOffset: 0,
                menuYOffset: 0
            });
        }
    }

    handleCellClick(xyProvider, month, day) {
        this.menuXYProvider = xyProvider;
        let xy = this.menuXYProvider();
        this.setState({
            menuXPos: xy[0],
            menuYPos: xy[1],
            menuXOffset: 0,
            menuYOffset: 0,
            menuVisible: true,
            currentlySelected: [month, day]
        })
    }

    handleMenuClose() {
        this.menuXYProvider = null;
        this.setState({
            menuVisible: false,
            currentlySelected: [-1, -1]
        });
    }

    handleClick() {
        if(inLg()) {
            this.handleMenuClose();
        }
    }

    updateMenuOffset(top, bottom) {
        let newMenuXOffset = this.state.menuXOffset;
        let newMenuYOffset = this.state.menuYOffset;

        let padding = 10;
        
        if(top - padding < 0) {
            newMenuYOffset -= top - padding;
        }
        if(bottom + padding > window.innerHeight) {
            newMenuYOffset += window.innerHeight - (bottom + padding);
        }

        this.setState({
            menuXOffset: newMenuXOffset,
            menuYOffset: newMenuYOffset
        });
    }

    render() {
        let title = (<h1 className="title">2021 in Pixels</h1>);
        let colorSchemeList = (<ColorSchemeList
            className={this.state.inLg ? "mx-auto w-75 color-scheme-list" : "mx-auto w-75 color-scheme-list"}
            colorSchemes={this.props.options}
            changeColorSchemeOrder={this.props.changeColorSchemeOrder}
            editColorScheme={this.props.editColorScheme}
            addColorScheme={this.props.addColorScheme}
            deleteColorScheme={this.props.deleteColorScheme}
            checkLabelAlreadyExists={this.props.checkLabelAlreadyExists}
        />);
        let board = (<Board
            values={this.props.values}
            handleClick={this.handleCellClick}
            options={this.props.options}
            currentlySelected={this.state.currentlySelected}
        />);

        let content = undefined;
        if(inLg()) {
            content = (<Container fluid>
                <Row>
                    <Col className="text-center">
                        { board }
                    </Col>
                    <Col className="text-center">
                        { title }
                        { colorSchemeList }
                    </Col>
                </Row>
            </Container>);
        }
        else {
            content = (<Container fluid>
                <Row>
                    <Col className="text-center">
                        { title }
                        { board }
                        { colorSchemeList }
                    </Col>
                </Row>
            </Container>);
        }

        return (
            <div>
                { content }
                <CellMenu 
                    xPos={this.state.menuXPos + this.state.menuXOffset}
                    yPos={this.state.menuYPos + this.state.menuYOffset}
                    updateMenuOffset={this.updateMenuOffset}
                    visible={this.state.menuVisible}
                    month={this.state.currentlySelected[0]}
                    day={this.state.currentlySelected[1]}
                    value={this.props.values[getIndex(
                            Math.max(this.state.currentlySelected[0], 0),
                            Math.max(this.state.currentlySelected[1], 0)
                        )]}
                    comment={this.props.comments[getIndex(
                        Math.max(this.state.currentlySelected[0], 0),
                        Math.max(this.state.currentlySelected[1], 0)
                    )]}
                    options={this.props.options}
                    handleMenuSubmit={this.props.updateDay}
                    handleMenuClose={this.handleMenuClose}
                />
            </div>
        );
    }
}

export default Main;
