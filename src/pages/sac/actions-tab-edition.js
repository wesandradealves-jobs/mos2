import React, {useState} from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import { DropdownMenu, MenuItem } from '../../components/dropdownspot';

export default class Actions extends React.Component {

  

  constructor(props) {
    super(props)
    this.state = {
      selectedOption: "", 
      open: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    value: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired
  };

  

  async handleChange(event) {
    const value = event.target.innerHTML;
    const ticketId = event.target.id;
    this.props.onActionClick(value, ticketId);
  }
  

  render() {

    const ticketId = this.props.value
    const { value, index, change, actions } = this.props;
    //const actions = ["Editar", "Imprimir"]; //adicionar "Compartilhar" depois

    return (

      <FormControl>

        <DropdownMenu style='action-menu' position='left' triggerType='image' trigger='/icons/action-icons/down-button.svg' triggerUp='/icons/action-icons/up-button.svg'>
          {actions.map((action, index) => {
            return (
              <MenuItem linkStyle="menu-item" text={action} name={ticketId} onClick={this.handleChange} />
            )
          })}
        </DropdownMenu>


      </FormControl>
    );
  }
}

