import React, { useState, useEffect, useRef } from "react";
import "./EditorPage.scss";
import Editor from "../../components/Editor/Editor";
import Client from "../../components/Client/Client";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { initSocket } from "../../Socket";
import ACTIONS from "../../Action";


export default function EditorPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const [clients, setClients] = useState([]);

  const handleCodeChange = (code) => {
    codeRef.current = code;
  }
  const init = async () => {
    if (!location.state) {
      //check for username, if state is not present then navigate to homepage
      navigate("/");
    } else {
      socketRef.current = await initSocket(); // to initialise the socket

      socketRef.current.on(ACTIONS.CONNECT_ERROR, (e) => {
        handleError(e);
      });
      socketRef.current.on(ACTIONS.CONNECT_FAILED, (e) => {
        handleError(e);
      });
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      socketRef.current.on(ACTIONS.JOINED, (username, clientList, socketId) => {
        setClients(clientList);
        if (username !== location.state?.username) {
          // dont show this toast to current user
          toast.success(`${username} joined the room`);
        }
        socketRef.current.emit (ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        });
      });

      // window.addEventListener("beforeunload", () => {
      //   socketRef.current.emit(ACTIONS.LEAVE, roomId);
      // });

      socketRef.current.on(ACTIONS.DISCONNECTED, (username, clientList) => {
        setClients(clientList);
        console.log(clientList)
        if (username !== location.state?.username) {
          // dont show this toast to current user
          toast.success(`${username} left the room`);
        }
      });
      
    }
  };

  const handleError = (e) => {
    console.log("socket connection error", e);
    toast.error("Socket connection failed, try again later.");
    navigate("/");
  };

  useEffect(() => {
    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  const leaveRoomHandler = () => {
    navigate("/");
    // socketRef.current.emit(ACTIONS.LEAVE, roomId);
  };

  const copyRoomHandler = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img
              src="./../code-sync.png"
              alt="img here"
              className="logoImage"
            />
          </div>

          <h3 className="connected">Connected</h3>
          <div className="clientList">
            {clients?.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="btn-div">
          <button className="btn copyBtn" onClick={copyRoomHandler}>
            Copy Room ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoomHandler}>
            Leave Room
          </button>
        </div>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          codeRef = {codeRef}
          handleCodeChange={handleCodeChange}
        />
      </div>
    </div>
  );
}
