import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "react-bootstrap/Button"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import AddColorSchemeModal from './AddColorSchemeModal';
import EditColorSchemeModal from './EditColorSchemeModal';
import AddColorSchemeButton from './AddColorSchemeButton';
import DeleteButton from 'js/components/main/DeleteButton';

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
    margin: "auto 0.5em auto 0.4em",
    display: "inline-block",
    verticalAlign: "middle",
});

const getItemLabelStyle = (exportPreview) => ({
    lineHeight: "normal",
    height: "100%",
    fontSize: "1.1rem",
    maxWidth: exportPreview ? "100%" : "50%"
});

class ColorSchemeList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            addColorSchemeModalVisible: false,
            editColorSchemeModalVisible: false,
            currentEditedColorScheme: [0, 0, 0, ""]
        }
    }

    onDragEnd = (result) => {
        if(!result.destination) {
            return;
        }

        this.props.changeColorSchemeOrder(result.source.index, result.destination.index);
    }

    openAddColorSchemeModal = () => {
        this.setState({
            addColorSchemeModalVisible: true
        });
    }

    closeAddColorSchemeModal = () => {
        this.setState({
            addColorSchemeModalVisible: false
        });
    }

    openEditColorSchemeModal = (colorScheme) => {
        this.setState({
            editColorSchemeModalVisible: true,
            currentEditedColorScheme: colorScheme
        });
    }

    closeEditColorSchemeModal = () => {
        this.setState({
            editColorSchemeModalVisible: false
        });
    }

    addOverlay = (component) => {
        return (<OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">Create an account to use custom color schemes!</Tooltip>}
        >
            <span style={{display: "inline-block"}}>{component}</span>
        </OverlayTrigger>);
    }

    createEditButton = (colorScheme) => {
        let editButtonBaseStyle = {
            fontSize: this.props.inLg ? "1.0rem" : "1.1rem"
        };

        let button = (<Button 
            className="ml-auto" 
            variant="outline-secondary"
            size="sm"
            disabled={this.props.disabled}
            onClick={
                () => {
                    this.openEditColorSchemeModal(colorScheme);
                }
            }
            style={this.props.disabled ? {
                    pointerEvents: "none",
                    ...editButtonBaseStyle
                } : {
                    ...editButtonBaseStyle
                }}
        >
            Edit
        </Button>);

        if(!this.props.disabled) return button;
        return this.addOverlay(button);
    }

    createDeleteButton = (colorScheme) => {
        let button = (<DeleteButton
            disabled={this.props.disabled}
            handleClick={
                () => {
                    this.props.deleteColorScheme(colorScheme[3]);
                }
            }
            inLg={this.props.inLg}
        />);

        if(!this.props.disabled) return button;
        return this.addOverlay(button);
    }

    createAddButton = () => {
        let button = (<AddColorSchemeButton
            disabled={this.props.disabled}
            handleClick={this.openAddColorSchemeModal}
            inLg={this.props.inLg}
        />);

        if(!this.props.disabled) return button;
        return this.addOverlay(button);
    }

    render() {
        let card = (<Card className={this.props.className}
            style={this.props.exportPreview ? {
                overflow: "hidden",
                resize: "none"
            } : null}
            ref={this.props.innerRef}
        >
            <Card.Header>
                <h3 className="text-center">Colors</h3>
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
                                    return (
                                    <Draggable 
                                        key={colorScheme[3]}
                                        draggableId={colorScheme[3]}
                                        index={index}
                                        isDragDisabled={this.props.disabled || this.props.exportPreview}
                                    >
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
                                                        <p className="mr-auto my-auto text-truncate" 
                                                            style={getItemLabelStyle(this.props.exportPreview)}
                                                        >
                                                            {colorScheme[3]}
                                                        </p>
                                                        {!this.props.exportPreview && this.createEditButton(colorScheme)}
                                                        {!this.props.exportPreview && this.createDeleteButton(colorScheme)}
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
                {!this.props.exportPreview && this.createAddButton()}
            </Card.Body>
        </Card>);

        if(this.props.exportPreview) {
            return card;
        }

        return (
            <div>
                {card}
                <AddColorSchemeModal
                    visible={this.state.addColorSchemeModalVisible}
                    closeModal={this.closeAddColorSchemeModal}
                    addColorScheme={this.props.addColorScheme}
                    checkLabelExists={this.props.checkLabelExists}
                />
                <EditColorSchemeModal
                    visible={this.state.editColorSchemeModalVisible}
                    closeModal={this.closeEditColorSchemeModal}
                    editColorScheme={this.props.editColorScheme}
                    colorScheme={this.state.currentEditedColorScheme}
                    checkLabelExists={this.props.checkLabelExists}
                />
            </div>
        )
    }
}

export default React.forwardRef((props, ref) => <ColorSchemeList 
    innerRef={ref} {...props}
/>);
