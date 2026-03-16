import React from "react";
import Marquee from "react-fast-marquee";
import "../css/moving_home_strip.css";

export default function MovingHomeStrip() {
  const resources = [
    "Health",
    "Food",
    "Education",
    "Youth Services",
    "Legal Aid",
    "Employment",
    "Mental Health",
    "Senior Services",
    "Community Events",
  ];

  return (
    <div className="ticker">
      <Marquee speed = {80} pauseOnHover = {true}>
        {resources.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}