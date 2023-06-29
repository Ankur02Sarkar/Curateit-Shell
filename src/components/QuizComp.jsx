/* global chrome */
import React, { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./FlashCards.css";
import Quiz from "./Quiz";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const QuizComp = () => {
  const [transcript, setTranscript] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isYoutube, setIsYoutube] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [text, setText] = useState("");
  const [inputNumber, setInputNumber] = useState(2);
  const [currentIndexFlashCards, setCurrentIndexFlashCards] = useState(0);
  const [currentIndexTextExtraction, setCurrentIndexTextExtraction] =
    useState(0);
  const [hasGeneratedFlashCards, setHasGeneratedFlashCards] = useState(false);
  const [hasExtractedText, setHasExtractedText] = useState(false);
  const [endOfResult, setEndOfResult] = useState(false);
  const [radioSelection, setRadioSelection] = useState("flashCardsWrapper");
  const [transcriptError, setTranscriptError] = useState(false);

  const baseUrl = process.env.REACT_APP_PYTHON_API;
  console.log("Base Url : ", baseUrl);
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
    const pageHeight = doc.internal.pageSize.getHeight() - 20; // consider some margin
    const pageWidth = doc.internal.pageSize.getWidth() - 20; // consider some margin
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

      // Check if adding the question lines would exceed page height
      if (yCoordinate + questionLines.length * 7 > pageHeight) {
        doc.addPage();
        yCoordinate = 10; // Reset y coordinate to top of new page
      }

      doc.text(questionLines, 10, yCoordinate);
      yCoordinate = yCoordinate + questionLines.length * 7; // consider line spacing for question text

      // Check if adding the answer lines would exceed page height
      if (yCoordinate + answerLines.length * 7 > pageHeight) {
        doc.addPage();
        yCoordinate = 10; // Reset y coordinate to top of new page
      }

      doc.text(answerLines, 10, yCoordinate);
      yCoordinate = yCoordinate + answerLines.length * 7; // consider line spacing for answer text

      // Add space between different QA pairs, and check if it would exceed page height
      if (yCoordinate + 10 > pageHeight) {
        doc.addPage();
        yCoordinate = 10; // Reset y coordinate to top of new page
      } else {
        yCoordinate = yCoordinate + 10;
      }
    });
    doc.save("quiz.pdf");
  };

  const createQuestionAnswers = async () => {
    setLoading(true);
    setEndOfResult(false);
    setTranscriptError(false); // Resetting the error status before a new request

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
              currentIndexFlashCards + 8000
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

        if (currentIndexFlashCards + 8000 >= data.transcription.length) {
          setCurrentIndexFlashCards(0); // Reset index to 0 if we've reached the end
        } else {
          setCurrentIndexFlashCards(currentIndexFlashCards + 8000);
        }

        setTranscript(data.transcription);
        console.log("Transcript : ", data.transcription);

        if (data.transcription == "") {
          console.log("Empty transcription:", data.transcription);
          setLoading(false);
          setEndOfResult(true);
          return;
        }

        const resp = await fetch(`${baseUrl}/create_mcq/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Create ${inputNumber} question and answer based on the following context :- 
              ${data.transcription}
            `,
          }),
        });
        let result = await resp.json();
        console.log("res from mcq api :: ", result.message);
        const parsedResult = result.message;
        console.log("parsed mcq res : ", parsedResult);
        setQuizData((oldQuizData) => [...oldQuizData, ...parsedResult]);
        setCurrentIndexFlashCards(currentIndexFlashCards + 8000);
      } catch (error) {
        console.error("error : ", error);
        setTranscriptError(true);
      } finally {
        setLoading(false);
      }
      setHasGeneratedFlashCards(true);
    });
  };

  const handleTextExtraction = async () => {
    setLoading(true);
    setEndOfResult(false);
    setTranscriptError(false); // Resetting the error status before a new request

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const siteUrl = tabs[0].url;
      console.log("url from handleTextExtraction : ", siteUrl);

      const encodedUrl = encodeURIComponent(siteUrl);
      console.log("Encoded URL : ", encodedUrl);

      try {
        const response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("Text extraction fetch operation timed out"));
          }, 60000); // 60 seconds

          fetch(
            `${baseUrl}/extract_article/${encodedUrl}/${currentIndexTextExtraction}/${
              currentIndexTextExtraction + 8000
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

        if (currentIndexTextExtraction + 8000 >= data.text.length) {
          setCurrentIndexTextExtraction(0); // Reset index to 0 if we've reached the end
        } else {
          setCurrentIndexTextExtraction(currentIndexTextExtraction + 8000);
        }

        setText(data.text);
        console.log("Text : ", data.text);

        if (data.text == "") {
          console.log("Empty Text:", data.text);
          setLoading(false);
          setEndOfResult(true);
          return;
        }

        const resp = await fetch(`${baseUrl}/create_mcq/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Create ${inputNumber} question and answer based on the following context :- 
              ${data.text}
            `,
          }),
        });

        let result = await resp.json();

        console.log("res from mcq api :: ", result.message);
        const parsedResult = result.message;
        console.log("parsed mcq res : ", parsedResult);
        setQuizData((oldQuizData) => [...oldQuizData, ...parsedResult]);
        setCurrentIndexTextExtraction(currentIndexTextExtraction + 8000);
      } catch (error) {
        console.error(error);
        setTranscriptError(true);
      } finally {
        setLoading(false);
      }
      setHasExtractedText(true);
    });
  };

  return (
    <div className="flashCardsWrapper">
      {isYoutube === "" ? <button onClick={checkYoutube}>Start</button> : null}

      <button onClick={savePdf}>Save as PDF</button>

      {isYoutube === "Yes" && (
        <>
          {/* <input
            type="number"
            id="textExtractionInput"
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Number of Questions"
          /> */}
          <button onClick={createQuestionAnswers} disabled={loading}>
            {loading && hasGeneratedFlashCards
              ? "Generating More Questions..."
              : hasGeneratedFlashCards
              ? "Generate More Questions"
              : "Generate Questions"}
          </button>
        </>
      )}
      {isYoutube === "No" && (
        <>
          {/* <input
            type="number"
            id="textExtractionInput"
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Number of Questions"
          /> */}
          <button onClick={handleTextExtraction} disabled={loading}>
            {loading && hasExtractedText
              ? "Extracting More Text..."
              : hasExtractedText
              ? "Extract More Text"
              : "Extract Text"}
          </button>
        </>
      )}
      {loading && <h3 style={{ color: "black" }}>Creating Flashcards...</h3>}
      {endOfResult && <h3 style={{ color: "black" }}>No more Content</h3>}
      {transcriptError && (
        <h3 style={{ color: "black" }}>
          Could not fetch transcriptions for the current video
        </h3>
      )}
      {console.log("before passing quizdata to comp : ", quizData)}

      {quizData.length > 0 && (
        <>
          {console.log("passing quizdata to comp : ", quizData)}
          <Quiz questions={quizData} />
        </>
      )}
    </div>
  );
};

export default QuizComp;
