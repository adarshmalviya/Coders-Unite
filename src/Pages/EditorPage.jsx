import React, { useRef, useState, useEffect } from "react";
import Client from "../components/Client";
import coder_img from "../Images/coder_img.png";
import Editor from "../components/Editor";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { initSocket } from "./../socket";
import ACTIONS from "../Actions";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      // For Error Handling while connecting to Socket
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("Socket Error: ", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state.username) {
            toast.success(`${username} joined the chat`);
          }
          setClients(clients);

          // To SYNC Code
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast(`${username} left the room`, {
          icon: "⚠️",
        });
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    // Cleaning Function to clear all the connections
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id Copied!");
    } catch (err) {
      toast.error("Failed to Copy!");
      console.error(err);
    }
  }

  async function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          {/* Logo  */}
          <div className="logoWrapper">
            <img
              src={coder_img}
              alt="Coder Image"
              id="coder_img"
              height="50px"
              width="70px"
            />
            <div id="logo-text">
              <span
                id="logo-title-text"
                style={{ fontSize: "11px", color: "white" }}
              >
                Coder's Unite
              </span>
              <span id="logo-des-text" style={{ fontSize: "12px" }}>
                Realtime collaboration
              </span>
            </div>
          </div>

          <h3>Connected</h3>

          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room Id
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => (codeRef.current = code)}
        />
      </div>
    </div>
  );
};

export default EditorPage;
