import React from 'react';

class FileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.uniqueId = `selector-${this.props.name}`;
    this.state = {
      file: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.clear = this.clear.bind(this);
  }

  handleChange(event) {
    const file = event.target.files[0];
    this.setState({
      file,
    });
    this.props.onChange(file);
  }

  handleAdd() {
    this.labelElement.click();
  }

  clear() {
    this.setState({ file: null });
    this.props.onChange(null);
  }

  render() {
    let content;
    let button;
    if (!this.state.file) {
      content = <span className="attachment-placeholder">Selecionar arquivo</span>;
      button = (
        <div className="add-button">
          <img src="/icons/function-icons/add.svg" alt="+" onClick={this.handleAdd} />
        </div>
      );
    } else {
      content = <span className="filename">{this.state.file.name}</span>;
      button = (
        <span className="button remove" onClick={this.clear}>
          x
        </span>
      );
    }
    return (
      <div className="file-selector">
        <label htmlFor={this.uniqueId} ref={label => (this.labelElement = label)}>
          {content}
        </label>
        {button}
        <input id={this.uniqueId} type="file" onChange={this.handleChange} />
      </div>
    );
  }
}

export default FileSelector;
