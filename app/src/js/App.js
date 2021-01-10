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

        let data = Array(12).fill().map(() => Array(31).fill(0));
        data[0][0] = 1;
        let comments = Array(12).fill().map(() => Array(31).fill("Test"));
        comments[0][0] = "";

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
            menuVisible: false,
            currentlySelected: [-1, -1]
        }

        this.menuXYProvider = null;
        this.handleResize = this.handleResize.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleMenuSubmit = this.handleMenuSubmit.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        if(this.menuXYProvider != null) {
            let xy = this.menuXYProvider();
            this.setState({
                menuXPos: xy[0],
                menuYPos: xy[1],
            });
        }
    }

    handleCellClick(xyProvider, month, day) {
        this.menuXYProvider = xyProvider;
        let xy = this.menuXYProvider();
        this.setState({
            menuXPos: xy[0],
            menuYPos: xy[1],
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
                                options={this.state.options}
                                currentlySelected={this.state.currentlySelected}
                            ></Board>
                        </Col>
                    </Row>
                </Container>
                <CellMenu 
                    xPos={this.state.menuXPos}
                    yPos={this.state.menuYPos}
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
                >
                </CellMenu>
            </div>
        );
    }
}

export default App;
