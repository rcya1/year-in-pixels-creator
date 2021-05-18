import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Board from './board/Board'
import CellMenu from './menu/CellMenu';
import ColorSchemeList from './color-scheme/ColorSchemeList';
import YearSelector from './year-selector/YearSelector';
import AddYearModal from './year-selector/AddYearModal';
import ExportPreview from './export/ExportPreview';

import { getIndex } from 'js/util/DateUtils';

export default class YearInPixels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuXPos: 0,
            menuYPos: 0,
            menuVisible: false,

            showAddYearModal: false,
            exportPreviewMode: false,
            currentlySelected: [-1, -1]
        }

        this.menuXYProvider = null;
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.updateMenuPosition);
        window.addEventListener('mousedown', this.handleClick);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.updateMenuPosition);
        window.removeEventListener('mousedown', this.handleClick);
    }

    handleResize = () => {
        this.updateMenuPosition();
    }

    handleScroll = () => {
        this.updateMenuPosition();
    }

    handleClick = () => {
        if(this.props.inLg) {
            this.closeMenu();
        }
    }

    handleCellClick = (xyProvider, month, day) => {
        this.menuXYProvider = xyProvider;
        let xy = this.menuXYProvider();
        this.setState({
            menuXPos: xy[0],
            menuYPos: xy[1],
            menuVisible: true,
            currentlySelected: [month, day]
        })
    }

    updateMenuPosition = () => {
        if(this.menuXYProvider != null) {
            let xy = this.menuXYProvider();
            this.setState({
                menuXPos: xy[0],
                menuYPos: xy[1]
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

    showAddYearModal = () => {
        this.setState({
            showAddYearModal: true
        });
    }

    closeAddYearModal = () => {
        this.setState({
            showAddYearModal: false
        });
    }

    enableExportPreview = () => {
        this.setState({
            exportPreviewMode: true
        });
    }

    disableExportPreview = () => {
        this.setState({
            exportPreviewMode: false
        });
    }

    render() {
        let title = (<h1 className="display-5 mt-3">{this.props.year + " in Pixels"}</h1>);

        let colorSchemeListProps = {
            colorSchemes: this.props.colorSchemes,
            disabled: !this.props.loggedIn,
            changeColorSchemeOrder: this.props.changeColorSchemeOrder,
            editColorScheme: this.props.editColorScheme,
            addColorScheme: this.props.addColorScheme,
            deleteColorScheme: this.props.deleteColorScheme,
            checkLabelExists: this.props.checkLabelExists,
            exportPreview: this.state.exportPreviewMode,
            style: { maxWidth: "500px" },
            inLg: this.props.inLg,
            className: "mx-auto mt-4 mb-3 " + (this.props.inSm ? "w-100" : "w-75")
        };

        let board = (<Board
            currentDay={this.props.currentDay}
            year={this.props.year}
            showTodayMarker={this.props.boardSettings.showTodayMarker}
            invalidCellsDisplayType={this.props.boardSettings.invalidCellsDisplayType}
            values={this.props.values}
            handleClick={this.handleCellClick}
            showEditing={!this.state.exportPreviewMode}
            colorSchemes={this.props.colorSchemes}
            currentlySelected={this.state.currentlySelected}
        />);

        if(this.state.exportPreviewMode) {
            return (<ExportPreview
                title={title}
                colorSchemeListProps={colorSchemeListProps}
                board={board}
                cancel={this.disableExportPreview}
                createLoadingMessage={this.props.createLoadingMessage}
            />);
        }
        
        let colorSchemeList = (<ColorSchemeList
            {...colorSchemeListProps}
        />);

        let yearSelector = (<YearSelector
            year={String(this.props.year)}
            years={this.props.years}
            disabled={!this.props.loggedIn}
            changeYear={this.props.changeYear}
            deleteYear={this.props.deleteYear}
            showAddYearModal={this.showAddYearModal}
            className={"mt-4 mb-2 mx-auto " + (this.props.inSm ? "w-100" : "w-50")}
        />);
        
        let exportImageButton = (<Button
            className="mt-2 mb-4"
            onClick={this.enableExportPreview}
            variant="outline-secondary"
        >
            Export Image
        </Button>)

        let content = undefined;
        if(this.props.inLg) {
            content = (<Container fluid>
                <Row>
                    <Col className="text-center">
                        { title }
                        { board }
                    </Col>
                    <Col className="text-center">
                        { yearSelector }
                        { colorSchemeList }
                        { exportImageButton }
                    </Col>
                </Row>
            </Container>);
        }
        else {
            content = (<Container fluid>
                <Row>
                    <Col className="text-center">
                        { title }
                        { yearSelector }
                        { board }
                        { colorSchemeList }
                        { exportImageButton }
                    </Col>
                </Row>
            </Container>);
        }

        return (
            <div>
                { content }
                <CellMenu 
                    xPos={this.state.menuXPos}
                    yPos={this.state.menuYPos}
                    maxWidth={this.state.menuMaxWidth}
                    maxHeight={this.state.menuMaxHeight}
                    maxTextHeight={this.state.menuMaxTextHeight}
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
                    options={this.props.colorSchemes}
                    updateBoardData={this.props.updateBoardData}
                    closeMenu={this.closeMenu}

                    inLg={this.props.inLg}
                />
                <AddYearModal
                    visible={this.state.showAddYearModal}
                    addYear={this.props.addYear}
                    checkYearExists={this.props.checkYearExists}
                    closeModal={this.closeAddYearModal}
                />
            </div>
        );
    }
}
