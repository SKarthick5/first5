// ========================================
// RobotInfoPanel.jsx
// ========================================

import { useState } from "react";

export default function RobotInfoPanel({
  robots,
}) {

  // OPEN ROBOT
  const [selectedRobot, setSelectedRobot] =
    useState(null);

  // TOGGLE
  const handleToggle = (robotName) => {

    // CLOSE SAME
    if (selectedRobot === robotName) {

      setSelectedRobot(null);

      return;
    }

    // OPEN NEW
    setSelectedRobot(robotName);
  };

  return (
    <div
      style={{
        width: "320px",
        height: "100%",
        background: "#111827",
        borderLeft: "1px solid #1f2937",
        overflowY: "auto",
        padding: "16px",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >

      {/* TITLE */}
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Fleet Robots
      </h2>

      {
        Object.entries(robots).map(
          ([name, robot]) => {

            const isOpen =
              selectedRobot === name;

            return (
              <div
                key={name}
                style={{
                  marginBottom: "12px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border:
                    "1px solid #374151",
                  background: "#1f2937",
                }}
              >

                {/* HEADER */}
                <div
                  onClick={() =>
                    handleToggle(name)
                  }
                  style={{
                    padding: "14px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >

                  {/* LEFT */}
                  <div>

                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {name}
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        marginTop: "4px",
                        color:
                          robot.active
                            ? "#22c55e"
                            : "#ef4444",
                      }}
                    >
                      {
                        robot.active
                          ? "ACTIVE"
                          : "OFFLINE"
                      }
                    </div>
                  </div>

                  {/* BATTERY */}
                  <div
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    🔋 {robot.battery}%
                  </div>
                </div>

                {/* DETAILS */}
                {
                  isOpen && (

                    <div
                      style={{
                        background:
                          "#0f172a",
                        padding: "14px",
                        borderTop:
                          "1px solid #374151",
                      }}
                    >

                      <InfoRow
                        label="Model"
                        value={robot.model}
                      />

                      <InfoRow
                        label="Position X"
                        value={robot.x.toFixed(2)}
                      />

                      <InfoRow
                        label="Position Y"
                        value={robot.y.toFixed(2)}
                      />

                      <InfoRow
                        label="Theta"
                        value={robot.theta.toFixed(2)}
                      />

                      <InfoRow
                        label="Battery"
                        value={`${robot.battery}%`}
                      />

                      <InfoRow
                        label="Status"
                        value={
                          robot.active
                            ? "ACTIVE"
                            : "OFFLINE"
                        }
                      />
                    </div>
                  )
                }
              </div>
            );
          }
        )
      }
    </div>
  );
}

// ========================================
// INFO ROW
// ========================================

function InfoRow({
  label,
  value,
}) {

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        marginBottom: "10px",
        fontSize: "14px",
      }}
    >

      <span
        style={{
          color: "#9ca3af",
        }}
      >
        {label}
      </span>

      <span>
        {value}
      </span>
    </div>
  );
}