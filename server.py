from flask import Flask, json
from flask import request
from flask_cors import CORS, cross_origin
#from transformers import pipeline

import openai;
openai.api_key = ""
gpt_original = "You are Superman, act like it. Start your first message with 'I am superman!' or something cliche like that."
gpt_conversation = gpt_original;

regular_original = "Talk casually with the user."
regular_conversation = regular_original

messages = [[],[],[]]
message_names = ["Equation Solver", "ChatGPT", "HuggingFace"];

api = Flask(__name__)
cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'

#huggingface_bot = pipeline("text-generation", model = 'gpt2')


@api.route('/sendmessage', methods=['POST'])
@cross_origin()
def process_message():

  data = request.get_json(force=True);

  bot = data["bot"];
  message = data["content"]
  messages[bot].append(message)

  if bot == 0:
      answer = "I don't know"

      try:
          answer = process_equationsolver(message)
      except:
          print("Error with input");

      return json.dumps({

        "bot": bot,
        "message": process_equationsolver(message)

      });

  if bot == 1:
       return json.dumps({

         "bot": bot,
         "message": process_gpt(message)

       });

  if bot == 2:
      return json.dumps({

        "bot": bot,
        "message": process_regular(message)

      })

@api.route('/resetchat', methods=['GET'])
@cross_origin()
def reset_chat():
    global regular_original;
    global regular_conversation;
    global gpt_original;
    global gpt_conversation;
    print("reset the chat");
    regular_conversation = regular_original;
    gpt_conversation = gpt_original;

    return json.dumps({"res": "success"})


def process_gpt(message):
    global gpt_conversation;
    print(gpt_conversation);

    gpt_conversation += "\nUser: " + message;
    gpt_conversation += "\nSuperman: "

    chat = openai.Completion.create(
        model="text-davinci-003", prompt=gpt_conversation, max_tokens=1024, stop=None,n=1
    )

    reply = chat.choices[0].text.strip()

    gpt_conversation += reply;

    return reply;

def process_regular(message):
    global regular_conversation;
    print(regular_conversation);

    regular_conversation += "\nUser: " + message;
    regular_conversation += "\nSuperman: "

    chat = openai.Completion.create(
        model="text-davinci-003", prompt=regular_conversation, max_tokens=1024, stop=None,n=1
    )

    reply = chat.choices[0].text.strip()

    regular_conversation += reply;

    return reply;

def process_equationsolver(message):
    answer = "";
    try:
        answer = number_compute(message);
    except:
        return "I don't know"

    if answer == None:
        return "I don't know"

    if type(answer) is bool:

        if answer == True:
            return "The statement is true."
        else:
            return "The statement is false."
    else:
        return "The answer is " + str(answer) + "."




def number_compute(question):

    numbers = "1234567890";


    first_occurance = -1;
    last_occurance = -1;

    input = "";

    for i in range(len(question)):
        if question[i] in numbers:
            if first_occurance == -1:
                first_occurance = i;
                last_occurance = i;
            else:
                last_occurance = i;

    for j in range(first_occurance, last_occurance + 1):
        input += question[j];

    if "=" in input:
        parts = input.split("=")
        return int(parts[1]) == int(simple_solve(parts[0]));
    else:
        return simple_solve(input)

def simple_solve(equation):

    operations = "*-+^/x"

    for char in operations:

        if char in equation:

            parts = equation.split(char);
            num1 = int(parts[0]);
            num2 = int(parts[1]);

            if char == "*" or char == "x":
                return num1 * num2;

            if char == "/":
                return num1 / num2;

            if char == "-":
                return num1 - num2;

            if char == "+":
                return num1 + num2;

            if char == "^":
                return num1 ** num2;





if __name__ == '__main__':
    api.run(host='127.0.0.1', port=5000)
