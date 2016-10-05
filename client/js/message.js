if ("WebSocket" in window) {
  webSocketConn();
} else {
  alert("Your browser doesn't support WebSockets");
}

function webSocketConn() {
  dataDay.innerHTML = new Date().toDateString();
  loadHistory();
  var socket = io.connect();
  socket.on('connect', function(data) {
    socket.emit('join', 'Message from client');
  });
    
  socket.on('broad', function(data) {
    addMessage(data, formatAMPM(new Date()));
  });
  
  form.addEventListener("submit", function() {
    sendMessage(event, socket);
  }, false);
}

function addMessage(str, commentsTime) {
  var mess = document.createElement("p");
  mess.innerHTML = "[" + commentsTime + "] " +  str;
  chat.appendChild(mess);
  chat_input.value = "";
  mess.scrollIntoView(false);
}

function sendMessage(e, socket) {
    e.preventDefault();
    var message = chat_input.value;
    socket.emit('messages', message);
    SaveMessageInDB(message);
}

function SaveMessageInDB(message) {
    if (message) {
        var xhr = new XMLHttpRequest();
        var params = 'text=' + encodeURIComponent(message);
        var url = "https://chat-valeriary.c9users.io/comment?" + params;
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4) {
                console.log = xhr.responseText;
            } 
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
}

function loadHistory() {
    var xhr = new XMLHttpRequest();
    var url = "https://chat-valeriary.c9users.io/load?";
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
           var history = JSON.parse(xhr.responseText);
           for (var i = 0; i < history.length; i++) {
             addMessage(history[i].userComment, history[i].time);
           } 
        } 
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var strTime = hours + ':' + minutes + ':' +seconds + ' ' + ampm;
  
  return strTime;
}