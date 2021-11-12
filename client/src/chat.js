import React, { useEffect, useState, useRef } from "react";
import Moment from "react-moment";
import SendIcon from "@material-ui/icons/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import CloseIcon from "@mui/icons-material/Close";
import "emoji-mart/css/emoji-mart.css";
import {
  motion,
  AnimateSharedLayout,
  LazyMotion,
  domAnimation,
  m,
} from "framer-motion";
import data from "emoji-mart/data/google.json";
import { NimblePicker } from "emoji-mart";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Fab from "@mui/material/Fab";
import ContactPageRoundedIcon from "@mui/icons-material/ContactPageRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import PanoramaRoundedIcon from "@mui/icons-material/PanoramaRounded";
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  customTooltip: {
    backgroundColor: "white",
    color: "black",
    fontSize: "13px",
  },
}));

function Chat({ socket, username, receiver, chatData }) {
  const classes = useStyles();

  const actions = [
    {
      icon: (
        <Tooltip
          title="Contacts"
          placement="right"
          classes={{
            tooltip: classes.customTooltip,
            arrow: classes.customArrow,
          }}
        >
          <Fab
            size="small"
            sx={{
              background: "linear-gradient(to right, #00d2ff, #3a7bd5)",
              color: "white",
            }}
          >
            <ContactPageRoundedIcon />
          </Fab>
        </Tooltip>
      ),
      name: "Copy",
    },
    {
      icon: (
        <Tooltip
          title="Document"
          placement="right"
          classes={{
            tooltip: classes.customTooltip,
            arrow: classes.customArrow,
          }}
        >
          <Fab
            size="small"
            sx={{
              background: "linear-gradient(to right, #4b6cb7, #182848)",
              color: "white",
            }}
          >
            <AssignmentRoundedIcon />
          </Fab>
        </Tooltip>
      ),
      name: "Save",
    },
    {
      icon: (
        <Tooltip
          title="Camera"
          placement="right"
          classes={{
            tooltip: classes.customTooltip,
            arrow: classes.customArrow,
          }}
        >
          <Fab
            size="small"
            sx={{
              background: "linear-gradient(to right, #ff512f, #dd2476)",
              color: "white",
            }}
          >
            <CameraAltRoundedIcon />
          </Fab>
        </Tooltip>
      ),
      name: "Print",
    },
    {
      icon: (
        <Tooltip
          title="Images & Videos"
          placement="right"
          classes={{
            tooltip: classes.customTooltip,
            arrow: classes.customArrow,
          }}
        >
          <Fab
            size="small"
            sx={{
              background: "linear-gradient(to right, #da22ff, #9733ee)",
              color: "white",
            }}
          >
            <PanoramaRoundedIcon />
          </Fab>
        </Tooltip>
      ),
      name: "Share",
    },
  ];

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showCloseIcon, setCloseIcon] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("");
  const messagesEndRef = useRef(null);
  const [showAttach, setShowAttach] = useState(false);

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
          <LazyMotion features={domAnimation}>
            <m.div className="emoji-container" layout>
              <NimblePicker
                include={["recent", "smileys", "people", "foods"]}
                set="google"
                data={data}
                style={{ width: "100%" }}
                showPreview={false}
                showSkinTones={false}
                onClick={onEmojiClick}
              />
            </m.div>
          </LazyMotion>
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

              <div>
                <button
                  aria-label="Attach"
                  onClick={() => setShowAttach(!showAttach)}
                >
                  <AttachFileIcon
                    id="attach"
                    className={`chat__input-icon ${
                      showAttach ? "chat__input-icon--pressed" : ""
                    }`}
                  ></AttachFileIcon>
                </button>

                <div
                  className={`chat__attach ${
                    showAttach ? "chat__attach--active" : ""
                  }`}
                >
                  {actions.map((btn) => (
                    <button className="chat__attach-btn" key={btn.name}>
                      {btn.icon}
                    </button>
                  ))}
                </div>
              </div>
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
