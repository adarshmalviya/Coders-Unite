import React, { useState } from "react";
import coder_img from "../Images/coder_img.png";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const uuid = uuidV4();
    setRoomId(uuid);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId) {
      toast.error("Room Id is required");
      return;
    } else if (!username) {
      toast.error("Username is required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleEnterKey = (e) => {
    if (e.code == "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="logoWrapper">
          <img
            src={coder_img}
            alt="Coder Image"
            id="coder_img"
            height="100px"
            width="150px"
          />
          <div id="logo-text">
            <span id="logo-title-text">Coder's Unite</span>
            <span id="logo-des-text">Realtime collaboration</span>
          </div>
        </div>

        <h4 className="mainLabel">Paste invitation Room ID</h4>
        <div className="inputGroup" onKeyUp={handleEnterKey}>
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            {" "}
            Join{" "}
          </button>
          <span className="createInfo">
            If you don't have an invite then create{" "}
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>{" "}
          </span>
        </div>
      </div>

      <footer>
        <h3>
          Build with 💛 by{" "}
          <a
            target="_blank"
            href="https://github.com/adarshmalviya"
            id="github_link"
          >
            Adarsh Malviya
          </a>{" "}
        </h3>
      </footer>
    </div>
  );
};

export default Home;
