from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import unquote
from goose3 import Goose
import json
import openai
from pydantic import BaseModel

openai.api_key =  "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"

class Item(BaseModel):
    text: str

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.get("/transcript/{video_id}/{start_index}/{end_index}")
async def get_transcript(video_id: str, start_index: int, end_index: int):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        all_text = " ".join([entry['text'] for entry in transcript])
        if end_index >= len(all_text):
            end_index = len(all_text)
        return {"transcription": all_text[start_index:end_index]}
    except Exception as e:
        return {"error": str(e)}

@app.get("/extract_article/{url:path}/{start_index}/{end_index}")
def extract_article(url: str, start_index: int, end_index: int):
    try:
        decoded_url = unquote(url)
        goose = Goose()
        article = goose.extract(decoded_url)
        if end_index >= len(article.cleaned_text):
            end_index = len(article.cleaned_text)
        return {"text" : article.cleaned_text[start_index:end_index]}
    except Exception as e:
        return {"error": str(e)}

@app.post("/create_mcq/")
async def create_mcq(item: Item):
    answer = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo-0613",
        messages=[
            {
                "role": "system",
                "content": "You are a Teacher whose job is to create questions and answers based on a context",
            },
            { "role" : "user" , "content" : item.text}
        ],
        functions=[
            {
                "name": "create_mcq",
                "description": "Create n number of Multiple Choice Questions and Answers according to the context",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "qna": {
                            "type": "object",
                            "description": "An array of MCQ questions and answers",
                            "properties": {
                                "question": {
                                    "type": "string",
                                    "description": "The Question created",
                                },
                                "answerOptions": {
                                    "type": "object",
                                    "description": "An array of different options among which only one answer is correct",
                                    "properties": {
                                        "answerText": {
                                            "type": "string",
                                            "description": "The Current Answer, this might be correct or wrong",
                                        },
                                        "isCorrect": {
                                            "type": "boolean",
                                            "description": "Tells if the current option is correct or not",
                                        },
                                    },
                                    "required": ["answerText", "isCorrect"],
                                },
                            },
                            "required": ["question", "answerOptions"],
                        },
                    },
                    "required": ["qna"],
                },
            }
        ],
        function_call="auto",
    )
    # Load arguments string into a JSON object
    arguments_json = json.loads(
        answer["choices"][0]["message"]["function_call"]["arguments"]
    )
    print("ans in api :: ", json.dumps(arguments_json["qna"], indent=2))
    return {"message": arguments_json["qna"]}

@app.post("/create_flashcards/")
async def create_flashcards(item: Item):
    answer = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo-0613",
        messages=[
            {
                "role": "system",
                "content": "You are a Teacher whose job is to create questions and answers based on a context",
            },
            { "role" : "user" , "content" : item.text}
        ],
        functions=[
            {
                "name": "create_flashcards",
                "description": "Create n number of Flashcards question and answers based on a context",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "qna": {
                            "type": "object",
                            "description": "An array of questions and answers",
                            "properties": {
                                "question": {
                                    "type": "string",
                                    "description": "The Question created",
                                },
                                "answer": {
                                    "type": "string",
                                    "description": "The Answer for the current question",
                                },
                            },
                            "required": ["question", "answer"],
                        },
                    },
                    "required": ["qna"],
                },
            },
        ],
        function_call="auto",
    )
    # Load arguments string into a JSON object
    arguments_json = json.loads(
        answer["choices"][0]["message"]["function_call"]["arguments"]
    )
    print("ans in api :: ", json.dumps(arguments_json["qna"], indent=2))
    return {"message": arguments_json["qna"]}
