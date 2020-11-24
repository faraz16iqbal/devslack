import React, { Component } from "react";
import firebase from "../../firebase";
import { Segment, Button, Input, ButtonGroup } from "semantic-ui-react";

class MessageForm extends Component {
  state = {
    errors: [],
    message: "",
    messagesRef: this.props.messagesRef,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
  };

  handleChange = (e) => {
    // prompt("Typed");
    this.setState({ [e.target.name]: e.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
      content: this.state.message,
    };
    console.log(message);

    return message;
  };

  sendMessage = () => {
    const { message, channel, messagesRef } = this.state;
    // console.log(messagesRef);
    // console.log(channel);

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Please add a message!" }),
      });
    }
  };

  render() {
    const { errors, message, loading } = this.state;

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          value={message}
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon="add" />}
          labelPosition="left"
          className={errors.some((error) => error.message) ? "error" : ""}
          placeholder="Write your message"
        />

        <ButtonGroup icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </ButtonGroup>
      </Segment>
    );
  }
}

export default MessageForm;
