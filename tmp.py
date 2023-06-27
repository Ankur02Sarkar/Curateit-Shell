import time
import openai
import json

openai.api_key = "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"
start = time.time()

answer = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-0613",
    messages=[
        {
            "role": "system",
            "content": "You are a Teacher whose job is to create questions and answers based on a context",
        },
        {
            "role": "user",
            "content": """ Create 7 question and answer based on the following context :-

          The Battle of Raymond was fought on May 12, 1863, near Raymond, Mississippi, during the Vicksburg campaign of the American Civil War. Initial Union attempts to capture the strategically important Mississippi River city of Vicksburg failed. Beginning in late April 1863, Union Major General Ulysses S. Grant led another try. After crossing the river into Mississippi and winning the Battle of Port Gibson, Grant began moving east, intending to turn back west and attack Vicksburg. A portion of Grant's army consisting of Major General James B. McPherson's 10,000 to 12,000-man XVII Corps moved northeast towards Raymond. The Confederate commander of Vicksburg, Lieutenant General John C. Pemberton, ordered Brigadier General John Gregg and his 3,000 to 4,000-strong brigade from Jackson to Raymond.
Gregg's brigade contacted the leading elements of McPherson's corps on May 12. Neither commander was aware of the strength of his opponent, and Gregg acted aggressively, thinking McPherson's force was small enough that his men could easily defeat it. McPherson, in turn, overestimated Confederate strength and responded cautiously. The early portions of the battle pitted two brigades of Major General John A. Logan's division against the Confederate force, and the battle was matched relatively evenly. Eventually, McPherson brought up Brigadier General John D. Stevenson's brigade and Brigadier General Marcellus M. Crocker's division. The weight of superior Union numbers eventually began to crack the Confederate line, and Gregg decided to disengage. McPherson's men did not immediately pursue.
The battle at Raymond changed Grant's plans for the Vicksburg campaign, leading him to first focus on neutralizing the Confederate forces at Jackson before turning against Vicksburg. After successfully capturing Jackson, Grant's men pivoted west, drove Pemberton's force into the defenses of Vicksburg, and forced a Confederate surrender on July 4, ending the Siege of Vicksburg. The site of the Battle of Raymond was added to the National Register of Historic Places in 1972, and public interpretation of a portion of the site is provided by the Friends of Raymond. Historians Ed Bearss, Michael Ballard, and Timothy B. Smith have criticized McPherson's handling of the battle.
See also: Mississippi River campaigns and Vicksburg campaign
Early in the Civil War, Union military leadership developed the Anaconda Plan, which was a strategy to defeat the Confederate States of America (a significant component of which was controlling the Mississippi River.)[1] Much of the Mississippi Valley fell under Union control in early 1862 after the capture of New Orleans, Louisiana, and several land victories.[2] The strategically important city of Vicksburg, Mississippi was still in Confederate hands, serving both as a strong defensive position by commanding the river and as the linchpin between the two halves of the Confederacy. Union Navy elements were sent upriver from New Orleans in May to try to take the city, a move that was ultimately unsuccessful.[3] In late June, a joint army-navy expedition returned to make another campaign against Vicksburg.[4] Union Navy leadership decided that the city could not be taken without more infantrymen, who were not forthcoming. An attempt to dig a canal across a meander of the river, bypassing Vicksburg, failed.[5][6]
In late November, about 40,000 Union infantry commanded by Major General Ulysses S. Grant began moving south towards Vicksburg from a starting point in Tennessee. Grant ordered a retreat after a supply depot and part of his supply line were destroyed during the Holly Springs Raid and Forrest's West Tennessee Raid. Meanwhile, another arm of the expedition under the command of Major General William T. Sherman left Memphis, Tennessee on the same day as the Holly Springs Raid and traveled down the Mississippi River. After diverting up the Yazoo River, Sherman's men began skirmishing with Confederate soldiers defending a line of hills above the Chickasaw Bayou. A Union attack on December 29 was defeated decisively at the Battle of Chickasaw Bayou, and Sherman's men withdrew on January 1, 1863.[7]
Further information: Confederate order of battle and Union order of battle
Grant's Operations against Vicksburg
Beginning of Grant's campaign
In early 1863, Grant planned further operations against Vicksburg. Some of these plans included revisiting the 1862 canal site attempt, a new plan to cut a canal into the Mississippi River near Lake Providence, Louisiana, and navigating through bayous to bypass Vicksburg. Expeditions sent through the Yazoo River and Steele's Bayou failed to find a viable alternate route.[8][9] By March 29, these alternatives were abandoned by Grant, leaving him with the choices of attacking Vicksburg from directly across the river, pulling back to Memphis and then attacking overland from the north, or marching south on the Louisiana side of the river and then crossing it below the city. Attacking the enemy from across the river, Grant could have risked heavy casualties, but pulling his men back to Memphis could have been interpreted as a retreat and politically disastrous. This led Grant to choose the southward movement. On April 29, Union Navy ships bombarded Confederate river batteries at Grand Gulf in preparation for a crossing, but they did not silence the position. Grant crossed his men the next day even farther south, at Bruinsburg, Mississippi.[10]
Grant drove inland with 24,000 men, defeating an 8,000-man Confederate blocking force at Port Gibson on May 1; the batteries at Grand Gulf were abandoned the next day.[11] Grant could either move north towards Vicksburg or head east and later turn to the west and attack Vicksburg from this direction. He chose the latter option as it provided a better chance of capturing Vicksburg's Confederate garrison and its commander, Lieutenant General John C. Pemberton. Grant put his plan in motion by having Sherman's XV Corps cross the Mississippi River at the now-abandoned Grand Gulf position and then drive towards Auburn. To Sherman's left, Major General John A. McClernand's XIII Corps covered the crossing of the Big Black River, and on the Union right was Major General John B. McPherson's XVII Corps. McPherson, who lacked experience in leading a sizable body of men in independent command, was directed to advance to Raymond via Utica.[12][13][14] McPherson's advance was resisted by little other than militia.[15] Union cavalrymen raided the New Orleans, Jackson and Great Northern Railroad, damaging almost 1.5 miles (2.4 km) of the line.[16] On May 11, Grant ordered McPherson to take his command to Raymond and resupply there while maintaining the impression that he was targeting Jackson.[15]
Gregg's approach to Raymond
Pemberton responded to the Union movements by moving his forces north along the course of the Big Black River, shadowing the Union movements but never crossing the river.[17] Meanwhile, reinforcements were brought up from elsewhere in the Confederacy and concentrated at Jackson. General Joseph E. Johnston was ordered on May 10 to travel to Jackson to command the growing force,[13] which would eventually amount to about 6,000 men.[18][19] One of these units was the brigade of Brigadier General John Gregg, which had been sent to Jackson from Port Hudson, Louisiana.[20] In his only aggressive action at the time,[17] Pemberton sent Gregg a telegram ordering him to take his brigade to Raymond with hopes of intercepting a Union unit rumored to be at Utica.[21] Both Gregg and Pemberton believed the Union force was only a single brigade, which would have numbered about 1,500 men. In reality, the Union force at Utica was McPherson's corps, which numbered about 10,000 to 12,000 men.[22][23] Expecting the main Union assault to come at the Big Black River, Pemberton believed that any movements towards Jackson via Raymond were simply feints. 
           """,
        },
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
        # {
        #     "name": "create_mcq",
        #     "description": "Create n number of Multiple Choice Questions and Answers according to the context",
        #     "parameters": {
        #         "type": "object",
        #         "properties": {
        #             "qna": {
        #                 "type": "object",
        #                 "description": "An array of MCQ questions and answers",
        #                 "properties": {
        #                     "question": {
        #                         "type": "string",
        #                         "description": "The Question created",
        #                     },
        #                     "answerOptions": {
        #                         "type": "object",
        #                         "description": "An array of different options among which only one answer is correct",
        #                         "properties": {
        #                             "answerText": {
        #                                 "type": "string",
        #                                 "description": "The Current Answer, this might be correct or wrong",
        #                             },
        #                             "isCorrect": {
        #                                 "type": "boolean",
        #                                 "description": "Tells if the current option is correct or not",
        #                             },
        #                         },
        #                         "required": ["answerText", "isCorrect"],
        #                     },
        #                 },
        #                 "required": ["question", "answerOptions"],
        #             },
        #         },
        #         "required": ["qna"],
        #     },
        # }
    ],
    function_call="auto",
)

print(answer)

print("\n")
print("\n")

# Load arguments string into a JSON object
arguments_json = json.loads(
    answer["choices"][0]["message"]["function_call"]["arguments"]
)

# Print QnA field
print(json.dumps(arguments_json["qna"], indent=2))
end = time.time()
print("time elasped : ", end - start)
