import React, { useCallback, useRef } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { DropdownMenu, MenuItem } from '../dropdownspot';

const Actions = ({ actions, value, onActionClick }) => {
  const dropdownEl = useRef(null);

  const handleActionClick = useCallback(
    (event, action) => {
      onActionClick(value, action);
      dropdownEl.current.toggleArrow(event);
    },
    [onActionClick, value]
  );

  return (
    <FormControl>
      <DropdownMenu
        triggerType="image"
        trigger="/icons/action-icons/down-button.svg"
        triggerUp="/icons/action-icons/up-button.svg"
        ref={dropdownEl}
      >
        {actions.map(action => {
          return (
            <MenuItem
              key={action}
              linkStyle="menu-item"
              text={action}
              name={action}
              onClick={event => handleActionClick(event, action)}
            />
          );
        })}
      </DropdownMenu>
    </FormControl>
  );
};

export default Actions;
