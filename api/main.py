from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import unquote
from goose3 import Goose

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

@app.post("/ask_query/")
async def ask_query(item: Item):
    print(item.text)
    answer = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages=[
            { "role" : "user" , "content" : item.text}
        ]
    )
    print("ans in api :: ", answer["choices"][0]["message"]["content"])
    return {"message": answer["choices"][0]["message"]["content"]}
