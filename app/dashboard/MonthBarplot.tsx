'use client';

import * as d3 from 'd3';

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

type BarplotProps = {
  width: number;
  height: number;
  data: { month: string; totalLikes: number, totalDislikes: number, totalPrompts: number }[];
};

const Barplot = ({ width, height, data }: BarplotProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // X axis is for groups since the barplot is vertical
  const groups = data.sort((a, b) => b.totalPrompts - a.totalPrompts).map((d) => d.month);
  const xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, boundsWidth])
    .padding(BAR_PADDING);

  // Y axis
  const max = d3.max(data.map((d) => d.totalPrompts)) ?? 10;
  const yScale = d3
    .scaleLinear()
    .domain([max * 1.2, 0])
    .range([0, boundsHeight]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const x = xScale(d.month);
    if (x === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <rect
          x={x}
          y={yScale(d.totalPrompts)}
          width={xScale.bandwidth()}
          height={boundsHeight - yScale(d.totalPrompts)}
          opacity={0.9}
          stroke="#6689c6"
          fill="#6689c6"
          fillOpacity={0.6}
          strokeWidth={1}
          rx={1}
        />
        <text
          x={x + xScale.bandwidth() / 2}
          y={yScale(d.totalPrompts) - 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={12}
        >
          {d.totalPrompts}
        </text>
        <text
          x={x + xScale.bandwidth() / 2}
          y={boundsHeight + 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={12}
        >
          {d.month}
        </text>
      </g>
    );
  });

  const grid = yScale.ticks(5).map((value, i) => (
    <g key={i}>
      <line
        x1={0}
        x2={boundsWidth}
        y1={yScale(value)}
        y2={yScale(value)}
        stroke="#808080"
        opacity={0.2}
      />
      <text
        x={-10}
        y={yScale(value)}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize={9}
        stroke="#808080"
        opacity={0.8}
      >
        {value}
      </text>
    </g>
  ));

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {grid}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};

export default Barplot;