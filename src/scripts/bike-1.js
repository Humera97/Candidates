import * as d3 from 'd3'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 30, left: 70, right: 30, bottom: 30 }
const height = 500 - margin.top - margin.bottom
const width = 800 - margin.left - margin.right

console.log('Bikes building')

const svg = d3
  .select('#bike-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// create scales
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, width])
const yPositionScale = d3
  .scaleBand()
  .domain(['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island'])
  .range([height, 0])

// Do you need a d3.line function for this? Maybe something similar?
const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return ` <span style='color:black'>${d.count}</span>`
  })

svg.call(tip)

// Import your data file using d3.csv
d3.csv(require('../data/accidents.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('fill', 'lightblue')
    .attr('y', d => yPositionScale(d.borough))
    .attr('height', 50)
    .attr('width', d => xPositionScale(d.count))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
