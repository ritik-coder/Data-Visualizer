import React from "react";
import PropTypes from "prop-types";

const LinearGradient = (props) => {
  const { data } = props;
  const boxStyle = {
    width: 200,
  };

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${data.fromColor} , ${data.toColor})`,
    height: 20,
  };
  return (
    <div className="index">
      <h4>Data Range</h4>
      <div style={boxStyle} className="display-flex">
        <span>
          <b>{data.min}</b>{" "}
        </span>
        <span className="fill"></span>
        <span>
          <b>{data.max}</b>
        </span>
      </div>
      <div
        style={{ ...boxStyle, ...gradientStyle }}
        className="display-flex"
      ></div>
    </div>
  );
};

LinearGradient.propTypes = {
  data: PropTypes.object.isRequired,
};

export default LinearGradient;
