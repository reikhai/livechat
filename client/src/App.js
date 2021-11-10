// import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatData, setChatData] = useState([]);

  const joinRoom = () => {
    const url = "http://localhost:3001/get_messages";

    let data = {
      sender: username,
      receiver: receiver,
    };

    var request = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (username !== "" && receiver !== "") {
      socket.emit("join_room", username + "--with--" + receiver);

      setShowChat(true);
      fetch(request)
        .then((response) => response.json())
        .then((data) => setChatData(data));
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Receiver Name..."
            onChange={(event) => {
              setReceiver(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Start Chat</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          receiver={receiver}
          chatData={chatData}
        />
      )}
    </div>
  );
}

export default App;
