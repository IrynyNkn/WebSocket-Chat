(function () {
  let userName = 'default';
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

  function showMessages(data, floatRight) {
    let messageDiv = document.createElement('div');
    if (floatRight) {
      messageDiv.className = 'chatBox__chats__flex--end';
    } else {
      messageDiv.className = 'chatBox__chats__flex--start';
    }

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
    messages.scrollTop = messages.scrollHeight;
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

      showMessages(data, false);
    };
    ws.onclose = function () {
      ws = null;
    };
  }

  function getCurrentTime() {
    let curTime = new Date();
    let curMin = curTime.getMinutes();
    if (curMin < 10) {
      curMin = `0${curMin}`;
    }
    return `${curTime.getHours()}:${curMin}`;
  }

  sendBtn.onclick = function () {
    if (!ws) {
      alert('No connection :(');
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
    showMessages(user, true);
    messageInput.value = '';
  };
  getName();
  init();
})();
