import React, { Component } from 'react';
import Modal from './components/modal/modal';
//import Chatbox from "./components/chatbox/chatbox";
import './App.css';
import io from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "",
      post: "",
      responseToPost: "",
      show: false,
      messages: [],
      users: [],
      selectedUser: {
        user_id: "",
        bio: ""
      }
    };

    //TODO: replace hardcoded variable into config file
    this.socket = io("http://localhost:5001");
    this.showModal = this.showModal.bind(this);
    this.getAvatar = this.getAvatar.bind(this);
  }

  getAvatar(userId){
    return this.state.users.find(x => x.id === userId).avatar;
  }

  showModal(userId) {
    const user = this.state.users.find(x => x.id === userId);
    this.setState({ selectedUser: user });
    this.setState({ show: true });
  }

  hideModal = () => {
    this.setState({ show: false });
  };

  componentDidMount() {
    this.getUser(1)
      .then(res => this.setState(prevState => {
        let users = prevState.users;
        users.push(res);
        return { users: users };
      }))
      .catch(err => console.log(err));

    this.socket.on("chat", function(message) {
      message.key =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);

          //TODO: On new message check if we have the user data if not then fetch it and store it locally
        //const a = this.state.users.find(x => x.id === message.user_id);

        this.setState(prevState => {
          let messages = prevState.messages;
          messages.push(message);
          return { messages: messages };
        });
    }.bind(this))
  }

  componentWillUnmount() {
    this.socket.close();
  }

  getUser = async userId => {
    const response = await fetch(`/user/${userId}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    this.socket.emit("chat", {
      name: "chat",
      message: this.state.post,
      timestamp: new Date().toISOString(),
      user_id: 1
    });
    this.setState({ post: "" });
  };

  //TODO Move Table into chatbox component
  render() {
    return (
      <div className="App">
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <p>USERNAME: {this.state.selectedUser.id}</p>
          <p>BIO: {this.state.selectedUser.bio}</p>
        </Modal>
        <table align="center">
          <tbody>
            {this.state.messages.map(message => (
              <tr key={message.key}>
                <td className="name-column">
                  <img
                    className="avatar"
                    src={this.getAvatar(message.user_id)}
                    alt="avatar"
                    onClick={() => this.showModal(message.user_id)}
                  />
                </td>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;
