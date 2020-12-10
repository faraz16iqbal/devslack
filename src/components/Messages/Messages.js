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
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
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

  handleSearchChange = (event) => {
    // console.log(event);
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => {
        this.searchMessage();
      }
    );
  };

  searchMessage = () => {
    // console.log(this.state);
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    this.setState({ searchResults });

    //Waiting 1 second before clearing
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  // Number of unique users
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
    const {
      messagesRef,
      messages,
      channel,
      user,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
    } = this.state;

    // console.log(channel);

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
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
