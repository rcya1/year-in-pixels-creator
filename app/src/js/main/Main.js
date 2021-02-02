import Board from './Board'

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../../css/Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import CellMenu from './menu/CellMenu';
import AddColorSchemeModal from './color-scheme/AddColorSchemeModal';
import EditColorSchemeModal from './color-scheme/EditColorSchemeModal';

class Main extends React.Component {
    constructor(props) {
        super(props);

        let data = Array(12).fill().map(() => Array(31).fill(0));
        let comments = Array(12).fill().map(() => Array(31).fill(""));

        this.state = {
            data: data,
            comments: comments,
            options: [
                [125, 125, 117, "Very Bad Day"], 
                [184, 183, 118, "Bad Day"],
                [175, 125, 197, "Average Day"],
                [126, 252, 238, "Chill Day"],
                [253, 250, 117, "Good Day"],
                [253, 125, 236, "Amazing Day"],
                [255, 171, 111, "Super Special Day"]
            ],
            menuXPos: 0,
            menuYPos: 0,
            menuXOffset: 0,
            menuYOffset: 0,
            menuVisible: false,
            currentlySelected: [-1, -1],

            addColorSchemeModalVisible: false,
            editColorSchemeModalVisible: false
        }

        this.menuXYProvider = null;
        this.updateMenu = this.updateMenu.bind(this);
        this.updateMenuOffset = this.updateMenuOffset.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleMenuSubmit = this.handleMenuSubmit.bind(this);
        
        this.handleAddColorSchemeModalOpen = this.handleAddColorSchemeModalOpen.bind(this);
        this.handleAddColorSchemeModalClose = this.handleAddColorSchemeModalClose.bind(this);
        this.handleEditColorSchemeModalOpen = this.handleEditColorSchemeModalOpen.bind(this);
        this.handleEditColorSchemeModalClose = this.handleEditColorSchemeModalClose.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateMenu);
        window.addEventListener('scroll', this.updateMenu);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateMenu);
        window.removeEventListener('scroll', this.updateMenu);
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

    handleMenuSubmit(month, day, value, comment) {
        let dataCopy = this.state.data.map((arr) => {
            return arr.slice();
        });
        dataCopy[month][day] = value;

        let commentsCopy = this.state.comments.map((arr) => {
            return arr.slice();
        });
        commentsCopy[month][day] = comment;
        this.setState({
            data: dataCopy,
            comments: commentsCopy
        })
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

    handleAddColorSchemeModalOpen() {
        this.setState({
            addColorSchemeModalVisible: true
        });
    }

    handleAddColorSchemeModalClose() {
        this.setState({
            addColorSchemeModalVisible: false
        });
    }

    handleEditColorSchemeModalOpen() {
        this.setState({
            editColorSchemeModalVisible: true
        });
    }

    handleEditColorSchemeModalClose() {
        this.setState({
            editColorSchemeModalVisible: false
        });
    }

    render() {
        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col sm={{ span: 12, order: 1 }} lg={{ span: 6, order: 2 }} className="text-center">
                            <h1 className="title">2021 in Pixels</h1>
                        </Col>
                        <Col sm={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }}>
                            <Board
                                data={this.state.data}
                                handleClick={this.handleCellClick}
                                options={this.state.options}
                                currentlySelected={this.state.currentlySelected}
                            ></Board>
                        </Col>
                    </Row>
                </Container>
                <CellMenu 
                    xPos={this.state.menuXPos + this.state.menuXOffset}
                    yPos={this.state.menuYPos + this.state.menuYOffset}
                    updateMenuOffset={this.updateMenuOffset}
                    visible={this.state.menuVisible}
                    month={this.state.currentlySelected[0]}
                    day={this.state.currentlySelected[1]}
                    value={this.state.data[Math.max(this.state.currentlySelected[0], 0)]
                        [Math.max(this.state.currentlySelected[1], 0)]}
                    comment={this.state.comments[Math.max(this.state.currentlySelected[0], 0)]
                        [Math.max(this.state.currentlySelected[1], 0)]}
                    options={this.state.options}
                    handleMenuSubmit={this.handleMenuSubmit}
                    handleMenuClose={this.handleMenuClose}
                />

                <AddColorSchemeModal
                    visible={this.state.addColorSchemeModalVisible}
                    handleClose={this.handleAddColorSchemeModalClose}
                />
                <EditColorSchemeModal
                    visible={this.state.editColorSchemeModalVisible}
                    handleClose={this.handleEditColorSchemeModalClose}
                />
            </div>
        );
    }
}

export default Main;
