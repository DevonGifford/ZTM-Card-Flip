/* eslint-disable @next/next/no-img-element */
import React from "react";

function Logo( size?: number) {
  
  const logoStyle = {
    display: "flex",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  };

  const textStyle = {
    fontWeight: "bold",
    fontSize: "1.2em",
    marginLeft: "-4px",
  };

  const textStyleTwo = {
    fontWeight: "bold",
    fontSize: "1.3em",
    marginLeft: "-4px",
    fontStyle: "italic",
    transform: "rotate(-20deg) translateX(-30px) translateY(-5px)",
    display: "inline-block",
    color: "#ff165a",
  };

  const imageStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "10px",
  };

  const textContainer = {
    display: "flex",
    flexDirection: "row" as "row",
    transform: "translateX(-6px) translateY(1px)",
  };

  return (
    <div style={logoStyle}>
      <img
        src="https://avatars.githubusercontent.com/u/35373879?s=280&v=4"
        alt="test"
        style={imageStyle}
      />
      <div style={textContainer}>
        <span style={textStyle}>Ready</span>
        <span style={textStyleTwo}>Docs</span>
      </div>
    </div>
  );
}

export default Logo;
