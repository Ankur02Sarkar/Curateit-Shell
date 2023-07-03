/*global chrome*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdQuiz, MdSaveAlt } from "react-icons/md";
import { BsCardText, BsUpload } from "react-icons/bs";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { CiBoxList } from "react-icons/ci";
import FlashCards from "../components/FlashCards";
import QuizComp from "../components/QuizComp";
import "./home.css";
const Home = () => {
  const [showComp, setShowComp] = useState("");
  const [showBtns, setShowBtns] = useState(true);
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

  const handleQuizClick = () => {
    setShowComp("Quiz");
    setShowBtns(false);
  };

  const handleFlashCardsClick = () => {
    setShowComp("FlashCards");
    setShowBtns(false);
  };

  const handleSummaryClick = () => {
    setShowComp("Summary");
    setShowBtns(false);
  };

  return (
    <div className="flex flex-col items-center mt-[10px] gap-[20px]">
      {showBtns && (
        <div className="flex flex-col gap-[20px]">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleQuizClick}
          >
            Quiz
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleFlashCardsClick}
          >
            Flashcards
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSummaryClick}
          >
            Summary Highlights
          </button>
          <div class="flex justify-center">
            <div class="text-gray-500">OR</div>
          </div>
          <div className="outline outline-offset-2 outline-blue-500 rounded-md">
            <input
              type="file"
              name=""
              accept=".pdf"
              style={{ display: "none" }}
              id="pdfUploadBtn"
            />
            <label
              for="pdfUploadBtn"
              className="inline-block flex justify-center items-center gap-[12px] 
            text-center px-10 py-4 tracking-wider cursor-pointer mb-[0rem]"
            >
              <BsUpload />
              Upload PDF
            </label>
          </div>
        </div>
      )}
      {/* {!showBtns && (
        <div className="flex flex-row ">
          <select
            value={showComp}
            onChange={(e) => setShowComp(e.target.value)}
            className="outline outline-offset-2 outline-blue-500 text-black px-4 py-2 rounded-md"
          >
            <option value="">--Select--</option>
            <option value="Quiz">Quiz</option>
            <option value="FlashCards">Flashcards</option>
            <option value="Summary">Summary Highlights</option>
          </select>
          <div className="layoutWrapper ">
            <div className="layout bg-blue-500 text-white">
              <TfiLayoutGrid2 />
            </div>
            <div className="layout rounded-md bg-white">
              <CiBoxList />
            </div>
            <div className="layout ml-[10px] rounded-md bg-white">
              <MdSaveAlt />
            </div>
          </div>
        </div>
      )} */}
      {showComp === "Quiz" ? <QuizComp /> : null}
      {showComp === "FlashCards" ? <FlashCards /> : null}

      {/* <button
        className="bg-gray-500 text-white px-4 py-2 rounded-md"
        onClick={handleLoggout}
      >
        Logout
      </button> */}
    </div>
  );
};

export default Home;
