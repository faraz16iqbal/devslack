import React, { Component } from "react";
import UserPanel from "./UserPanel";
import { Menu } from "semantic-ui-react";
export default class SidePanel extends Component {
  render() {
    return (
      <Menu
        size="large"
        fixed="left"
        inverted
        vertical
        style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
      >
        <UserPanel />
      </Menu>
    );
  }
}