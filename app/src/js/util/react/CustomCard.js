import { Component } from "react";
import { Card } from "react-bootstrap";

export class CustomCard extends Component {
  render() {
    return (
      <Card className="shadow-sm text-center">
        <Card.Header as="h4">{this.props.title}</Card.Header>
        <Card.Body className="py-2">{this.props.children}</Card.Body>
      </Card>
    );
  }
}

export function createInfoCard(title, items) {
  return (
    <CustomCard title={title}>
      <ul className="list-unstyled mt-3 mb-4">
        {items.map((item) => {
          return <li>{item}</li>;
        })}
      </ul>
    </CustomCard>
  );
}
