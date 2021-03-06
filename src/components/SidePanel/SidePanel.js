import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Channels from "./Channels";

export default class SidePanel extends Component {
  render() {
    const { currentUser } = this.props;
    console.log(currentUser);
    return (
      <Menu
        size="large"
        fixed="left"
        inverted
        vertical
        style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
      >
        <UserPanel currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
  }
}
