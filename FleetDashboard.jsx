// ========================================
// UPDATE FleetDashboard.jsx
// ========================================

import { useState } from "react";

import FleetMapCanvas from "../components/FleetMapCanvas";
import RobotInfoPanel from "../components/RobotInfoPanel";
import RobotControlPanel from "../components/RobotControlPanel";
import FleetStatusPanel from "../components/FleetStatusPanel";

export default function FleetDashboard({ ros }) {

  const [robots, setRobots] =
    useState({});

  return (
    <div
      style={{

        width: "100vw",

        height: "100vh",

        display: "flex",

        overflow: "hidden",

        background: "#0f172a",
      }}
    >

      {/* LEFT PANEL */}
      <RobotInfoPanel
        robots={robots}
      />
        <FleetStatusPanel
  robots={robots}
/>
      {/* MAP */}
      <div
        style={{
          flex: 1,
        }}
      >
        <FleetMapCanvas
          ros={ros}
          robots={robots}
          setRobots={setRobots}
        />
      </div>

      {/* RIGHT PANEL */}
      <RobotControlPanel
        ros={ros}
        robots={robots}
      />
    </div>
  );
}