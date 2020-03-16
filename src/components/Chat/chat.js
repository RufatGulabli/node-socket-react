import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./chat.css";
import InfoBar from "../InfoBar/infobar";
import Input from "../Input/input";
import Messages from "../Messages/messages";
import TextContainer from "../TextContainer/textContainer";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState();
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    console.log("Use Effect 1...");
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    socket.emit("join", { room, name }, err => {
      if (err) {
        alert(err);
      }
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    console.log("Use Effect 2...");
    socket.on("message", message => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      console.log("RoomData: ", { users });
      setUsers(users);
    });
  }, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    socket.emit("sendMessage", message, () => {
      setMessage("");
    });
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          sendMessage={sendMessage}
          setMessage={setMessage}
        />
      </div>
      <div>
        <TextContainer users={users} />
      </div>
    </div>
  );
};

export default Chat;
