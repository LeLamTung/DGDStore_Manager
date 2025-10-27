import React, { useEffect } from 'react';
import * as d3 from 'd3';

const PieDonutChart = ({ data }) => {
  useEffect(() => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;

    // Xóa nội dung cũ trước khi render lại
    d3.select('#donut-chart').selectAll('*').remove();

    const svg = d3
      .select('#donut-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(['#f4c22b', '#04a9f5', '#ff8a65', '#1de9b6']); // màu tương ứng với trạng thái

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().outerRadius(radius).innerRadius(innerRadius);

    const arcs = svg.selectAll('arc').data(pie(data)).enter().append('g');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colorScale(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text((d) => `${((d.data.value / d3.sum(data, (item) => item.value)) * 100).toFixed(0)}%`);
  }, [data]);

  return <div id="donut-chart"></div>;
};

export default PieDonutChart;
