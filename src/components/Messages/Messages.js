import React, { Component } from "react";
import firebase from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import { Segment, Comment } from "semantic-ui-react";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    numUniqueUsers: "",
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({ messages: loadedMessages, messagesLoading: false });
      this.countUniqueUsers(loadedMessages);
    });
  };

  //Search Messages

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      // console.log(acc);
      return acc;
    }, []);
    const numUniqueUsers = `${uniqueUsers.length} Users`;
    this.setState({ numUniqueUsers });
  };

  displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = (channel) => (channel ? `#${channel.name}` : "");

  render() {
    const { messagesRef, messages, channel, user, numUniqueUsers } = this.state;
    // console.log(channel);
    return (
      <React.Fragment>
        <MessagesHeader
          messagesRef={messagesRef}
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
        />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
            {/* <h1>Hello</h1> */}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
