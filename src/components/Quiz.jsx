import React from "react";
import { useState } from "react";
import "./quizstyle.css";
import { BsCheck2Circle } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import QuizResult from "./QuizResult";

const Quiz = (props) => {
  const questions = props.questions;
  const listView = props.listView;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionList, setQuestionList] = useState([0]);
  const [score, setScore] = useState(0);
  const [correctAns, setCorrectAns] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [clicked, setClicked] = useState(Array(questions.length).fill(false));
  const [selectedAnswer, setSelectedAnswer] = useState(
    Array(questions.length).fill(null)
  );

  const handleNextOption = () => {
    const newClicked = [...clicked]; // create a copy
    newClicked[currentQuestion] = true; // set as clicked for the current question
    setClicked(newClicked); // update the state

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setQuestionList([...questionList, nextQuestion]);
    } else {
      setShowResult(true);
    }
  };

  const handleAnswerOption = (isCorrect, index) => {
    const newSelectedAnswer = [...selectedAnswer]; // create a copy
    newSelectedAnswer[currentQuestion] = index; // change the answer for the current question
    setSelectedAnswer(newSelectedAnswer); // update the state

    const newClicked = [...clicked]; // create a copy
    newClicked[currentQuestion] = true; // set as clicked for the current question
    setClicked(newClicked); // update the state

    if (isCorrect) {
      setScore(score + 1);
      setCorrectAns(correctAns + 1);
    }
  };

  const handlePlayAgain = () => {
    setSelectedAnswer(Array(questions.length).fill(null)); // reset all selections
    setClicked(Array(questions.length).fill(false)); // reset all clicks
    setCurrentQuestion(0);
    setQuestionList([0]);
    setScore(0);
    setCorrectAns(0);
    setShowResult(false);
  };

  return (
    <div className={`app ${listView ? "listView" : ""}`}>
      {showResult ? (
        <QuizResult
          score={score}
          CorrectAns={correctAns}
          totalQues={questions.length}
          handlePlayAgain={handlePlayAgain}
        />
      ) : (
        <>
          {console.log("quizData in quiz comp : ", questions)}
          {questionList.map((qIndex) => (
            <div
              className={`p-0 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-md shadow ${
                listView || qIndex === currentQuestion ? "" : "hidden"
              }`}
            >
              <div className="flex flex-row justify-between bg-blue-100">
                <h5 className="p-[1rem] text-base text-gray-600 ">
                  Question {qIndex + 1} of {questions.length}
                </h5>
                <h5 className="p-[1rem] text-base text-gray-600 ">
                  Score : {score}
                </h5>
              </div>
              <div className="p-[1rem]">
                <p className="text-sm font-bold text-black">
                  {questions[qIndex].question}
                </p>
                <ul className="my-4 space-y-3 flex flex-col gap-[20px]">
                  {questions[qIndex].answerOptions.map((ans, i) => (
                    <button
                      disabled={clicked[qIndex]}
                      key={i}
                      style={{ backgroundColor: "white", borderColor: "white" }}
                      onClick={() => handleAnswerOption(ans.isCorrect, i)}
                    >
                      <li
                        style={{ width: "100%" }}
                        className={`${
                          clicked[qIndex]
                            ? i === selectedAnswer[qIndex]
                              ? ans.isCorrect
                                ? "correct"
                                : "wrong"
                              : ans.isCorrect
                              ? "correct"
                              : "button"
                            : "button"
                        }`}
                      >
                        <a
                          href="#"
                          className="flex items-center p-3 text-base font-bold text-gray-900 
                          rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow 
                          hover:bg-blue-300 "
                        >
                          <span
                            style={{ textWrap: "balance" }}
                            className="flex-1 ml-3 whitespace-nowrap font-light"
                          >
                            {ans.answerText}
                          </span>
                          <span>
                            {clicked[qIndex] ? (
                              i === selectedAnswer[qIndex] ? (
                                ans.isCorrect ? (
                                  <BsCheck2Circle />
                                ) : (
                                  <RxCrossCircled />
                                )
                              ) : ans.isCorrect ? (
                                <BsCheck2Circle />
                              ) : null
                            ) : null}
                          </span>
                        </a>
                      </li>
                    </button>
                  ))}
                  <div className="actions">
                    <button
                      style={{ border: "none" }}
                      onClick={handlePlayAgain}
                    >
                      Reset
                    </button>
                    <button
                      style={{ border: "none" }}
                      disabled={!clicked[qIndex]}
                      onClick={handleNextOption}
                    >
                      Next
                    </button>
                  </div>
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Quiz;
