import React from "react";
import "./rightBar.scss";

const messages = [
  {
    id: 1,
    name: "admin",
    time: "08:01",
    message:
      "Hello, It`s a new chat for all users! Imagine there's no heaven It's easy if you try No hell below us Above us only sky Imagine all the people living for today  .",
  },
  {
    id: 2,
    name: "user1",
    time: "10:30",
    message:
      "Hello, You, you may say I'm a dreamer, but I'm not the only one I hope some day you'll join us And the world will be as one ",
  },
  {
    id: 3,
    name: "user2",
    time: "12:51",
    message:
      "Hello,  Imagine there's no countries It isn't hard to do Nothing to kill or die for And no religion too Imagine all the people living life in peace ",
  },
  {
    id: 4,
    name: "user3",
    time: "15:22",
    message:
      "Hello, You, you may say I'm a dreamer, but I'm not the only one I hope some day you'll join us And the world will be as one",
  },
  {
    id: 5,
    name: "user4",
    time: "20:01",
    message:
      "Hello, Imagine no possessions I wonder if you can No need for greed or hunger A brotherhood of man Imagine all the people sharing all the world",
  },
  {
    id: 6,
    name: "user5",
    time: "22:45",
    message:
      "Hello, You, you may say I'm a dreamer, but I'm not the only one I hope some day you'll join us And the world will be as one",
  },
];

function RightBar() {
  return (
    <div className="rightBar">
      <div className="container">
        <div className="chatName">Our General Chat</div>
        {messages.map((message) => (
          <div className="blockMessage" key={message.id}>
            <span className="userName">{message.name}</span>
            <div className="message">{message.message}</div>
            <span className="data">{message.time}</span>
          </div>
        ))}
        <div className="blockMessage"></div>
      </div>
    </div>
  );
}

export default RightBar;
