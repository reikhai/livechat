import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Moment from "react-moment";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    // height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
  from: {
    // width: "100%",
    textAlign: "right",
    fontSize: "8px",
    margin: "5px 0px 0px 25px",
  },

  messageTextSelf: {
    float: "right",
    background: "#683db8",
    color: "#FFF",
    padding: "9px",
    fontSize: "13px",
    borderRadius: "5px",
    marginBottom: "3px",
  },

  messageTextOpponent: {
    float: "left",
    background: "#ecf1f8",
    color: "#4a4a4a",
    padding: "9px",
    fontSize: "13px",
    borderRadius: "5px",
    marginBottom: "3px",
  },
});

function Chat({ socket, username, receiver, chatData }) {
  const classes = useStyles();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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
    <div>
      <Grid container>
        <Grid item={true} xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item={true} xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary={receiver}>{receiver}</ListItemText>
              <ListItemText secondary="online" align="right"></ListItemText>
            </ListItem>
            <Divider />
          </List>
        </Grid>
        <Grid item={true} xs={9}>
          <List className={classes.messageArea}>
            <ScrollToBottom className="message-container">
              {messageList.map((messageContent, index) => {
                return (
                  <ListItem key={messageContent.message + index}>
                    <Grid container>
                      <Grid item={true} xs={12}>
                        <div className="chat-messages">
                          <div
                            className={
                              username === messageContent.sender
                                ? classes.messageTextSelf
                                : classes.messageTextOpponent
                            }
                          >
                            {messageContent.message}
                            <div className={classes.from}>
                              <Moment format="HH:mm" id="time">
                                {messageContent.time}
                              </Moment>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
            </ScrollToBottom>
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item={true} xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={currentMessage}
                placeholder="Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />
            </Grid>
            <Grid item={true} xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    // <div className="chat-window">
    //   <div className="chat-header">
    //     <p>{receiver}</p>
    //   </div>
    //   <div className="chat-body">
    // <ScrollToBottom className="message-container">
    //   {messageList.map((messageContent, index) => {
    //     return (
    //       <div
    //         className="message"
    //         id={username === messageContent.sender ? "other" : "you"}
    //         key={messageContent.message + index}
    //       >
    //         <div>
    // <div className="message-content">
    //   <p>{messageContent.message}</p>
    // </div>
    //           <div className="message-meta">
    //             <Moment format="HH:mm" id="time">
    //               {messageContent.time}
    //             </Moment>

    //             <p id="author">{messageContent.sender}</p>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   })}
    // </ScrollToBottom>
    //   </div>
    //   <div className="chat-footer">
    //     <input
    //       type="text"
    // value={currentMessage}
    // placeholder="Hey..."
    // onChange={(event) => {
    //   setCurrentMessage(event.target.value);
    // }}
    // onKeyPress={(event) => {
    //   event.key === "Enter" && sendMessage();
    // }}
    //     />
    //     <button onClick={sendMessage}>&#9658;</button>
    //   </div>
    // </div>
  );
}

export default Chat;
