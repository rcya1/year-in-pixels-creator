import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "react-bootstrap/Button"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

import AddColorSchemeModal from './AddColorSchemeModal';
import EditColorSchemeModal from './EditColorSchemeModal';
import AddColorSchemeButton from './AddColorSchemeButton';

const grid = 6;

const getItemBackgroundStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "lightgreen" : "white",
    border: "1px solid rgba(0, 0, 0, 0.3)",
    borderRadius: ".2rem",
    ...draggableStyle
});

const getItemColorPreviewStyle = (colorScheme) => ({
    backgroundColor: "rgb(" + colorScheme[0] + "," + colorScheme[1] + "," + colorScheme[2] + ")",
    border: "1px solid black",
    height: "0.8em",
    width: "0.8em",
    margin: "auto 0.5em auto 0.2em",
    display: "inline-block",
    verticalAlign: "middle",
});

const getItemLabelStyle = () => ({
    lineHeight: "100%",
    height: "100%",
    fontSize: "18px",
});

export default class ColorSchemeList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            addColorSchemeModalVisible: false,
            editColorSchemeModalVisible: false,
            currentEditedColorScheme: [0, 0, 0, ""]
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.handleAddColorSchemeModalOpen = this.handleAddColorSchemeModalOpen.bind(this);
        this.handleAddColorSchemeModalClose = this.handleAddColorSchemeModalClose.bind(this);
        this.handleEditColorSchemeModalOpen = this.handleEditColorSchemeModalOpen.bind(this);
        this.handleEditColorSchemeModalClose = this.handleEditColorSchemeModalClose.bind(this);
    }

    onDragEnd(result) {
        if(!result.destination) {
            return;
        }

        this.props.changeColorSchemeOrder(result.source.index, result.destination.index);
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

    handleEditColorSchemeModalOpen(colorScheme) {
        this.setState({
            editColorSchemeModalVisible: true,
            currentEditedColorScheme: colorScheme
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
                <Card className={this.props.className}>
                    <Card.Header>
                        <h4 className="text-center">Colors</h4>
                    </Card.Header>
                    <Card.Body>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {this.props.colorSchemes.map((colorScheme, index) => {
                                            return (<Draggable key={colorScheme[3]} draggableId={colorScheme[3]} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemBackgroundStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                    >
                                                        <Container>
                                                            <Row>
                                                                <span style={getItemColorPreviewStyle(colorScheme)}> </span>
                                                                <p className="mr-auto my-auto" style={getItemLabelStyle()}>
                                                                    {colorScheme[3]}
                                                                </p>
                                                                <Button 
                                                                    className="ml-auto" 
                                                                    variant="outline-secondary"
                                                                    size="sm"
                                                                    onClick={
                                                                        () => {
                                                                            this.handleEditColorSchemeModalOpen(colorScheme);
                                                                        }
                                                                    }
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </Row>
                                                        </Container>
                                                    </div>
                                                )}
                                            </Draggable>)
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <AddColorSchemeButton
                            handleClick={this.handleAddColorSchemeModalOpen}
                        />
                    </Card.Body>
                </Card>

                <AddColorSchemeModal
                    visible={this.state.addColorSchemeModalVisible}
                    handleClose={this.handleAddColorSchemeModalClose}
                    handleSubmit={this.props.addColorScheme}
                    checkLabelAlreadyExists={this.props.checkLabelAlreadyExists}
                />
                <EditColorSchemeModal
                    visible={this.state.editColorSchemeModalVisible}
                    handleClose={this.handleEditColorSchemeModalClose}
                    handleSubmit={this.props.editColorScheme}
                    colorScheme={this.state.currentEditedColorScheme}
                />
            </div>
        )
    }
}