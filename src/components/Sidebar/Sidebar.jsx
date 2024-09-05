
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";
import logo from "../../assets/img/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faNotesMedical , faDatabase, faAsterisk, faMessage} from '@fortawesome/free-solid-svg-icons';

var ps;

function Sidebar(props) {
  console.log("Props in side", props);
  const location = useLocation();
  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <a
          
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a
          
          className="simple-text logo-normal"
        >
        ADMIN
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav className="flex flex-items">
          {props.routes.map((prop, key) => {
            return (
              <li
                className={
                  activeRoute(prop.path) + (prop.pro ? " active-pro" : "") 
                }
                key={key}
              >
                <NavLink to={prop.layout + prop.path} className="nav-NavLink">
                  <i className="text-center text-warning">
                      <FontAwesomeIcon icon={prop.icon} style={{ color: 'grey' }}/>
                  </i>
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
