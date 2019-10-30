import * as d3 from 'd3'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 30, left: 100, right: 100, bottom: 30 }

const height = 500 - margin.top - margin.bottom

const width = 700 - margin.left - margin.right

const svg = d3
  .select('#harry-potter')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 400])
  .range([0, width])

const yPositionScale = d3
  .scalePoint()
  .range([height, 0])
  .padding(0.5)

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return ` <span style='color:black'>${d.values.gender}</span>`
  })

svg.call(tip)

// Read in files
d3.csv(require('../data/harrypotter.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.name
    })
    .entries(datapoints)

  // Go through each group, pull out the name of that group
  const names = nested.map(d => d.key)
  // Teach it to the y position scale
  yPositionScale.domain(names)

  // Add a g element for every single city
  // and then let's do something with each of you
  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(0,${yPositionScale(d.key)})`
    })
    .each(function(d) {
      const g = d3.select(this)
      const name = d.key
      const datapoints = d.values

      const one = d3.max(datapoints, d => d.book1)
      const two = d3.max(datapoints, d => d.book2)
      const three = d3.max(datapoints, d => d.book3)
      const max = d3.max(datapoints, d => d.values)

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(one))
        .attr('x2', xPositionScale(two))
        .attr('stroke', 'gray')
        .attr('fill', 'blue')

      g.append('circle')
        .attr('r', 7)
        .attr('fill', 'lightblue')
        .attr('cy', 0)
        .attr('cx', xPositionScale(one))
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

      g.append('circle')
        .attr('r', 7)
        .attr('fill', 'blue')
        .attr('cy', 0)
        .attr('cx', xPositionScale(two))
    })

  const xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.x-axis line').attr('stroke-dasharray', '1 3')
  svg.selectAll('.x-axis path').remove()

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.y-axis path, .y-axis line').remove()
}
