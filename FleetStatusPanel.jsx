// ========================================
// FleetStatusPanel.jsx
// ========================================

import { useMemo, useState } from "react";

export default function FleetStatusPanel({

  robots,

}) {

  // =====================================
  // DROPDOWN STATE
  // =====================================

  const [openType, setOpenType] =
    useState(null);

  // =====================================
  // ROBOT ARRAY
  // =====================================

  const robotEntries = useMemo(() => {

    return Object.entries(
      robots || {}
    );

  }, [robots]);

  // =====================================
  // ACTIVE / INACTIVE
  // =====================================

  const activeRobots =
    robotEntries.filter(

      ([_, robot]) => robot.active
    );

  const inactiveRobots =
    robotEntries.filter(

      ([_, robot]) => !robot.active
    );

  const total =
    robotEntries.length || 1;

  const activePercent =
    (
      activeRobots.length / total
    ) * 100;

  const inactivePercent =
    (
      inactiveRobots.length / total
    ) * 100;

  // =====================================
  // DONUT CHART
  // =====================================

  const radius = 60;

  const circumference =
    2 * Math.PI * radius;

  const activeStroke =
    (activePercent / 100) *
    circumference;

  return (

    <div
      style={{

        width: "100%",

        background: "#111827",

        borderRadius: "20px",

        padding: "20px",

        color: "white",

        display: "flex",

        flexDirection: "column",

        gap: "20px",

        boxSizing: "border-box",

        boxShadow:
          "0 0 20px rgba(0,0,0,0.3)",
      }}
    >

      {/* ================================= */}
      {/* TITLE */}
      {/* ================================= */}

      <div
        style={{

          fontSize: "20px",

          fontWeight: "bold",
        }}
      >
        Fleet Status
      </div>

      {/* ================================= */}
      {/* DONUT */}
      {/* ================================= */}

      <div
        style={{

          display: "flex",

          justifyContent: "center",

          alignItems: "center",
        }}
      >

        <svg
          width="180"
          height="180"
        >

          {/* BG */}

          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#374151"
            strokeWidth="18"
            fill="none"
          />

          {/* ACTIVE */}

          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#10B981"
            strokeWidth="18"
            fill="none"

            strokeDasharray={`
              ${activeStroke}
              ${circumference}
            `}

            transform="
              rotate(-90 90 90)
            "

            strokeLinecap="round"
          />

          {/* CENTER TEXT */}

          <text
            x="90"
            y="85"
            textAnchor="middle"
            fill="white"
            fontSize="28"
            fontWeight="bold"
          >
            {robotEntries.length}
          </text>

          <text
            x="90"
            y="110"
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="14"
          >
            Robots
          </text>

        </svg>

      </div>

      {/* ================================= */}
      {/* ACTIVE CARD */}
      {/* ================================= */}

      <div
        style={{

          background: "#1F2937",

          borderRadius: "14px",

          padding: "14px",

          cursor: "pointer",
        }}

        onClick={() =>
          setOpenType(

            openType === "active"
              ? null
              : "active"
          )
        }
      >

        <div
          style={{

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",
          }}
        >

          <div>

            <div
              style={{

                fontWeight: "bold",

                color: "#10B981",
              }}
            >
              Active Robots
            </div>

            <div
              style={{

                fontSize: "13px",

                color: "#9CA3AF",
              }}
            >
              {activePercent.toFixed(0)}%
            </div>

          </div>

          <div
            style={{

              fontSize: "28px",

              fontWeight: "bold",

              color: "#10B981",
            }}
          >
            {activeRobots.length}
          </div>

        </div>

        {/* DROPDOWN */}

        {openType === "active" && (

          <div
            style={{

              marginTop: "12px",

              display: "flex",

              flexDirection: "column",

              gap: "8px",
            }}
          >

            {activeRobots.map(

              ([name, robot]) => (

                <div
                  key={name}

                  style={{

                    background:
                      "#374151",

                    padding: "10px",

                    borderRadius:
                      "10px",

                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems: "center",
                  }}
                >

                  <span>
                    {name}
                  </span>

                  <span
                    style={{

                      color: "#10B981",

                      fontSize: "12px",
                    }}
                  >
                    ACTIVE
                  </span>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* ================================= */}
      {/* INACTIVE CARD */}
      {/* ================================= */}

      <div
        style={{

          background: "#1F2937",

          borderRadius: "14px",

          padding: "14px",

          cursor: "pointer",
        }}

        onClick={() =>
          setOpenType(

            openType === "inactive"
              ? null
              : "inactive"
          )
        }
      >

        <div
          style={{

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",
          }}
        >

          <div>

            <div
              style={{

                fontWeight: "bold",

                color: "#EF4444",
              }}
            >
              Inactive Robots
            </div>

            <div
              style={{

                fontSize: "13px",

                color: "#9CA3AF",
              }}
            >
              {inactivePercent.toFixed(0)}%
            </div>

          </div>

          <div
            style={{

              fontSize: "28px",

              fontWeight: "bold",

              color: "#EF4444",
            }}
          >
            {inactiveRobots.length}
          </div>

        </div>

        {/* DROPDOWN */}

        {openType === "inactive" && (

          <div
            style={{

              marginTop: "12px",

              display: "flex",

              flexDirection: "column",

              gap: "8px",
            }}
          >

            {inactiveRobots.map(

              ([name, robot]) => (

                <div
                  key={name}

                  style={{

                    background:
                      "#374151",

                    padding: "10px",

                    borderRadius:
                      "10px",

                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems: "center",
                  }}
                >

                  <span>
                    {name}
                  </span>

                  <span
                    style={{

                      color: "#EF4444",

                      fontSize: "12px",
                    }}
                  >
                    INACTIVE
                  </span>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}
