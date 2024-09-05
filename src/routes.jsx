import Dashboard from "./views/ReadmissionDashboard";
import PatientDetails from "./views/PatientDetails/PatientDetails";
import Analytics from "./views/Analytics";
import RiskFactors from "./views/RiskFactors";
import ReadmissionRiskTable from "./views/Notifications";
import RiskPrediction from "./views/RiskPrediction";
import { faDashboard, faNotesMedical , faDatabase, faAsterisk, faMessage, faAddressBook} from '@fortawesome/free-solid-svg-icons';

const routes = [
  {
    path: "/readmission-dashboard",
    name: "Dashboard",
    icon: faDashboard,
    element: <Dashboard />,
    layout: "/admin"
  },
  {
    path: "/patient-details",
    name: "Patient Details",
    icon: faNotesMedical,
    element: <PatientDetails />,
    layout: "/admin"
  },
  {
    path: "/analytics",
    name: "Analytics",
    icon: faDatabase,
    element: <Analytics />,
    layout: "/admin"
  },
  {
    path: "/risk-factors",
    name: "Risk Factors",
    icon: faAsterisk,
    element: <RiskFactors />,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: faMessage,
    element: <ReadmissionRiskTable />,
    layout: "/admin"
  },
  {
    path: "/risk-prediction",
    name:"risk-prediction",
    icon: faAddressBook,
    element: <RiskPrediction/>,
    layout: "/admin"

  }
];

export default routes;
