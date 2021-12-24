import { Component } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import chroma from "chroma-js";

export default class CountPieChart extends Component {
  renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.05;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render() {
    let dataExists = false;

    let data = this.props.data.freq.map((freq, index) => {
      if(freq > 0) dataExists = true;
      return {
        name: this.props.data.colorSchemes[index][3],
        value: freq,
      };
    });

    if(!dataExists) {
      return <h4 className="mx-auto">No Data</h4>
    }

    return (
      <ResponsiveContainer width="100%" aspect={1.0}>
        <PieChart width="100%" height="100%">
          <Pie
            dataKey="value"
            data={data}
            isAnimationActive={true}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={this.renderLabel}
            outerRadius="75%"
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chroma(
                  this.props.data.colorSchemes[index].slice(0, 3)
                ).hex()}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
