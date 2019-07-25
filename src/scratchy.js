import React from "react";
import imageSource from "./smile.jpg";
import "./App.css";
import ScratchCard from "./scratchCard";
import { Modal, colors } from "@anarock/pebble";
import Scratch from "./scratchy";

const noop = o => o;

class ScratchOff extends React.PureComponent {
  static defaultProps = {
    onReveal: noop
  };

  constructor(props) {
    super(props);
    this.isDrawing = false;
    this.lastPoint = null;
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  componentDidMount() {
    const canvas = this.canvas;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    canvas.addEventListener("mousedown", this.touchStart);
    canvas.addEventListener("touchstart", this.touchStart);
    canvas.addEventListener("mousemove", this.touchMove);
    canvas.addEventListener("touchmove", this.touchMove);
    canvas.addEventListener("mouseup", this.touchEnd);
    canvas.addEventListener("touchend", this.touchEnd);

    this.ctx = canvas.getContext("2d");

    this.brush = new Image();
    this.brush.src = require("./brush.png");

    this.cover = new Image();
    this.cover.src = require("./smile.jpg");
    this.cover.onload = () =>
      {!this.props.scratchable && this.ctx.drawImage(this.cover, 0, 0, canvas.width, canvas.height);}
  }

  componentWillUnmount() {
    const canvas = this.canvas;
    canvas.removeEventListener("mousedown", this.touchStart);
    canvas.removeEventListener("touchstart", this.touchStart);
    canvas.removeEventListener("mousemove", this.touchMove);
    canvas.removeEventListener("touchmove", this.touchMove);
    canvas.removeEventListener("mouseup", this.touchEnd);
    canvas.removeEventListener("touchend", this.touchEnd);
  }

  getPosition(event) {
    let target = this.canvas;
    let offsetX = 0;
    let offsetY = 0;

    if (target.offsetParent !== undefined) {
      while ((target = target.offsetParent)) {
        offsetX += target.offsetLeft;
        offsetY += target.offsetTop;
      }
    }

    const x = (event.pageX || event.touches[0].clientX) - offsetX;
    const y = (event.pageY || event.touches[0].clientY) - offsetY;
    return { x, y };
  }

  touchStart(event) {
    this.isDrawing = true;
    this.lastPoint = this.getPosition(event);
    this.ctx.globalCompositeOperation = "destination-out";
  }

  touchMove(event) {
    if (!this.isDrawing) return;
    event.preventDefault();

    const ctx = this.ctx;
    const a = this.lastPoint;
    const b = this.getPosition(event);
    const dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    const angle = Math.atan2(b.x - a.x, b.y - a.y);
    const offsetX = this.brush.width / 2;
    const offsetY = this.brush.height / 2;

    for (let x, y, i = 0; i < dist; i++) {
      x = a.x + Math.sin(angle) * i - offsetX;
      y = a.y + Math.cos(angle) * i - offsetY;
      ctx.drawImage(this.brush, x, y);
    }

    this.lastPoint = b;
  }

  touchEnd(event) {
    this.isDrawing = false;
  }

  render() {
    return (
      <div
        style={{
          position: "relative",
          width: this.props.width || 400,
          height: this.props.height || 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <canvas
          style={{
            position: "absolute",
            zIndex: 2,
            width: "100%",
            height: "100%"
          }}
          ref={el => (this.canvas = el)}
        />
        <div>{this.props.children}</div>
      </div>
    );
  }
}

const secret = Math.random()
  .toString(16)
  .slice(2, 7)
  .toUpperCase();

export default ScratchOff;
