import React, { Component } from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
  };

  // User alternate way to pass state
  //   componentDidMount() {
  //     this.setState({ user: this.props.currentUser });
  //     console.log(this.state.currentUser);
  //   }

  dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignOut}>Sign Out</span>,
    },
  ];

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("Signed Out"));
  };

  render() {
    const { user } = this.state;
    // console.log(this.props.currentUser);
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted float="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevSlack</Header.Content>
            </Header>
          </Grid.Row>
          <Header style={{ padding: "0.25rem" }} as="h4">
            <Dropdown
              trigger={
                <span style={{ color: "#eee" }}>
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={this.dropDownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
