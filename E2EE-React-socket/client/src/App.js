import './App.css';
import socketIO from 'socket.io-client';
import React, { useState, useEffect }  from "react";

const socket = socketIO.connect('http://localhost:4000');
const CryptoJS = require('crypto-js');
const passphrase = '123';

const encryptWithAES = (text) => {
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

function App() {
  const [text, setText] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('messageResponse', (data) =>
    setMessages([...messages, decryptWithAES(data)]))
  }, [socket, messages]);

  const handleSubmit = (event) => {
    event.preventDefault()
    setText(event.target.message.value)
    socket.emit("message", encryptWithAES(text));
  }
    
  return (
    <div>
      <div className="message__container">
      {messages.map((message) => (
        <div>
              <div >
                <p>{message}</p>
              </div>
              </div>
            ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input
            type="text"
            name="message"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
  </div>
  );
}

export default App;