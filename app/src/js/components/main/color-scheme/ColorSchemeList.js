import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "react-bootstrap/Button"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

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
    margin: "auto 0.5em auto 0",
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
        
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        if(!result.destination) {
            return;
        }

        this.props.changeColorSchemeOrder(result.source.index, result.destination.index);
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <Card 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={this.props.className}
                        >
                            <Card.Header>
                                <h4 className="text-center">Color Schemes</h4>
                            </Card.Header>
                            <Card.Body>
                                {this.props.colorSchemes.map((colorScheme, index) => {
                                    return (
                                    <Draggable key={colorScheme[3]} draggableId={colorScheme[3]} index={index}>
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
                                                        <Button className="ml-auto" variant="outline-secondary" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Row>
                                                </Container>
                                            </div>
                                        )}
                                    </Draggable>)
                                })}
                                {provided.placeholder}
                            </Card.Body>
                        </Card>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}