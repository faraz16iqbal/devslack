import React, { Component } from "react";
import uuid from "uuid";
import firebase from "../../firebase";
import { Segment, Button, Input, ButtonGroup } from "semantic-ui-react";

import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

class MessageForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    percentUploaded: 0,
    errors: [],
    message: "",
    messagesRef: this.props.messagesRef,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    modal: false,
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => {
    console.log("Clicked");
    this.setState({ modal: false });
  };

  handleChange = (e) => {
    // prompt("Typed");
    this.setState({ [e.target.name]: e.target.value });
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    // console.log(message);

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

  uploadFile = (file, metadata) => {
    // console.log(file, metadata);
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuid()}.jpg`;
    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.log(filePath);
            console.log(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                console.log(downloadUrl);
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.log(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ errors: this.state.errors.concat(err) });
      });
  };

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      percentUploaded,
      uploadState,
    } = this.state;

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
            disabled={uploadState === "uploading"}
            onClick={this.openModal}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </ButtonGroup>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
