import React, { useEffect } from "react";
import "./chatbot.css";

const Chatbot = () => {
  useEffect(() => {
    // Inject Material Symbols font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const timer = setTimeout(() => {
      const chatInput = document.querySelector(".chat-input textarea");
      const sendChatBtn = document.querySelector(".chat-input span");
      const chatBox = document.querySelector(".chatbox");
      const chatbotToggler = document.querySelector(".chatbot-toggler");
      const chatbotCloseBtn = document.querySelector(".close-btn");

      if (!chatInput || !sendChatBtn || !chatBox || !chatbotToggler || !chatbotCloseBtn) {
        console.error("Chatbot elements not found.");
        return;
      }

      let userMessage;
      const inputInitHeight = chatInput.scrollHeight;

      const scrollToBottom = () => {
        chatBox.scrollTo({
          top: chatBox.scrollHeight + 100,
          behavior: "smooth"
        });
      };

      const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent =
          className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
      };

      const generateResponse = () => {
        const API_KEY = "HuT3vaVysPV6z7GPTneu8YCwfdtImyRq0YDmgNjV";
        const API_URL = "https://api.cohere.ai/v1/chat";

        const messageElement = document.querySelector(".chatbox .incoming:last-child p");

        const requestBody = {
          model: "command-r",
          message: userMessage
        };

        fetch(API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        })
          .then(res => res.json())
          .then(data => {
            messageElement.classList.remove("error");
            const reply = data.text || "Oops! Something went wrong.";
            messageElement.textContent = reply;
          })
          .catch(err => {
            messageElement.classList.add("error");
            messageElement.textContent = "Error: " + (err.message || "Could not fetch response.");
          });
      };


      const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        chatBox.appendChild(createChatLi(userMessage, "outgoing"));
        scrollToBottom();

        setTimeout(() => {
          chatBox.appendChild(createChatLi("Thinking...", "incoming"));
          generateResponse();
          scrollToBottom();
        }, 600);
      };

      chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
      });

      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleChat();
        }
      });

      sendChatBtn.addEventListener("click", handleChat);
      chatbotCloseBtn.addEventListener("click", () => {
        document.body.classList.remove("show-chatbot");
      });
      chatbotToggler.addEventListener("click", () => {
        document.body.classList.toggle("show-chatbot");
      });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Toggler Button */}
      <button className="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Chat UI */}
      <div className="chatbot">
        <header>
          <h2>Chat with Us</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        <ul className="chatbox">
          <li className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
            <p>Hello there! 👋 <br />How can I help you today?</p>
          </li>
        </ul>
        <div className="chat-input">
          <textarea placeholder="Enter a message..." required></textarea>
          <span id="send-btn" className="material-symbols-outlined">send</span>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
