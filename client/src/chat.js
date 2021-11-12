import React, { useEffect, useState, useRef } from "react";
// import ScrollToBottom from "react-scroll-to-bottom";
// import AutoScroll from "@brianmcallister/react-auto-scroll";
import Moment from "react-moment";
import SendIcon from "@material-ui/icons/Send";
// import Picker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import CloseIcon from "@mui/icons-material/Close";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function Chat({ socket, username, receiver, chatData }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showCloseIcon, setCloseIcon] = useState(false);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        receiver: receiver,
        sender: username,
        message: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onEmojiClick = (emojiObject) => {
    setCurrentMessage((prevInput) => prevInput + emojiObject.native);
  };

  const showEmojiPicker = () => {
    setShowPicker(true);
    setCloseIcon(true);
  };

  const closeEmojiPicker = () => {
    setShowPicker(false);
    setCloseIcon(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    // setMessageList(chatData);
  }, [socket]);

  useEffect(() => {
    setMessageList(chatData);
  }, [chatData]);

  return (
    <div className="container">
      <div className="chat_box">
        <div className="head">
          <div className="user">
            <div className="avatar">
              <img src="https://picsum.photos/g/40/40" alt="test" />
            </div>
            <div className="name">{receiver}</div>
          </div>
        </div>
        <div className="body">
          {messageList.map((messageContent, index) => {
            return (
              <div
                ref={messagesEndRef}
                className={
                  username === messageContent.sender ? "outgoing" : "incoming"
                }
                key={messageContent.message + index}
              >
                <div className="bubble">
                  <div className="d-inline">
                    <span>{messageContent.message}</span>
                    <span className="font-msg-time">
                      <Moment format="HH:mm" id="time">
                        {messageContent.time}
                      </Moment>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {/* <div className="typing">
            <div className="bubble">
              <div className="ellipsis dot_1"></div>
              <div className="ellipsis dot_2"></div>
              <div className="ellipsis dot_3"></div>
            </div>
          </div> */}
        </div>

        {showPicker && (
          <div className="emoji-container animated animatedFadeInUp fadeInUp">
            <Picker
              set="apple"
              style={{ width: "100%" }}
              tooltip={false}
              showPreview={false}
              showSkinTones={false}
              onClick={onEmojiClick}
            />
          </div>
        )}
        <div className="foot">
          {showCloseIcon && (
            <div className="emoji-container animated animatedFadeInUp fadeInUp">
              <button onClick={closeEmojiPicker}>
                <CloseIcon></CloseIcon>
              </button>
            </div>
          )}

          <button onClick={showEmojiPicker}>
            <InsertEmoticonIcon></InsertEmoticonIcon>
          </button>
          <input
            type="text"
            className="msg"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button type="submit" onClick={sendMessage}>
            <SendIcon></SendIcon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
