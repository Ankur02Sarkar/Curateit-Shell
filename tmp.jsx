/* global chrome */
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { MdSaveAlt } from "react-icons/md";
import QuizComp from "./QuizComp";
import Flashcards from "./Flashcards";
import "./summary.css";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { CiBoxList } from "react-icons/ci";
const Summary = (props) => {
  const [isListView, setListView] = useState(true);
  const [showComp, setShowComp] = useState("Summary");
  const [renderedSelectWrapper, setRenderedSelectWrapper] = useState(false);
  const [isYoutube, setIsYoutube] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const handleSelectChange = (e) => {
    setShowComp(e.target.value);
    setRenderedSelectWrapper(true);
  };

  const summaryData = [
    {
      title: "Learn Java in 14 Minutes",
      highlight: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae,
      necessitatibus delectus hic nobis sunt totam facilis nulla
      perspiciatis id veritatis eius eum tempora temporibus
      reprehenderit vel illo, molestiae, quos quibusdam! Deserunt
      laborum modi sapiente molestias quo eius, consequuntur iste!
      Doloremque cupiditate ipsa nisi accusantium nemo earum placeat vel
      eos maiores velit quia autem, officia tempora expedita impedit
      fuga? Magni, atque. Impedit blanditiis corrupti ab ad eum, placeat
      fugiat assumenda, eveniet mollitia a voluptas. Delectus deserunt
      enim laborum similique, exercitationem dicta quibusdam adipisci
      commodi, eaque dolore pariatur nostrum, sed ad itaque! Quas maxime
      repellat deserunt id esse tempora impedit nostrum praesentium
      accusamus, expedita commodi minus consequatur eligendi, facilis ut
      porro accusantium, voluptatum fugit eum qui eos placeat earum
      fuga? Eum, et! Deserunt quibusdam assumenda maiores quidem dolorem
      expedita quod odio ex, accusantium laudantium soluta dignissimos
      non provident, animi, voluptate tempora odit sequi perferendis
      nulla debitis. Et fugiat cupiditate reprehenderit nihil hic?
      `,
      pic: "https://i.ytimg.com/vi/RRubcjpTkks/maxresdefault.jpg",
      tag: ["Java", "Data Type", "Logic"],
    },
  ];
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
  const savePdf = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight() - 20;
    const pageWidth = doc.internal.pageSize.getWidth() - 20;
    let yCoordinate = 10;

    summaryData.forEach((item, index) => {
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
  useEffect(() => {
    console.log("use effect triggered");
    setIsYoutube(props.isYt);
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
            {summaryData.length > 0 && (
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
      {showComp === "FlashCards" ? <Flashcards isYt={props.isYt} /> : null}
      {showComp === "Summary" ? (
        <div className="text-black bg-white">
          {summaryData.map((summary) => (
            <div
              key={summary.title}
              className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1 css-1cym44n"
            >
              <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                <h5 className="MuiTypography-root MuiTypography-h5 css-11604fz text-center">
                  {summary.title}
                </h5>
              </div>
              <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                <img
                  className="MuiBox-root css-oafhs5"
                  src={summary.pic}
                  alt={summary.title}
                ></img>
              </div>
              <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                <div className="MuiBox-root css-1vfxzmk">
                  <p className="p-[10px]">{summary.highlight}</p>
                </div>
              </div>
              <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1 css-tuxzvu">
                <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                  <div className="MuiBox-root css-jejy0m">
                    <strong className="MuiTypography-root MuiTypography-subtitle1 css-11arlvz">
                      Key Mentions
                    </strong>
                    <div className="MuiGrid-root MuiGrid-container css-1d3bbye">
                      <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                        {summary.tag.map((tag, index) => (
                          <div
                            key={index}
                            className="MuiButtonBase-root MuiChip-root MuiChip-outlined MuiChip-sizeMedium MuiChip-colorDefault MuiChip-clickable MuiChip-clickableColorDefault MuiChip-outlinedDefault css-n08mak"
                            tabIndex="0"
                            role="button"
                          >
                            <span className="MuiChip-label MuiChip-labelMedium css-9iedg7">
                              <span className="">{tag}</span>
                            </span>
                            <span className="MuiTouchRipple-root css-w0pj6f"></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default Summary;
