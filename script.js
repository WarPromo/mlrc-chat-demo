let hovers = ["Math Bot", "Superhero Bot", "Conversation Bot"]
let messages = ["Give me an equation.", "I am superman.", "Chat with me!"]
let ids = ["equationsolver", "chatgpt", "huggingface"]

let hoverelement = document.getElementById("dropdownhover");


let currentbot = 0;
let currentchats = []

let menuopen = false;

let hoversquares = document.getElementsByClassName("dropdownsquare")

let server = "http://127.0.0.1:5000";

function init(){
  for(var i = 0; i < ids.length; i++){

    console.log("yo blud");

    let messageholder = document.createElement("div");
    messageholder.classList.add("innermessages");
    messageholder.style.display = "none";
    currentchats.push(messageholder);

    if(i == 0){
      messageholder.style.display = "";
    }

    let title = document.createElement("p");
    title.classList.add("messagesectiontitle");
    title.innerHTML = hovers[i];
    messageholder.appendChild(title);

    recieveMessage({bot: i, message: messages[i]})

    document.getElementById("messages").appendChild(messageholder);

  }
}



function scrollbottom(){

  let messageContainer = document.getElementById("messages");
  messageContainer.scrollTop = messageContainer.scrollHeight;

}

fetch(server + "/resetchat")


function sendmessageserver(bot, content){

  console.log("sending message to server...", bot, content);

  fetch(server + "/sendmessage", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(
          {
            "bot": bot,
            "content": content
          }
      )
  }
  ).then(res => {
    return res.json()
  }).then(json => {
    setTimeout(() => {
      recieveMessage(json);
      scrollbottom();
    }, 1000)
  })


}


function recieveMessage(data){

  console.log(data);

  let bot = data.bot;
  let message = data.message;
  let messageObj = sendmessage(hovers[bot], message, "lightblue");
  let myid = bot;
  currentchats[myid].removeChild(currentchats[myid].lastChild)
  currentchats[myid].appendChild(messageObj);

  scrollbottom();


}

console.log("hello");

let botmessage = null;


function changechat(element){
  console.log("called");
  let indicator = document.getElementById("dropdownhover");

  let myid = ids.indexOf(element.id);
  indicator.innerHTML = hovers[myid];
  currentbot = myid;

  for(var i = 0; i < currentchats.length; i++){
    currentchats[i].style.display = i == myid ? "" : "none";
  }

  let child = element;
  let before = element.parentElement.children[0];
  let parent = element.parentElement;

  if(before != child){
    parent.removeChild(child);
    parent.insertBefore(child, before);
  }



  hovermenu(false);
}


function sendusermessage(author, message){

  let myobj = sendmessage(author, message, "red");

  currentchats[currentbot].appendChild(myobj);
  scrollbottom();

  sendmessageserver(currentbot, message);
  scrollbottom();

}

function sendmessage(author, message, color="gray"){

  let messagevar = document.createElement("p");

  messagevar.classList.add("usermessage")

  messagevar.innerHTML = `<span style="font-weight: bold; color: ${color}">${author}:</span> ${message}`;

  return messagevar;

}


function sendinput(e, bypass=false){

  console.log("yo");

  if(e.keyCode == 13 || bypass){

    console.log("here");

    let inputField = document.getElementById("messageinput");
    let content = inputField.value;

    if(inputField.value.length == 0) return;

    inputField.value = "";
    sendusermessage("User", content);
    setTimeout(() => {
      let element = sendmessage(hovers[currentbot], "is typing...");
      element.style.opacity = 0.5;
      currentchats[currentbot].appendChild(element)
      scrollbottom();
    }, 300)

    //inputField.disabled = true;

  }

}



function hovermenu(showmenu){

  let menu = document.getElementById("dropdownmenu")

  let indicator = document.getElementById("dropdownhover");

  if(showmenu){
    menu.style.display = "";
    indicator.style.display = "none";
  }
  else{
    menu.style.display = "none";
    indicator.style.display = "";
  }

}
