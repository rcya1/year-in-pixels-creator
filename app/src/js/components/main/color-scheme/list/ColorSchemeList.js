import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle
  });
  
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
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
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {this.props.colorSchemes.map((colorScheme, index) => {
                                return (<Draggable key={colorScheme[3]} draggableId={colorScheme[3]} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                        >
                                            {colorScheme[3]}
                                        </div>
                                    )}
                                </Draggable>)
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}