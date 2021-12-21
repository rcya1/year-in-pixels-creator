import { Component } from "react";
import Table from "react-bootstrap/Table";

export default class CountTable extends Component {
  getItemColorPreviewStyle(colorScheme) {
    return {
      backgroundColor:
        "rgb(" +
        colorScheme[0] +
        "," +
        colorScheme[1] +
        "," +
        colorScheme[2] +
        ")",
      border: "1px solid black",
      height: "1.5em",
      width: "1.5em",
      margin: "auto 0.5em auto 0.4em",
      display: "inline-block",
      verticalAlign: "middle",
    };
  }

  render() {
    let tableBody = this.props.data.freq.map((freq, index) => {
      return (
        <tr>
          <td>
            <span style={this.getItemColorPreviewStyle(this.props.data.colorSchemes[index])}></span>
          </td>
          <td>{this.props.data.colorSchemes[index][3]}</td>
          <td>{freq}</td>
        </tr>
      );
    });

    return (
      <Table striped hover>
        <thead>
          <th>Color</th>
          <th>Label</th>
          <th>Frequency</th>
        </thead>
        <tbody>{tableBody}</tbody>
      </Table>
    );
  }
}
