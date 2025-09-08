import React, { EventHandler, MouseEventHandler } from "react";

const Button = ({ fn }: { fn: MouseEventHandler }) => {
  return <button onClick={fn} className=""></button>;
};

export default Button;
