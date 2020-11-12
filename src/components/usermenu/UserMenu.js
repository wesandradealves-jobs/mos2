import React from 'react';

const UserMenu = props => (
  <div className="wrapper-usermenu dropdown-menu2">
    <label className="user-menu" htmlFor="dropdown-menu">
      <figure className="image">
        <span className="user-settings-avatar-name">JJ</span>
      </figure>
      <span className="name">{props.fullName}</span>
    </label>
    <input id="dropdown-menu" className="open" type="checkbox" aria-hidden="true" hidden />
    <label htmlFor="dropdown-menu" className="overlay" />
    <div className="inner">
      <div className="header">
        <span className="title">{props.fullName}</span>
        <span className="subtitle">{props.department}</span>
      </div>
      <div className="item">Configurações</div>
      <div className="item">Sair</div>
    </div>
  </div>
);

export default UserMenu;
