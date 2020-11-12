import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Tab from '../tab';

class TabsList extends React.Component {
  constructor(props) {
    const { selectedTab } = props;
    super(props);
    this.state = {
      selectedTab,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { handler } = this.props;
    this.setState({ selectedTab: event.target.value }, () => {
      const { selectedTab } = this.state;
      handler(selectedTab);
    });
  }

  render() {
    const { data, selectedTab } = this.props;
    return (
      <Row>
        <Col>
          <ul className="tab-list">
            {data.map(item => (
              <Tab
                className="icon"
                title={item.title}
                icon={item.icon}
                value={item.value}
                key={item.title}
                onChangeValue={this.handleChange}
                selectedTab={selectedTab}
              />
            ))}
          </ul>
        </Col>
      </Row>
    );
  }
}

export default TabsList;
