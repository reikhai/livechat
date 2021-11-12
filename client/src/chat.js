import React, { useEffect, useState, useRef } from "react";
import Moment from "react-moment";
import SendIcon from "@material-ui/icons/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import CloseIcon from "@mui/icons-material/Close";
import "emoji-mart/css/emoji-mart.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import data from "emoji-mart/data/google.json";
import { NimblePicker } from "emoji-mart";
import AttachFileIcon from "@mui/icons-material/AttachFile";

function Chat({ socket, username, receiver, chatData }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showCloseIcon, setCloseIcon] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("");
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

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        receiver: receiver,
        sender: username,
        message: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
      await socket.emit("login", username);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("online", (data) => {
      if (receiver in JSON.parse(data)) {
        setOnlineStatus("Online");
      } else {
        setOnlineStatus("Offline");
      }
    });

    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket, receiver]);

  useEffect(() => {
    setMessageList(chatData);
  }, [chatData]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <div className="container">
      <div className="chat_box">
        <div className="head">
          <div className="user">
            <div className="avatar">
              <img src="https://picsum.photos/g/40/40" alt="test" />
            </div>
            <div className="name">
              {receiver}
              <div className="online-font">{onlineStatus}</div>
            </div>
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
          <motion.div className="emoji-container" layout>
            <NimblePicker
              include={["recent", "smileys", "people", "foods"]}
              set="google"
              data={data}
              style={{ width: "100%" }}
              showPreview={false}
              showSkinTones={false}
              onClick={onEmojiClick}
            />
          </motion.div>
        )}
        <div className="foot">
          <AnimateSharedLayout>
            {showCloseIcon && (
              <>
                <motion.button
                  onClick={closeEmojiPicker}
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <CloseIcon></CloseIcon>
                </motion.button>
              </>
            )}
            <motion.div layout style={{ display: "flex", width: "100%" }}>
              <button onClick={showEmojiPicker}>
                <InsertEmoticonIcon></InsertEmoticonIcon>
              </button>
              <button>
                <AttachFileIcon></AttachFileIcon>
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
            </motion.div>
          </AnimateSharedLayout>
        </div>
      </div>
    </div>
  );
}

export default Chat;
