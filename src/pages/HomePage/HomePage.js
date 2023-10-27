import React, { useState } from "react";
import "./HomePage.scss";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { join } from "lodash";

export default function HomePage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const newRoomId = uuid();
    setRoomId(newRoomId);
    toast.success("Created a new room");
  };
  const joinRoom = (e,condition) => {

    if (condition == "onKeyUp" && e.key !== "Enter") {                //before check input field check what is key, if not enter that means user doesnt want to submit the form 
      return;
    }
    else if (!roomId || !username) {
      toast.error("Room ID and Username is required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,                                                                 //passing username to editor page
      },
    });
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="././code-sync.png"
          alt="code-sync-logo"
        />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            name=""
            id=""
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={(e) => joinRoom(e, "onKeyUp")}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            name=""
            id=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={(e) => joinRoom(e, "onKeyUp")}
          />
          <button
            className="btn joinBtn"
            onClick={(e) => joinRoom(e)}
            
          >
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a href="" className="createNewBtn" onClick={createNewRoom}>
              new&nbsp;room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💛 by &nbsp;
          <a href="https://github.com/logic-found">logic-found</a>
        </h4>
      </footer>
    </div>
  );
}
