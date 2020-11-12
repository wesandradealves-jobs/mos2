// CommentListContainer.js
import React, { Component } from 'react';

export default class Select extends Component {
  constructor() {
    super();
  }

  render() {
    const optionItems = this.props.data.map(option => <option key={option.value}>{option.label}</option>);
    const name = this.props.selectName;
    console.log(this.props.selectUrl);
    return (
      <div>
        <select>{optionItems}</select>
      </div>
    );
  }
}
