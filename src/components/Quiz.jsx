import React from "react";
import { useState } from "react";
import "./quizstyle.css";
import { BsCheck2Circle } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import QuizResult from "./QuizResult";
const Quiz = (props) => {
  const questions = props.questions;
  //useState Hook
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAns, setCorrectAns] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleNextOption = () => {
    setClicked(false);
    setSelectedAnswer(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const handleAnswerOption = (isCorrect, index) => {
    if (isCorrect) {
      setScore(score + 5);
      setCorrectAns(correctAns + 1);
    }
    setSelectedAnswer(index);
    setClicked(true);
  };

  const handlePlayAgain = () => {
    setSelectedAnswer(null);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAns(0);
    setShowResult(false);
  };

  return (
    <>
      <div className="app">
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
            <div className="p-0 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-md shadow ">
              <div className="flex justify-between bg-blue-100">
                <h5 className="p-[1rem] text-base text-gray-600 ">
                  Question {currentQuestion + 1} of {questions.length}
                </h5>
                <h5 className="p-[1rem] text-base text-gray-600 ">
                  Score : {score}
                </h5>
              </div>
              <div className="p-[1rem]">
                <p className="text-sm font-bold text-black">
                  {questions[currentQuestion].question}
                </p>
                <ul className="my-4 space-y-3 flex flex-column gap-[20px]">
                  {questions[currentQuestion].answerOptions.map((ans, i) => {
                    return (
                      <>
                        <button
                          disabled={clicked}
                          key={i}
                          style={{
                            backgroundColor: "white",
                            borderColor: "white",
                          }}
                          onClick={() => handleAnswerOption(ans.isCorrect, i)}
                        >
                          <li
                            style={{ width: "100%" }}
                            className={`${
                              clicked
                                ? i === selectedAnswer
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
                                {clicked ? (
                                  i === selectedAnswer ? (
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
                      </>
                    );
                  })}
                  <div className="actions">
                    <button onClick={handlePlayAgain}>Back</button>
                    <button disabled={!clicked} onClick={handleNextOption}>
                      Next
                    </button>
                  </div>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Quiz;
