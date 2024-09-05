import React from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/Navbars/DemoNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";

var ps;

function Dashboard(props) {
  const [backgroundColor, setBackgroundColor] = React.useState("black");
  const [activeColor, setActiveColor] = React.useState("info");
  const mainPanel = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  }, []);

  React.useEffect(() => {
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }, [location]);

  const handleActiveClick = (color) => setActiveColor(color);
  const handleBgClick = (color) => setBackgroundColor(color);

  return (
    <div className="wrapper">
      <Sidebar
        {...props}
        routes={routes}
        bgColor={backgroundColor}
        activeColor={activeColor}
      />
      <div className="main-panel" ref={mainPanel}>
        <Header {...props} />
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Dashboard;
