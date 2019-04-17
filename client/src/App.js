import React, { Component } from 'react';
import Modal from './components/modal/modal';
import Chatbox from "./components/chatbox/chatbox";
import './App.css';
import io from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "",
      post: "",
      responseToPost: "",
      user: "",
      show: false,
      messages: [],
      users: []
    };

    this.socket = io("http://localhost:5001");

    // This binding is necessary to make `this` work in the callback
    this.showModal = this.showModal.bind(this);
  }

  showModal() {
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

    this.socket.on("chat", message => {
      message.key = JSON.stringify(message);
      const a = this.state.users.find(x => x.id === message.user_id);

      debugger;
        this.setState(prevState => {
          let messages = prevState.messages;
          messages.push(message);
          return { messages: messages };
        });
    });
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
      timestamp: new Date().toISOString()
    });
    this.setState({ post: "" });
  };
  render() {
    return (
      <div className="App">
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <p>USERNAME: {this.state.user.username}</p>
          <p>BIO: {this.state.user.bio}</p>
        </Modal>
        <Chatbox messages={this.state.messages} users={this.state.users} />
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
