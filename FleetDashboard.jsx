// ========================================
// FleetDashboard.jsx
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

      {/* ===================================== */}
      {/* MAP AREA */}
      {/* ===================================== */}
      <div
        style={{

          flex: 1,

          position: "relative",
        }}
      >

        <FleetMapCanvas
          ros={ros}
          robots={robots}
          setRobots={setRobots}
        />
      </div>

      {/* ===================================== */}
      {/* RIGHT SIDEBAR */}
      {/* ===================================== */}
      <div
        style={{

          width: "420px",

          height: "100%",

          display: "flex",

          flexDirection: "column",

          gap: "14px",

          padding: "14px",

          background: "#111827",

          borderLeft:
            "1px solid #1f2937",

          overflowY: "auto",
        }}
      >

        {/* ===================================== */}
        {/* ROBOT INFO */}
        {/* ===================================== */}
        <div
          style={{

            background: "#1f2937",

            borderRadius: "14px",

            overflow: "hidden",
          }}
        >

          <RobotInfoPanel
            robots={robots}
          />
        </div>

        {/* ===================================== */}
        {/* FLEET STATUS */}
        {/* ===================================== */}
        <div
          style={{

            background: "#1f2937",

            borderRadius: "14px",

            overflow: "hidden",
          }}
        >

          <FleetStatusPanel
            robots={robots}
          />
        </div>

        {/* ===================================== */}
        {/* CONTROL PANEL */}
        {/* ===================================== */}
        <div
          style={{

            flex: 1,

            background: "#1f2937",

            borderRadius: "14px",

            overflow: "hidden",
          }}
        >

          <RobotControlPanel
            ros={ros}
            robots={robots}
          />
        </div>

      </div>

    </div>
  );
}
