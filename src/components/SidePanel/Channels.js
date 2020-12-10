import React, { Component } from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions/index";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

class Channels extends Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    model: false,
    firstLoad: true,
  };

  componentDidMount() {
    this.addListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", (snap) => {
      // console.log(snap);
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    // console.log(firstChannel, this.state.firstLoad);

    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.changeChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        console.log("Added Channel");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      //   console.log("Channel Added");
      this.addChannel();
      this.closeModal();
    }
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: "0.7" }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}{" "}
      </Menu.Item>
    ));

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item style={{ marginTop: "1rem" }}>
            <span>
              {/* {" "} */}
              <Icon name="exchange" /> CHANNELS{" "}
            </span>{" "}
            ({channels.length}){" "}
            <Icon
              name="add"
              onClick={this.openModal}
              style={{ cursor: "pointer" }}
            />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/*  Add Channel model */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" color="green" inverted />
              Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="cancel" color="red" inverted />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel })(Channels);
