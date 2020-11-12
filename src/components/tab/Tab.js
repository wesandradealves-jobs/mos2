import React from 'react';

class Tab extends React.Component {
  '';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <li className="nav-tab">
        <input
          type="radio"
          name="tabs"
          className="tabs"
          id={`tab${this.props.value}`}
          value={this.props.value}
          checked={this.props.selectedTab === this.props.value}
          onChange={this.props.onChangeValue}
        />
        <label htmlFor={`tab${this.props.value}`} className="label">
          <img alt="icon" src={this.props.icon} className="icon" />
          {this.props.title}
        </label>
      </li>
    );
  }
}

export default Tab;
