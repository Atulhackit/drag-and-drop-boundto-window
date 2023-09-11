import React from "react";
import "./styles.css";

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      x: 0,
      y: 0,
      rel: null, // position relative to the cursor
      dragging: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.enableDragging = this.enableDragging.bind(this);
    this.disableDragging = this.disableDragging.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidUpdate(prevprops, prevstate) {
    if (this.state.dragging && !prevstate.dragging) {
      document.addEventListener("mousemove", this.onMouseMove);
    } else if (!this.state.dragging && prevstate.dragging) {
      document.removeEventListener("mousemove", this.onMouseMove);
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  enableDragging(e) {
    if (e.button !== 0) return;

    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - this.state.x,
        y: e.pageY - this.state.y
      }
    });

    e.stopPropagation();
    e.preventDefault();
    console.log("enabled dragging");
  }

  disableDragging(e) {
    this.setState({ dragging: false });
    e.stopPropagation();
    e.preventDefault();
    console.log("disabled dragging");
  }

  onMouseMove(e) {
    if (!this.state.dragging) return;
    const dialogWidth = document.getElementById("node").clientWidth;
    const dialogHeight = document.getElementById("node").clientHeight;
    const x = Math.min(
      Math.max(0, e.pageX - this.state.rel.x),
      window.innerWidth - dialogWidth - 20
    );
    const y = Math.min(
      Math.max(0, e.pageY - this.state.rel.y),
      window.innerHeight - dialogHeight - 20
    );
    this.setState({
      x: x,
      y: y
    });
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return (
      <div className={"App"}>
        <div
          id={"node"}
          style={{ top: this.state.y + "px", left: this.state.x + "px" }}
        >
          <div
            className={"top-row"}
            onMouseDown={this.enableDragging}
            onMouseUp={this.disableDragging}
            onMouseMove={this.onMouseMove}
          >
            <h5>Your node: </h5>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
            >
              Close
            </button>
          </div>
          <textarea
            value={this.state.text}
            onChange={this.handleChange}
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    );
  }
}
