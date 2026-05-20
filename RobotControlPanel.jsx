// ========================================
// RobotControlPanel.jsx
// ========================================

import { useEffect, useRef, useState } from "react";

import nipplejs from "nipplejs";

const ROSLIB = window.ROSLIB;

export default function RobotControlPanel({

  ros,
  robots,

}) {

  // =========================
  // SELECTED ROBOT
  // =========================
  const [selectedRobot, setSelectedRobot] =
    useState("");

  // =========================
  // SPEEDS
  // =========================
  const [linearSpeed, setLinearSpeed] =
    useState(0.5);

  const [angularSpeed, setAngularSpeed] =
    useState(1.0);

  // =========================
  // JOYSTICK CONTAINER
  // =========================
  const joystickRef = useRef(null);

  // =========================
  // CMD_VEL
  // =========================
  const cmdVelRef = useRef(null);

  // =========================
  // CREATE CMD_VEL TOPIC
  // =========================
  useEffect(() => {

    if (!ros) return;

    if (!selectedRobot) return;

    cmdVelRef.current =
      new ROSLIB.Topic({

        ros,

        name:
          `/${selectedRobot}/cmd_vel`,

        messageType:
          "geometry_msgs/Twist",
      });

  }, [ros, selectedRobot]);

  // =========================
  // SEND VELOCITY
  // =========================
  const sendVelocity = (

    linear,
    angular

  ) => {

    if (!cmdVelRef.current) {
      return;
    }

    const twist =
      new ROSLIB.Message({

        linear: {

          x: linear,
          y: 0,
          z: 0,
        },

        angular: {

          x: 0,
          y: 0,
          z: angular,
        },
      });

    cmdVelRef.current.publish(
      twist
    );
  };

  // =========================
  // STOP
  // =========================
  const stopRobot = () => {

    sendVelocity(0, 0);
  };

  // =========================
  // NIPPLE JOYSTICK
  // =========================
  useEffect(() => {

    if (!joystickRef.current) {
      return;
    }

    const manager =
      nipplejs.create({

        zone:
          joystickRef.current,

        mode: "static",

        position: {

          left: "50%",
          top: "50%",
        },

        color: "#3b82f6",

        size: 180,
      });

    // MOVE
    manager.on(
      "move",
      (evt, data) => {

        if (!data) return;

        const distance =
          data.distance || 0;

        const angle =
          data.angle.radian;

        // NORMALIZE
        const force =
          Math.min(
            distance / 75,
            1
          );

        // FORWARD/BACKWARD
        const linear =
          Math.sin(angle) *
          linearSpeed *
          force;

        // LEFT/RIGHT
        const angular =
          -Math.cos(angle) *
          angularSpeed *
          force;

        sendVelocity(
          linear,
          angular
        );
      }
    );

    // STOP
    manager.on(
      "end",
      () => {

        stopRobot();
      }
    );

    return () => {

      manager.destroy();
    };

  }, [

    linearSpeed,
    angularSpeed,
    selectedRobot,
  ]);

  // =========================
  // SPEED HELPERS
  // =========================
  const increaseLinear = () => {

    setLinearSpeed((prev) =>
      Math.min(prev + 0.1, 5)
    );
  };

  const decreaseLinear = () => {

    setLinearSpeed((prev) =>
      Math.max(prev - 0.1, 0.1)
    );
  };

  const increaseAngular = () => {

    setAngularSpeed((prev) =>
      Math.min(prev + 0.1, 5)
    );
  };

  const decreaseAngular = () => {

    setAngularSpeed((prev) =>
      Math.max(prev - 0.1, 0.1)
    );
  };

  return (
    <div
      style={{

        width: "340px",

        background: "#111827",

        borderLeft:
          "1px solid #1f2937",

        padding: "18px",

        color: "white",

        fontFamily: "sans-serif",

        display: "flex",

        flexDirection: "column",

        gap: "20px",
      }}
    >

      {/* TITLE */}
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Robot Control
      </h2>

      {/* SELECT ROBOT */}
      <div>

        <div
          style={{
            marginBottom: "10px",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          Select Robot
        </div>

        <select
          value={selectedRobot}
          onChange={(e) =>
            setSelectedRobot(
              e.target.value
            )
          }
          style={{

            width: "100%",

            padding: "12px",

            borderRadius: "12px",

            border:
              "1px solid #374151",

            background: "#1f2937",

            color: "white",

            outline: "none",
          }}
        >

          <option value="">
            Select Robot
          </option>

          {
            Object.keys(robots).map(
              (robotName) => (

                <option
                  key={robotName}
                  value={robotName}
                >
                  {robotName}
                </option>
              )
            )
          }
        </select>
      </div>

      {/* LINEAR SPEED */}
      <div>

        <div
          style={{
            marginBottom: "10px",
            color: "#9ca3af",
          }}
        >
          Linear Speed
        </div>

        <div
          style={speedContainer}
        >

          <button
            style={speedButton}
            onClick={
              decreaseLinear
            }
          >
            -
          </button>

          <div
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            {linearSpeed.toFixed(1)}
          </div>

          <button
            style={speedButton}
            onClick={
              increaseLinear
            }
          >
            +
          </button>
        </div>
      </div>

      {/* ANGULAR SPEED */}
      <div>

        <div
          style={{
            marginBottom: "10px",
            color: "#9ca3af",
          }}
        >
          Angular Speed
        </div>

        <div
          style={speedContainer}
        >

          <button
            style={speedButton}
            onClick={
              decreaseAngular
            }
          >
            -
          </button>

          <div
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            {angularSpeed.toFixed(1)}
          </div>

          <button
            style={speedButton}
            onClick={
              increaseAngular
            }
          >
            +
          </button>
        </div>
      </div>

      {/* JOYSTICK */}
      <div>

        <div
          style={{
            marginBottom: "12px",
            color: "#9ca3af",
          }}
        >
          Joystick
        </div>

        <div
          ref={joystickRef}
          style={{

            width: "220px",

            height: "220px",

            margin: "0 auto",

            position: "relative",

            borderRadius: "50%",

            background:
              "rgba(255,255,255,0.04)",

            border:
              "1px solid #374151",
          }}
        />
      </div>

      {/* STOP BUTTON */}
      <button
        onClick={stopRobot}
        style={{

          height: "60px",

          border: "none",

          borderRadius: "14px",

          background: "#dc2626",

          color: "white",

          fontSize: "18px",

          fontWeight: "bold",

          cursor: "pointer",
        }}
      >
        EMERGENCY STOP
      </button>

      {/* ROBOT INFO */}
      {
        selectedRobot &&
        robots[selectedRobot] && (

          <div
            style={{

              background: "#1f2937",

              border:
                "1px solid #374151",

              borderRadius: "14px",

              padding: "14px",
            }}
          >

            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              {selectedRobot}
            </div>

            <InfoRow
              label="Status"
              value={
                robots[
                  selectedRobot
                ].active
                  ? "ACTIVE"
                  : "OFFLINE"
              }
            />

            <InfoRow
              label="Battery"
              value={`${robots[selectedRobot].battery}%`}
            />

            <InfoRow
              label="Model"
              value={
                robots[
                  selectedRobot
                ].model
              }
            />
          </div>
        )
      }
    </div>
  );
}

// ========================================
// SPEED CONTAINER
// ========================================

const speedContainer = {

  display: "flex",

  alignItems: "center",

  gap: "10px",
};

// ========================================
// SPEED BUTTON
// ========================================

const speedButton = {

  width: "40px",

  height: "40px",

  border: "none",

  borderRadius: "10px",

  background: "#2563eb",

  color: "white",

  fontSize: "18px",

  cursor: "pointer",
};

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