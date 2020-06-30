import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import textures from 'textures';

import { DateTimePicker } from './DateTimePicker';
import './Graph.scss';
import { render } from 'react-dom';


const nodeCircleRadius = 15;

function clearClicked() {
  d3.selectAll('.clicked').classed('clicked', false);
}

function nodeMouseOver(node, nodeData) {
  const radiusMultiplier = 1.5;
  node.attr('r', nodeCircleRadius * radiusMultiplier);
}

function nodeMouseOut(node, nodeData) {
  node.attr('r', nodeCircleRadius);
}

function displayNodeDetails(nodeData) {
  d3.select('.node-info-card').classed('visible', true);

  const nodeInfoCardContent = (
    <div>
      <button type="button" className="close" aria-label="Close" onClick={hideNodeDetails}>
        <span aria-hidden="true">&times;</span>
      </button>
      <div className="card-body">
        <h5 className="card-title">{nodeData.kind.replace('_', ' ')}</h5>
        <div className="card-text node-info-text">
          <pre>{JSON.stringify(nodeData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );

  const nodeInfoCard = document.querySelector('.node-info-card');
  return render(nodeInfoCardContent, nodeInfoCard);
}

function hideNodeDetails() {
  d3.select('.node-info-card').classed('visible', false).attr('opacity', 0);
}

function nodeClick(node, nodeData) {
  clearClicked();
  node.classed('clicked', true);
  displayNodeDetails(nodeData);
}

export class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: null,
      node: null,
      simulation: null
    };

    this.generateGraph = this.generateGraph.bind(this);
    this.graphUpdate = this.graphUpdate.bind(this);
    this.onDateTimeSelect = this.onDateTimeSelect.bind(this);
    this.ticked = this.ticked.bind(this);
  }

  componentDidMount() {
    this.loadData(this.generateGraph);
  }

  onDateTimeSelect() {
    this.loadData(this.graphUpdate);
  }

  loadData(cb) {
    axios.get(process.env.REACT_APP_BACKEND_HOST + '/v1/graph')
      .then((response) => {
        cb(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  graphUpdate(response) {
    /*
      Graph Update Code
    */
  }

  generateGraph(response) {
    const svg = d3.select('#chart-area')
      .append('svg')
      .style('width', '100%')
      .style('height', '100%');


    const texture1 = textures
      .lines()
      .thicker();

    svg.call(texture1);

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const g = svg
      .call(d3.zoom().on('zoom', () => {
        g.attr('transform', d3.event.transform);
      }))
      .append('g');

    const links = response.data.links;
    const nodes = response.data.nodes;

    const simulation = d3.forceSimulation(d3.values(nodes))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(links).id(d => d.id).distance(100).strength(1))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const link = g.append('g')
      .attr('class', 'link')
      .selectAll('line')
      .data(links)
      .join('line');

    const node = g.append('g')
      .attr('class', 'graph-node')
      .selectAll('circle')
      .data(simulation.nodes())
      .join('circle')
      .style('fill', texture1.url())
      .attr('id', d => `graph-node-${d.id}`)
      .attr('class', d => `graph-node ${d.kind}`)
      .attr('r', nodeCircleRadius)
      .call(this.drag(simulation));

    node.append('title')
      .text((d) => { return d.id; });

    node
      .on('mouseover', d => nodeMouseOver(d3.select(`#graph-node-${d.id}`), d))
      .on('mouseout', d => nodeMouseOut(d3.select(`#graph-node-${d.id}`), d))
      .on('click', d => nodeClick(d3.select(`#graph-node-${d.id}`), d));

    this.setState({
      link: link,
      node: node,
      simulation: simulation
    }, () => {
      simulation.on('tick', this.ticked);
    });
  }

  ticked() {
    this.state.link
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });

    this.state.node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  drag(simulation) {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  render() {
    return (
      <div className="app">
        <div id="chart-area">
          <div className="card node-info-card"></div>
          <DateTimePicker onSelect={this.onDateTimeSelect} />
        </div>
      </div>
    );
  }
}
