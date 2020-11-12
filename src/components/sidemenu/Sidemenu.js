import React from 'react';
import { Link } from 'react-router-dom';
import SidemenuIcons from './SidemenuIcons';

class Sidemenu extends React.Component {
  getImage(iconName, caption) {
    const icon = SidemenuIcons[iconName];

    return <img src={icon} alt={caption} />;
  }

  render() {
    return (
      <aside className="wrapper-sidemenu">
        <ul className="side-menu">
          <li className="list">
            <a href="." className="link">
              <i className="icon">{this.getImage('logo', 'spot-logo')}</i>
            </a>
          </li>
                    
          <li className="list">
            <a href="." className="link">
              <strong className="section-title">InMall View</strong>
              <i className="icon">{this.getImage('inmall', 'inmall-logo')}</i>
            </a>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Customer View</strong>

              <i className="icon">{this.getImage('customer', 'customer-view-logo')}</i>
            </a>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Instore View</strong>
              <i className="icon">{this.getImage('instoreview', 'instore-view-logo')}</i>
            </a>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Flash</strong>
              <i className="icon">{this.getImage('flash', 'flash-logo')}</i>
            </a>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Campanhas</strong>
              <i className="icon">{this.getImage('campaigns', 'campaigns-logo')}</i>
            </a>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Promoções</strong>
              <i className="icon">{this.getImage('promos', 'promos-logo')}</i>
            </a>
          </li>

          <li className="list">
            <Link to="/sac" className="link">
              <strong className="section-title">SAC</strong>
              <i className="icon">{this.getImage('sac', 'sac-logo')}</i>
            </Link>
          </li>

          <li className="list">
            <Link to="/emprestimo" className="link">
              <strong className="section-title">Emprestimo</strong>
              <i className="icon">{this.getImage('babycare', 'babycare-logo')}</i>
            </Link>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Sala VIP</strong>
              <i className="icon">{this.getImage('viplounge', 'vip-lounge-logo')}</i>
            </a>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Transações</strong>
              <i className="icon">{this.getImage('coupons', 'coupons-logo')}</i>
            </a>
          </li>

          <li className="list">
            <a href="." className="link">
              <strong className="section-title">Configurações</strong>
              <i className="icon">{this.getImage('settings', 'settings-logo')}</i>
            </a>
          </li>
          <footer className="footer">
            <div className="_left">v. 2.0.0</div>
            <div className="_right">
              <img alt="mall-logo" src="" />
            </div>
          </footer>
        </ul>
      </aside>
    );
  }
}

export default Sidemenu;
