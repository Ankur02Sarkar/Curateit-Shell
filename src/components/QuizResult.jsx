import React from "react";

const QuizResult = (props) => {
  return (
    <div
      className="score-section rounded-md bg-white w-fit mt-[10px] p-[30px]"
      style={{ color: "black" }}
    >
      <h2 className="text-green-500 font-bold">Well Done!</h2>
      <h4 className="">
        Achieved Score : {props.score}/{1 * props.totalQues}{" "}
      </h4>
      <h4 className="">
        Correct Questions {props.CorrectAns} out of {props.totalQues}
      </h4>
      <button
        onClick={props.handlePlayAgain}
        className="bg-blue-500 m-auto border-none rounded-md p-2"
        style={{ width: "fit-content" }}
      >
        Play Again
      </button>
    </div>
  );
};

export default QuizResult;
