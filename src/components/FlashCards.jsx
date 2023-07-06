/* global chrome */
import React, { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./FlashCards.css";
import Quiz from "./Quiz";
import Loader from "./Loader";
import QuizComp from "./QuizComp";
import { MdSaveAlt } from "react-icons/md";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { CiBoxList } from "react-icons/ci";
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const FlashCards = (props) => {
  const [transcript, setTranscript] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isYoutube, setIsYoutube] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [text, setText] = useState("");
  const [inputNumber, setInputNumber] = useState(2);
  const [timesTextExtrCalled, setTimesTextExtrCalled] = useState(1);
  const [timescreateQusCalled, setTimescreateQusCalled] = useState(1);
  const [currentIndexFlashCards, setCurrentIndexFlashCards] = useState(0);
  const [currentIndexTextExtraction, setCurrentIndexTextExtraction] =
    useState(0);
  const [hasGeneratedFlashCards, setHasGeneratedFlashCards] = useState(false);
  const [hasExtractedText, setHasExtractedText] = useState(false);
  const [endOfResult, setEndOfResult] = useState(false);
  const [radioSelection, setRadioSelection] = useState("flashCardsWrapper");
  const [transcriptError, setTranscriptError] = useState(false);
  const [isListView, setListView] = useState(true);

  const baseUrl = process.env.REACT_APP_PYTHON_API;
  console.log("Base Url : ", baseUrl);
  console.log("isYt in flashcards : ", props.isYt);

  const checkYoutube = async () => {
    setIsYoutube("");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentUrl = tabs[0].url;
      setSiteUrl(currentUrl);
      console.log("url from useeffect : ", currentUrl);
      if (currentUrl.includes("youtube.com")) {
        setIsYoutube("Yes");
      } else {
        setIsYoutube("No");
      }
    });
  };

  function extractJSON(str) {
    // Check if the string starts with "(" and ends with ")"
    if (str.startsWith("(") && str.endsWith(")")) {
      str = str.substring(1, str.length - 1); // Remove the parentheses
    }

    let startIndex = str.indexOf("[");
    let endIndex = str.lastIndexOf("]") + 1;
    let jsonStr = str.substring(startIndex, endIndex);

    return jsonStr;
  }

  const savePdf = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight() - 20;
    const pageWidth = doc.internal.pageSize.getWidth() - 20;
    let yCoordinate = 10;

    quizData.forEach((item, index) => {
      const questionLines = doc.splitTextToSize(
        `Question ${index + 1}: ${item.question}`,
        pageWidth
      );
      const answerLines = doc.splitTextToSize(
        `Answer ${index + 1}: ${item.answer}`,
        pageWidth
      );

      if (yCoordinate + questionLines.length * 7 > pageHeight) {
        doc.addPage();
        yCoordinate = 10;
      }

      doc.text(questionLines, 10, yCoordinate);
      yCoordinate = yCoordinate + questionLines.length * 7;

      if (yCoordinate + answerLines.length * 7 > pageHeight) {
        doc.addPage();
        yCoordinate = 10;
      }

      doc.text(answerLines, 10, yCoordinate);
      yCoordinate = yCoordinate + answerLines.length * 7;

      if (yCoordinate + 10 > pageHeight) {
        doc.addPage();
        yCoordinate = 10;
      } else {
        yCoordinate = yCoordinate + 10;
      }
    });
    doc.save("quiz.pdf");
  };

  const createQuestionAnswers = async () => {
    setTimescreateQusCalled(timescreateQusCalled + 1);
    setLoading(true);
    setEndOfResult(false);
    setTranscriptError(false);
    console.log("will create ", inputNumber, " questions ");
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const siteUrl = tabs[0].url;
      console.log("url from createQuestionAnswers : ", siteUrl);

      const url = new URL(siteUrl);
      const videoId = new URLSearchParams(url.search).get("v");
      console.log("YouTube video ID: ", videoId);

      try {
        const response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("Transcription fetch operation timed out"));
          }, 60000); // 60 seconds

          fetch(
            `${baseUrl}/transcript/${videoId}/${currentIndexFlashCards}/${
              currentIndexFlashCards + 3000
            }`
          ).then((response) => {
            clearTimeout(timer);
            resolve(response);
          });
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (currentIndexFlashCards + 3000 >= data.transcription.length) {
          setCurrentIndexFlashCards(0);
        } else {
          setCurrentIndexFlashCards(currentIndexFlashCards + 3000);
        }

        setTranscript(data.transcription);
        console.log("Transcript : ", data.transcription);

        if (data.transcription == "") {
          console.log("Empty transcription:", data.transcription);
          setLoading(false);
          setEndOfResult(true);
          return;
        }

        const resp = await fetch(`${baseUrl}/ask_query/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Create ${
              timescreateQusCalled == 2 || timescreateQusCalled == 3 ? "5" : "2"
            } question and answer based on the following context :- 
              ${data.transcription}
            `,
          }),
        });

        let result = await resp.json();
        console.log("res from flashcards api :: ", result.message);
        const parsedResult = result.message;
        console.log("parsed flashcards res : ", parsedResult);
        setQuizData((oldQuizData) => [...oldQuizData, ...parsedResult]);
        setCurrentIndexFlashCards(currentIndexFlashCards + 3000);
      } catch (error) {
        console.error("error : ", error);
        setTranscriptError(true);
      } finally {
        setLoading(false);
      }
      setHasGeneratedFlashCards(true);
    });
    console.log("timescreateQusCalled : ", timescreateQusCalled);
  };

  const handleTextExtraction = async () => {
    setTimesTextExtrCalled(timesTextExtrCalled + 1);
    setLoading(true);
    setEndOfResult(false);
    setTranscriptError(false);
    console.log("will create ", inputNumber, " questions ");
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const siteUrl = tabs[0].url;
      console.log("url from handleTextExtraction : ", siteUrl);

      const encodedUrl = encodeURIComponent(siteUrl);
      console.log("Encoded URL : ", encodedUrl);

      try {
        const response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("Text extraction fetch operation timed out"));
          }, 60000);

          fetch(
            `${baseUrl}/extract_article/${encodedUrl}/${currentIndexTextExtraction}/${
              currentIndexTextExtraction + 3000
            }`
          ).then((response) => {
            clearTimeout(timer);
            resolve(response);
          });
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (currentIndexTextExtraction + 3000 >= data.text.length) {
          setCurrentIndexTextExtraction(0); // Reset index to 0 if we've reached the end
        } else {
          setCurrentIndexTextExtraction(currentIndexTextExtraction + 3000);
        }

        setText(data.text);
        console.log("Text : ", data.text);

        if (data.text == "") {
          console.log("Empty Text:", data.text);
          setLoading(false);
          setEndOfResult(true);
          return;
        }

        const resp = await fetch(`${baseUrl}/ask_query/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Create ${
              timesTextExtrCalled == 2 || timesTextExtrCalled == 3 ? "5" : "2"
            } question and answer based on the following context :- 
              ${data.text}
            `,
          }),
        });

        let result = await resp.json();

        console.log("res from flashcards api :: ", result.message);
        const parsedResult = result.message;
        console.log("parsed flashcards res : ", parsedResult);
        setQuizData((oldQuizData) => [...oldQuizData, ...parsedResult]);
        setCurrentIndexTextExtraction(currentIndexTextExtraction + 3000);
      } catch (error) {
        console.error(error);
        setTranscriptError(true);
      } finally {
        setLoading(false);
      }
      setHasExtractedText(true);
    });
    console.log("timesTextExtrCalled : ", timesTextExtrCalled);
  };

  const [showComp, setShowComp] = useState("FlashCards");
  const [renderedSelectWrapper, setRenderedSelectWrapper] = useState(false);

  const handleSelectChange = (e) => {
    setShowComp(e.target.value);
    setRenderedSelectWrapper(true);
  };

  useEffect(() => {
    console.log("use effect triggered");
    //
    setIsYoutube(props.isYt);
    //
    if (isYoutube === "Yes") {
      createQuestionAnswers();
      setHasGeneratedFlashCards(true);
      console.log("createQuestionAnswers called");
    } else if (isYoutube === "No") {
      handleTextExtraction();
      setHasExtractedText(true);
      console.log("handleTextExtraction called");
    }
  }, [isYoutube]);

  useEffect(() => {
    if (quizData.length === 2) {
      console.log("creating more data after first api call");
      if (isYoutube === "Yes") {
        setInputNumber(5);
        createQuestionAnswers();
      } else if (isYoutube === "No") {
        setInputNumber(5);
        handleTextExtraction();
        console.log("handle text ext call finished");
      }
    } else if (quizData.length === 7) {
      console.log("creating more data after first api call");
      if (isYoutube === "Yes") {
        setInputNumber(5);
        createQuestionAnswers();
      } else if (isYoutube === "No") {
        setInputNumber(5);
        handleTextExtraction();
        console.log("handle text ext call finished");
      }
    }
  }, [quizData.length, isYoutube]);

  return (
    <>
      {!renderedSelectWrapper && (
        <div className="flex flex-row ">
          {console.log("from flashcards")}
          <select
            value={showComp}
            onChange={handleSelectChange}
            className="outline outline-offset-2 outline-blue-500 text-black px-4 py-2 rounded-md"
          >
            <option value="" disabled>
              --Select--
            </option>
            <option value="Quiz">Quiz</option>
            <option value="FlashCards">Flashcards</option>
            {/* <option value="Summary">Summary Highlights</option> */}
          </select>
          <div className="layoutWrapper ">
            <div
              onClick={() => {
                console.log("grid view");
                setListView(false);
              }}
              className={`layout rounded-md ${
                !isListView ? "bg-blue-500 text-white" : ""
              }`}
            >
              <TfiLayoutGrid2 />
            </div>
            <div
              onClick={() => {
                console.log("list view");
                setListView(true);
              }}
              className={`layout rounded-md ${
                isListView ? "bg-blue-500 text-white" : ""
              }`}
            >
              <CiBoxList />
            </div>
            {quizData.length > 0 && (
              <div
                className="layout ml-[10px] rounded-md bg-white"
                onClick={savePdf}
              >
                <MdSaveAlt />
              </div>
            )}
          </div>
        </div>
      )}

      {showComp === "Quiz" ? <QuizComp isYt={props.isYt} /> : null}
      {showComp === "FlashCards" ? (
        <div
          className="flashCardsWrapper"
          style={{
            width: isListView ? "" : "100%",
            padding: "20px",
          }}
        >
          <h1 className="text-center text-black">FlashCards</h1>
          {isYoutube === "" ? (
            <button id="startBtn" onClick={checkYoutube}>
              Start
            </button>
          ) : null}

          {isYoutube === "Yes" && (
            <>
              <button
                onClick={createQuestionAnswers}
                disabled={loading}
                id="isYoutubeBtn"
                style={{ margin: "auto" }}
              >
                {loading && hasGeneratedFlashCards
                  ? "Generating Flashcards..."
                  : hasGeneratedFlashCards
                  ? "Generate More Flashcards"
                  : "Generate Flashcards"}
              </button>
            </>
          )}
          {isYoutube === "No" && (
            <>
              <button
                onClick={handleTextExtraction}
                disabled={loading}
                id="isSiteBtn"
                style={{ margin: "auto" }}
              >
                {loading && hasExtractedText
                  ? "Extracting Text..."
                  : hasExtractedText
                  ? "Extract More Text"
                  : "Extract Text"}
              </button>
            </>
          )}
          {quizData && (
            <div
              id="quiz-data"
              className={`flashCards ${!isListView ? "gridView" : ""}`}
            >
              {quizData.map((item, index) => (
                <label key={index} className="quiz-label">
                  <input type="checkbox" />
                  <div className="flip-card">
                    <div className="front max-w-sm p-6 border rounded-lg bg-blue-50 border-blue-300 flex flex-col justify-between">
                      <p className="mb-3 text-lg">{item.question}</p>
                      <div className="self-end">
                        <p
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center outline outline-offset-1 
outline-blue-500 rounded-md border-2 text-blue-700 hover:bg-blue-500 hover:text-white"
                        >
                          Show Answer
                        </p>
                      </div>
                    </div>
                    <div className="back max-w-sm p-6 border rounded-lg bg-blue-50 border-blue-300 flex flex-col justify-between">
                      <p className="mb-3 text-lg">{item.answer}</p>
                      <div className="self-end">
                        <p
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center outline outline-offset-1 
outline-blue-500 rounded-md border-2 text-blue-700 hover:bg-blue-500 hover:text-white"
                        >
                          Show Question
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
          {loading && <Loader />}
          {endOfResult && (
            <h3 style={{ color: "black", textAlign: "center" }}>
              No more Content
            </h3>
          )}
          {transcriptError && (
            <h3 style={{ color: "black", textAlign: "center" }}>
              Some error occured
            </h3>
          )}
        </div>
      ) : null}
    </>
  );
};

export default FlashCards;
