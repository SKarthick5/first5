import FleetDashboard
from "./pages/FleetDashboard";

const ROSLIB = window.ROSLIB;

const ros =
  new ROSLIB.Ros({

    url:
      "ws://localhost:9090",
  });

export default function App() {

  return (
    <FleetDashboard ros={ros} />
  );
}