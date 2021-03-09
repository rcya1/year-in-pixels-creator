import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Board from './Board'
import CellMenu from './menu/CellMenu';
import ColorSchemeList from './color-scheme/ColorSchemeList';
import { inLg } from '../../util/BootstrapUtils';
import { getIndex } from '../../util/DateUtils';

export default class YearInPixels extends React.Component {
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
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.updateMenuPosition);
        window.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.updateMenuPosition);
        window.removeEventListener('click', this.handleClick);
    }

    handleResize = () => {
        this.updateMenuPosition();
        if(this.state.inLg !== inLg()) {
            this.setState({
                inLg: inLg()
            });
        }
    }

    handleScroll = () => {
        this.updateMenuPosition();
    }

    handleClick = () => {
        if(inLg()) {
            this.closeMenu();
        }
    }

    handleCellClick = (xyProvider, month, day) => {
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

    updateMenuPosition = () => {
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

    closeMenu = () => {
        this.menuXYProvider = null;
        this.setState({
            menuVisible: false,
            currentlySelected: [-1, -1]
        });
    }

    updateMenuOffset = (top, bottom) => {
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
        let title = (<h1 className="title mt-3 mb-3">2021 in Pixels</h1>);
        let colorSchemeList = (<ColorSchemeList
            className={"mx-auto w-75"}
            style={{ maxWidth: "500px" }}
            colorSchemes={this.props.options}
            loggedIn={this.props.loggedIn}
            changeColorSchemeOrder={this.props.changeColorSchemeOrder}
            editColorScheme={this.props.editColorScheme}
            addColorScheme={this.props.addColorScheme}
            deleteColorScheme={this.props.deleteColorScheme}
            checkLabelExists={this.props.checkLabelExists}
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
                    updateBoardData={this.props.updateBoardData}
                    closeMenu={this.closeMenu}
                />
            </div>
        );
    }
}
