(function () {
  let userName;
  function getName() {
    let invalidName = true;
    while (invalidName) {
      userName = prompt('Enter your name');
      console.log(userName);
      if (userName === '' || userName === null) {
        alert('Invalid name. Please, re-enter it :)');
      } else {
        break;
      }
    }
  }

  const sendBtn = document.getElementById('send');
  const messages = document.getElementById('chats');
  const messageInput = document.getElementById('chat-input');

  let ws;

  function showMessages(data) {
    let messageDiv = document.createElement('div');
    messageDiv.className = 'chatBox__chats__flex--start';

    let message = document.createElement('div');
    message.className = 'chatBox__chats__message';
    message.innerText = `${data.message}`;

    let name = document.createElement('span');
    name.className = 'name';
    name.innerText = `${data.name}`;

    let time = document.createElement('span');
    time.className = 'time';
    time.innerText = `${data.time}`;

    messages.appendChild(messageDiv).appendChild(name);
    messages.appendChild(messageDiv).appendChild(message);
    messages.appendChild(messageDiv).appendChild(time);
  }

  function showMyMessage(data) {
    let messageDiv = document.createElement('div');
    messageDiv.className = 'chatBox__chats__flex--end';
    let message = document.createElement('div');
    message.className = 'chatBox__chats__message';
    message.innerText = `${data.message}`;

    let name = document.createElement('span');
    name.className = 'name';
    name.innerText = `${data.name}`;

    let time = document.createElement('span');
    time.className = 'time';
    time.innerText = `${data.time}`;

    messages.appendChild(messageDiv).appendChild(name);
    messages.appendChild(messageDiv).appendChild(message);
    messages.appendChild(messageDiv).appendChild(time);
  }

  function init() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      console.log('CONNECTION OPENED!');
    };
    ws.onmessage = ({ data }) => {
      data = JSON.parse(data);
      console.log(data);

      showMessages(data);
    };
    ws.onclose = function () {
      ws = null;
    };
  }

  function getCurrentTime() {
    let curTime = new Date();
    return `${curTime.getHours()}:${curTime.getMinutes()}`;
  }

  sendBtn.onclick = function () {
    if (!ws) {
      showMessages('No connection :(');
      return;
    }

    if (messageInput.value === '' || messageInput.value === null) {
      return;
    }

    let user = {
      name: userName,
      message: messageInput.value,
      time: getCurrentTime()
    };

    ws.send(JSON.stringify(user));
    showMyMessage(user);
    messageInput.value = '';
  };
  getName();
  init();
})();
