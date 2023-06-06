/*global chrome*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdQuiz } from "react-icons/md";
import { BsCardText } from "react-icons/bs";
import FlashCards from "../components/FlashCards";
import QuizComp from "../components/QuizComp";

const Home = () => {
  const [showComp, setShowComp] = useState("");
  const navigate = useNavigate();
  const handleLoggout = () => {
    localStorage.removeItem("collectionData");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("unfiltered_collection_id");
    localStorage.removeItem("username");
    chrome.storage.sync.set({
      userData: {
        token: "",
        unfilteredCollectionId: "",
      },
    });
    navigate("/login");
  };

  return (
    <div className="justify-around items-center h-[100vh] w-full bg-slate-50 grid">
      <div className="flex gap-[27px] justify-center">
        <button>
          <MdQuiz size={50} onClick={() => setShowComp("Quiz")} />
        </button>
        <button>
          <BsCardText size={50} onClick={() => setShowComp("FlashCards")} />
        </button>
      </div>

      {showComp === "Quiz" ? <QuizComp /> : null}
      {showComp === "FlashCards" ? <FlashCards /> : null}

      <button
        className="bg-gray-500 text-white px-4 py-2 rounded-md"
        onClick={handleLoggout}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
