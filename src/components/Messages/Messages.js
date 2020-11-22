import React, { Component } from "react";
import MessagesHeader from "./MessagesHeader";
import { Segment, Comment } from "semantic-ui-react";

class Messages extends Component {
  render() {
    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
        </Segment>
        {/* <MessageForm /> */}
      </React.Fragment>
    );
  }
}

export default Messages;
