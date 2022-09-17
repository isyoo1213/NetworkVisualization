import './App.css';

import { useCallback, useEffect, useState, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import data from "./data.json";
import * as d3 from "d3";

const App = () => {

  const fgRef = useRef();
  const [flag, setFlag] = useState(true);
  const drawNormalNode = useCallback((node) => {
    const sprite = new SpriteText(node.label ? node.label : node.id, 5);
    sprite.color = "#2E2E2E";
    sprite.backgroundColor = "transparent";
    sprite.padding = [8, 4];
    sprite.textHeight = 2;
    sprite.borderRadius = 10;
    sprite.fontWeight = 700;

    return sprite;
  }, []);

  const drawCategoryNode = useCallback((node) => {
    const sprite = new SpriteText(node.label ? node.label : node.id, 1);
    sprite.color = "#fff";
    sprite.backgroundColor = "#65B5FF";
    sprite.borderColor = "#65B5FF";
    sprite.borderWidth = 0;
    sprite.padding = [12, 5];
    sprite.textHeight = 5;
    sprite.fontWeight = 700;
    sprite.borderRadius = 12;
    return sprite;
  }, []);

  const nodeThreeObject = useCallback(
    (node) => {
      if (node.type === "Category") {
        return drawCategoryNode(node);
      }
      return drawNormalNode(node);
    },
    [drawCategoryNode, drawNormalNode]
  );
  useEffect(() => {
    fgRef.current.d3Force("link").distance((link) => {
      return link.distance ? link.distance * 10 : 60;
    });
  }, []);

  const handleClick = useCallback(
    (node) => {
      d3.selectAll("#node-info-container").remove();
      // Aim at node from outside it
      const distance = 200;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
      setFlag(false);
    },
    [fgRef, flag]
  );

  const handleBackgroundClick = useCallback(() => {
    if (!flag) {
      fgRef.current.cameraPosition({ x: -200, y: -200, z: -200 }, 0, 3000);
      setFlag(true);
      d3.selectAll("#node-info-container").remove();
    } else {
      return;
    }
  }, [fgRef, flag]);

  return (
    <ForceGraph3D
      ref={fgRef}
      backgroundColor="#fff"
      graphData={data}
      nodeAutoColorBy="group"
      nodeThreeObject={nodeThreeObject}
      nodeVal={(node) => node.size}
      linkColor={"color"}
      linkOpacity={1}
      linkWidth={"width"}
      onNodeClick={handleClick}
      onBackgroundClick={handleBackgroundClick}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      }}
    />
  );
  
}

export default App;
