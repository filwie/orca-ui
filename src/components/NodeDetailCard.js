import React from 'react';
import './NodeDetailCard.scss';


function NodeDetails(props) {
  const nodeProperties = props.nodeProperties;

  const result = JSON.stringify(nodeProperties, function (k, v) {
    if (k !== 'name' && v !== '{}') {
      return v;
    }
  }, 2);

  if (result === '{}') {
    return null;
  }

  return (
    <div className="card-text node-info-text">
      <pre>{result}</pre>
    </div>
  );
}


export class NodeDetailCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeData: {
        kind: '',
        properties: {
          name: ''
        }
      },
      hidden: true
    };

    this.hide = this.hide.bind(this);
  }

  updateNodeData(nodeData) {
    this.setState({ nodeData: nodeData });
  }

  hide() {
    this.setState({ hidden: true });
  }

  show() {
    this.setState({ hidden: false });
  }

  render() {
    return (
      <div className={`card node-info-card ${this.state.hidden ? 'hidden' : ''} pt-0`}>
        <button type="button" className="close mt-1 mr-2 mb-0" aria-label="Close" onClick={this.hide}>
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="card-body mt-0 pt-0">
          <h4 className="card-title">{this.state.nodeData.kind.replace('_', ' ')}</h4>
          <h5 className="card-subtitle">{this.state.nodeData.properties.name}</h5>
          <NodeDetails nodeProperties={this.state.nodeData.properties} />
        </div>
      </div>
    );
  }
}
