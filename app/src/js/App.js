import AppNavbar from './AppNavbar'
import Board from './Board'

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CellMenu from './CellMenu';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: Array.from(Array(12), () => new Array(31)),
            menuXPos: 0,
            menuYPos: 0,
            menuVisible: false,
            currentlySelected: [-1, -1]
        }

        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
    }

    handleCellClick(x, y, month, day) {
        this.setState({
            menuXPos: x,
            menuYPos: y,
            menuVisible: true,
            currentlySelected: [month, day]
        })
    }

    handleMenuClose() {
        this.setState({
            menuVisible: false,
            currentlySelected: [-1, -1]
        });
    }

    render() {
        return (
            <div>
                <AppNavbar></AppNavbar>
                <Container fluid>
                    <Row>
                        <Col sm={{ span: 12, order: 1 }} lg={{ span: 6, order: 2 }} className="text-center">
                            <h1 className="title">2021 in Pixels</h1>
                        </Col>
                        <Col sm={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }}>
                            <Board
                                data={this.state.data}
                                handleClick={this.handleCellClick}
                                currentlySelected={this.state.currentlySelected}
                            ></Board>
                        </Col>
                    </Row>
                </Container>
                <CellMenu 
                    xPos={this.state.menuXPos}
                    yPos={this.state.menuYPos}
                    visible={this.state.menuVisible}
                    handleMenuClose={this.handleMenuClose}
                >
                </CellMenu>
            </div>
        );
    }
}

export default App;
