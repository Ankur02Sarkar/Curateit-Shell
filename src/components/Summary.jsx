/* global chrome */
import React, { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./FlashCards.css";
import Quiz from "./Quiz";
import Loader from "./Loader";
import QuizComp from "./QuizComp";
import FlashCards from "./FlashCards";
import { MdSaveAlt } from "react-icons/md";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { CiBoxList } from "react-icons/ci";
import "./summary.css";
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const Summary = (props) => {
  const [transcript, setTranscript] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isYoutube, setIsYoutube] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [text, setText] = useState("");
  const [inputNumber, setInputNumber] = useState(2);
  const [timesCreateHighSiteCalled, setTimesCreateHighSiteCalled] = useState(1);
  const [timesCreateHighYtCalled, setTimesCreateHighYtCalled] = useState(1);
  const [currentIndexFlashCards, setCurrentIndexFlashCards] = useState(0);
  const [currentIndexTextExtraction, setCurrentIndexTextExtraction] =
    useState(0);
  const [hasGeneratedFlashCards, setHasGeneratedFlashCards] = useState(false);
  const [hasExtractedText, setHasExtractedText] = useState(false);
  const [endOfResult, setEndOfResult] = useState(false);
  const [radioSelection, setRadioSelection] = useState("flashCardsWrapper");
  const [transcriptError, setTranscriptError] = useState(false);
  const [isListView, setListView] = useState(true);
  const [highlight, setHighlight] = useState("");
  const [summaryData, setSummaryData] = useState({});

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

  const createHighlightsYt = async () => {
    setTimesCreateHighYtCalled(timesCreateHighYtCalled + 1);
    setLoading(true);
    setEndOfResult(false);
    setTranscriptError(false);
    console.log("will create ", inputNumber, " questions ");
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const siteUrl = tabs[0].url;
      console.log("url from createHighlightsYt : ", siteUrl);

      const url = new URL(siteUrl);
      const videoId = new URLSearchParams(url.search).get("v");
      console.log("YouTube video ID: ", videoId);

      try {
        const response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("Transcription fetch operation timed out"));
          }, 60000); // 60 seconds

          fetch(`${baseUrl}/transcript/${videoId}/0/8000`).then((response) => {
            clearTimeout(timer);
            resolve(response);
          });
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("resp yt : ", response);
        const data = await response.json();

        setTranscript(data.transcription);
        console.log("Transcript : ", data.transcription);
        setHighlight(data.transcription);
        if (data.transcription == "") {
          console.log("Empty transcription:", data.transcription);
          setLoading(false);
          setEndOfResult(true);
          return;
        }

        const resp = await fetch(`${baseUrl}/create_highlight/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Create the summary of the following text :-
              ${data.transcription}
            `,
          }),
        });

        let result = await resp.json();

        console.log("res from summary api :: ", result.message);
        const parsedResult = result.message;
        console.log("parsed summary res : ", parsedResult);
        setSummaryData(parsedResult);
      } catch (error) {
        console.error("error : ", error);
        setTranscriptError(true);
      } finally {
        setLoading(false);
      }
      setHasGeneratedFlashCards(true);
    });
    console.log("timesCreateHighYtCalled : ", timesCreateHighYtCalled);
  };

  const createHighlightsSite = async () => {
    setTimesCreateHighSiteCalled(timesCreateHighSiteCalled + 1);
    setLoading(true);
    setEndOfResult(false);
    setTranscriptError(false);
    console.log("will create ", inputNumber, " questions ");
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const siteUrl = tabs[0].url;
      console.log("url from createHighlightsSite : ", siteUrl);

      const encodedUrl = encodeURIComponent(siteUrl);
      console.log("Encoded URL : ", encodedUrl);

      try {
        const response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("Text extraction fetch operation timed out"));
          }, 60000);

          fetch(`${baseUrl}/extract_article/${encodedUrl}/0/8000`).then(
            (response) => {
              clearTimeout(timer);
              resolve(response);
            }
          );
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setText(data.text);
        console.log("Text : ", data.text);
        setHighlight(data.text);
        if (data.text == "") {
          console.log("Empty Text:", data.text);
          setLoading(false);
          setEndOfResult(true);
          return;
        }

        const resp = await fetch(`${baseUrl}/create_highlight/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Create the summary of the following text :-
              ${data.text}
            `,
          }),
        });

        let result = await resp.json();

        console.log("res from summary api :: ", result.message);
        const parsedResult = result.message;
        console.log("parsed summary res : ", parsedResult);
        setSummaryData(parsedResult);
      } catch (error) {
        console.error(error);
        setTranscriptError(true);
      } finally {
        setLoading(false);
      }
      setHasExtractedText(true);
    });
    console.log("timesCreateHighSiteCalled : ", timesCreateHighSiteCalled);
  };

  const [showComp, setShowComp] = useState("Summary");
  const [renderedSelectWrapper, setRenderedSelectWrapper] = useState(false);

  const handleSelectChange = (e) => {
    setShowComp(e.target.value);
    setRenderedSelectWrapper(true);
  };

  useEffect(() => {
    console.log("use effect triggered");

    setIsYoutube(props.isYt);

    if (isYoutube === "Yes") {
      createHighlightsYt();
      setHasGeneratedFlashCards(true);
      console.log("createHighlightsYt called");
    } else if (isYoutube === "No") {
      createHighlightsSite();
      setHasExtractedText(true);
      console.log("createHighlightsSite called");
    }
  }, [isYoutube]);

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
            <option value="Summary">Summary Highlights</option>
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
      {showComp === "FlashCards" ? <FlashCards isYt={props.isYt} /> : null}
      {showComp === "Summary" ? (
        <div
          className="flashCardsWrapper"
          style={{
            width: isListView ? "" : "100%",
            padding: "20px",
          }}
        >
          {summaryData && (
            <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1 css-1cym44n text-black">
              <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                <h5 className="MuiTypography-root MuiTypography-h5 css-11604fz text-center">
                  {summaryData.title}
                </h5>
              </div>
              <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                <div className="MuiBox-root css-1vfxzmk text-center">
                  <p className="p-[10px]">{summaryData.highlight}</p>
                </div>
              </div>

              {summaryData.keypoints && (
                <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1 css-tuxzvu">
                  <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                    <div className="MuiBox-root css-jejy0m">
                      <strong className="MuiTypography-root MuiTypography-subtitle1 css-11arlvz">
                        Key Mentions
                      </strong>
                      <div className="flex flex-wrap">
                        {summaryData.keypoints.map((keypt, index) => (
                          <div
                            key={index}
                            style={{
                              flex: "1 0 20%",
                              boxSizing: "border-box",
                              padding: "10px",
                              textAlign: "center",
                              height: "fit-content",
                            }}
                            className="MuiGrid-root MuiGrid-container css-1d3bbye"
                          >
                            <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                              <div
                                className="MuiButtonBase-root MuiChip-root MuiChip-outlined MuiChip-sizeMedium MuiChip-colorDefault MuiChip-clickable MuiChip-clickableColorDefault MuiChip-outlinedDefault css-n08mak"
                                tabIndex="0"
                                role="button"
                              >
                                <span className="MuiChip-label MuiChip-labelMedium css-9iedg7">
                                  <span className="">{keypt.point}</span>
                                </span>
                                <span className="MuiTouchRipple-root css-w0pj6f"></span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

export default Summary;
