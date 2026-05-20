// ========================================
// FleetMapCanvas.jsx
// ========================================

import { useEffect, useRef } from "react";

const ROSLIB = window.ROSLIB;

export default function FleetMapCanvas({

  ros,
  robots,
  setRobots,

}) {

  const canvasRef = useRef(null);

  // MAP CACHE
  const mapImageRef = useRef(null);

  // MAP INFO
  const mapInfoRef = useRef(null);

  // ROBOT TOPICS
  const robotSubscribersRef =
    useRef({});

  // CAMERA
  const cameraRef = useRef({

    scale: 1,

    offsetX: 0,
    offsetY: 0,

    isDragging: false,

    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {

    if (!ros) return;

    const canvas =
      canvasRef.current;

    const ctx =
      canvas.getContext("2d");

    ctx.imageSmoothingEnabled =
      false;

    // OFFSCREEN MAP
    const mapCanvas =
      document.createElement(
        "canvas"
      );

    const mapCtx =
      mapCanvas.getContext("2d");

    // ======================
    // RESIZE
    // ======================
    const resizeCanvas = () => {

      const parent =
        canvas.parentElement;

      canvas.width =
        parent.clientWidth;

      canvas.height =
        parent.clientHeight;

      drawScene();
    };

    // ======================
    // WORLD → MAP
    // ======================
    const worldToMap = (
      wx,
      wy
    ) => {

      const mapInfo =
        mapInfoRef.current;

      if (!mapInfo) {

        return {
          x: 0,
          y: 0,
        };
      }

      const resolution =
        mapInfo.resolution;

      const originX =
        mapInfo.origin.position.x;

      const originY =
        mapInfo.origin.position.y;

      const mx =
        (wx - originX) /
        resolution;

      const my =
        mapInfo.height -
        (wy - originY) /
        resolution;

      return {
        x: mx,
        y: my,
      };
    };

    // ======================
    // GRID
    // ======================
    const drawGrid = () => {

      const gridSize = 50;

      ctx.strokeStyle =
        "rgba(255,255,255,0.04)";

      ctx.lineWidth = 1;

      for (
        let x = 0;
        x < canvas.width;
        x += gridSize
      ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
          x,
          canvas.height
        );

        ctx.stroke();
      }

      for (
        let y = 0;
        y < canvas.height;
        y += gridSize
      ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
          canvas.width,
          y
        );

        ctx.stroke();
      }
    };

    // ======================
    // DRAW ROBOTS
    // ======================
    const drawRobots = () => {

      const camera =
        cameraRef.current;

      Object.entries(robots).forEach(
        ([name, robot]) => {

          const pos =
            worldToMap(
              robot.x,
              robot.y
            );

          ctx.save();

          ctx.translate(
            camera.offsetX,
            camera.offsetY
          );

          ctx.scale(
            camera.scale,
            camera.scale
          );

          ctx.translate(
            pos.x,
            pos.y
          );

          ctx.rotate(
            -robot.theta
          );

          // ACTIVE COLOR
          ctx.fillStyle =
            robot.active
              ? "#22c55e"
              : "#ef4444";

          // BODY
          ctx.beginPath();

          ctx.arc(
            0,
            0,
            10,
            0,
            Math.PI * 2
          );

          ctx.fill();

          // OUTLINE
          ctx.strokeStyle =
            "#ffffff";

          ctx.lineWidth =
            2 / camera.scale;

          ctx.stroke();

          // DIRECTION
          ctx.beginPath();

          ctx.moveTo(0, 0);

          ctx.lineTo(18, 0);

          ctx.stroke();

          // RESET
          ctx.rotate(robot.theta);

          // FIX TEXT SIZE
          ctx.scale(
            1 / camera.scale,
            1 / camera.scale
          );

          ctx.fillStyle =
            "#ffffff";

          ctx.font =
            "14px sans-serif";

          ctx.fillText(
            name,
            15,
            -15
          );

          ctx.restore();
        }
      );
    };

    // ======================
    // DRAW SCENE
    // ======================
    const drawScene = () => {

      const camera =
        cameraRef.current;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // BACKGROUND
      ctx.fillStyle =
        "#111827";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // GRID
      drawGrid();

      // MAP
      if (mapImageRef.current) {

        ctx.save();

        ctx.translate(
          camera.offsetX,
          camera.offsetY
        );

        ctx.scale(
          camera.scale,
          camera.scale
        );

        ctx.drawImage(
          mapImageRef.current,
          0,
          0
        );

        ctx.restore();
      }

      // ROBOTS
      drawRobots();
    };

    // ======================
    // RENDER MAP
    // ======================
    const renderMap = (
      map
    ) => {

      mapInfoRef.current =
        map.info;

      const mapWidth =
        map.info.width;

      const mapHeight =
        map.info.height;

      mapCanvas.width =
        mapWidth;

      mapCanvas.height =
        mapHeight;

      const imageData =
        mapCtx.createImageData(
          mapWidth,
          mapHeight
        );

      for (
        let y = 0;
        y < mapHeight;
        y++
      ) {

        for (
          let x = 0;
          x < mapWidth;
          x++
        ) {

          const index =
            y * mapWidth + x;

          const value =
            map.data[index];

          let r, g, b;

          // FREE
          if (value === 0) {

            r = 245;
            g = 245;
            b = 245;
          }

          // OCCUPIED
          else if (
            value === 100
          ) {

            r = 20;
            g = 20;
            b = 20;
          }

          // UNKNOWN
          else {

            r = 100;
            g = 100;
            b = 100;
          }

          const flippedY =
            mapHeight -
            y -
            1;

          const pixel =
            (
              flippedY *
                mapWidth +
              x
            ) * 4;

          imageData.data[
            pixel + 0
          ] = r;

          imageData.data[
            pixel + 1
          ] = g;

          imageData.data[
            pixel + 2
          ] = b;

          imageData.data[
            pixel + 3
          ] = 255;
        }
      }

      mapCtx.putImageData(
        imageData,
        0,
        0
      );

      mapImageRef.current =
        mapCanvas;

      // INITIAL FIT
      const camera =
        cameraRef.current;

      const scale =
        Math.min(
          canvas.width /
            mapWidth,

          canvas.height /
            mapHeight
        ) * 0.9;

      camera.scale = scale;

      camera.offsetX =
        (
          canvas.width -
          mapWidth * scale
        ) / 2;

      camera.offsetY =
        (
          canvas.height -
          mapHeight * scale
        ) / 2;

      drawScene();
    };

    // ======================
    // CREATE ROBOT
    // ======================
    const createRobotSubscription = (

      robotName,
      odomTopic

    ) => {

      // EXISTS
      if (
        robotSubscribersRef.current[
          robotName
        ]
      ) {
        return;
      }

      // CREATE ROBOT
      setRobots((prev) => ({

        ...prev,

        [robotName]: {

          x: 0,
          y: 0,
          theta: 0,

          battery:
            Math.floor(
              Math.random() *
                100
            ),

          model: "AMR",

          active: false,

          lastSeen:
            Date.now(),
        },
      }));

      // SUBSCRIBE
      const topic =
        new ROSLIB.Topic({

          ros,

          name: odomTopic,

          messageType:
            "nav_msgs/Odometry",
        });

      topic.subscribe((msg) => {

        const position =
          msg.pose.pose.position;

        const orientation =
          msg.pose.pose.orientation;

        // QUATERNION → YAW
        const siny =
          2 *
          (
            orientation.w *
              orientation.z +
            orientation.x *
              orientation.y
          );

        const cosy =
          1 -
          2 *
          (
            orientation.y *
              orientation.y +
            orientation.z *
              orientation.z
          );

        const yaw =
          Math.atan2(
            siny,
            cosy
          );

        // UPDATE STATE
        const linearX =
     msg.twist.twist.linear.x;

    const angularZ =
    msg.twist.twist.angular.z;

    const isActive =

    Math.abs(linearX) > 0.01 ||

    Math.abs(angularZ) > 0.01;
        setRobots((prev) => ({

          ...prev,

          [robotName]: {

            ...prev[robotName],

            x: position.x,

            y: position.y,

            theta: yaw,

            active: isActive,

            lastSeen:
              Date.now(),
          },
        }));

        drawScene();
      });

      robotSubscribersRef.current[
        robotName
      ] = topic;
    };

    // ======================
    // DISCOVER ROBOTS
    // ======================
    const discoverRobots = () => {

      ros.getTopics((topics) => {

        const odomTopics =
          topics.topics.filter(
            (topic) =>
              topic.endsWith(
                "/odom"
              )
          );

        odomTopics.forEach(
          (topicName) => {

            const robotName =
              topicName.split(
                "/"
              )[1];

            createRobotSubscription(

              robotName,
              topicName

            );
          }
        );
      });
    };

    // ======================
    // OFFLINE CHECK
    // ======================
    const offlineTimer =
      setInterval(() => {

        setRobots((prev) => {

          const updated = {
            ...prev,
          };

          Object.keys(
            updated
          ).forEach(
            (robotName) => {

              updated[
                robotName
              ].active =
                Date.now() -
                  updated[
                    robotName
                  ].lastSeen <
                3000;
            }
          );

          return updated;
        });

      }, 1000);

    // ======================
    // MAP TOPIC
    // ======================
    const mapTopic =
      new ROSLIB.Topic({

        ros,

        name: "/map",

        messageType:
          "nav_msgs/OccupancyGrid",
      });

    mapTopic.subscribe(
      renderMap
    );

    // INITIAL DISCOVERY
    discoverRobots();

    // REDISCOVER
    const discoverTimer =
      setInterval(
        discoverRobots,
        5000
      );

    // ======================
    // ZOOM
    // ======================
    const handleWheel = (
      e
    ) => {

      e.preventDefault();

      const camera =
        cameraRef.current;

      const zoom =
        e.deltaY < 0
          ? 1.1
          : 0.9;

      const mouseX =
        e.offsetX;

      const mouseY =
        e.offsetY;

      const worldX =
        (
          mouseX -
          camera.offsetX
        ) / camera.scale;

      const worldY =
        (
          mouseY -
          camera.offsetY
        ) / camera.scale;

      camera.scale *= zoom;

      camera.scale =
        Math.max(
          0.2,
          Math.min(
            camera.scale,
            20
          )
        );

      camera.offsetX =
        mouseX -
        worldX *
          camera.scale;

      camera.offsetY =
        mouseY -
        worldY *
          camera.scale;

      drawScene();
    };

    // ======================
    // PAN START
    // ======================
    const handleMouseDown = (
      e
    ) => {

      const camera =
        cameraRef.current;

      camera.isDragging =
        true;

      camera.lastX =
        e.clientX;

      camera.lastY =
        e.clientY;

      canvas.style.cursor =
        "grabbing";
    };

    // ======================
    // PAN MOVE
    // ======================
    const handleMouseMove = (
      e
    ) => {

      const camera =
        cameraRef.current;

      if (
        !camera.isDragging
      ) {
        return;
      }

      const dx =
        e.clientX -
        camera.lastX;

      const dy =
        e.clientY -
        camera.lastY;

      camera.offsetX += dx;

      camera.offsetY += dy;

      camera.lastX =
        e.clientX;

      camera.lastY =
        e.clientY;

      drawScene();
    };

    // ======================
    // PAN END
    // ======================
    const handleMouseUp = () => {

      cameraRef.current.isDragging =
        false;

      canvas.style.cursor =
        "grab";
    };

    // EVENTS
    canvas.addEventListener(
      "wheel",
      handleWheel
    );

    canvas.addEventListener(
      "mousedown",
      handleMouseDown
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    canvas.style.cursor =
      "grab";

    resizeCanvas();

    // ======================
    // REDRAW ON STATE CHANGE
    // ======================
    drawScene();

    // CLEANUP
    return () => {

      clearInterval(
        offlineTimer
      );

      clearInterval(
        discoverTimer
      );

      mapTopic.unsubscribe();

      Object.values(
        robotSubscribersRef.current
      ).forEach((topic) => {

        topic.unsubscribe();
      });

      canvas.removeEventListener(
        "wheel",
        handleWheel
      );

      canvas.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };

  }, [ros, robots]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}