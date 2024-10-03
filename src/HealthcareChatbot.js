import React, { useState, useEffect } from 'react';
import './healthcarecss.css';
// Function to load the knowledge base from localStorage or provide default data
const loadKnowledgeBase = () => {
  const data = localStorage.getItem('knowledgeBasehealthcare');
  if (data) {
    return JSON.parse(data);
  } else {
    // Preload some common healthcare-related questions
    return {
      questions: [
        { question: 'How can I schedule an appointment?', answer: 'You can schedule an appointment by calling our hotline at (555) 123-4567 or visiting our website.' },
        { question: 'What are your operating hours?', answer: 'Our clinic is open Monday to Friday, from 8:00 AM to 6:00 PM.' },
        { question: 'Do you accept insurance?', answer: 'Yes, we accept a variety of insurance plans. Please contact us for a full list.' },
        { question: 'Where are you located?', answer: 'We are located at 123 Health Street, Wellness City.' },
      ]
    };
  }
};

// Function to save the knowledge base to localStorage
const saveKnowledgeBase = (data) => {
  localStorage.setItem('knowledgeBase', JSON.stringify(data));
};

// Function to find the closest match to the user question
const findBestMatch = (userQuestion, questions) => {
  const threshold = 0.6; // Cutoff for similarity
  let bestMatch = null;
  let bestScore = 0;
  
  questions.forEach(q => {
    const score = similarity(userQuestion.toLowerCase(), q.toLowerCase());
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = q;
    }
  });

  return bestMatch;
};

// Function to calculate similarity between two strings
const similarity = (s1, s2) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};

// Function to calculate edit distance (Levenshtein distance)
const editDistance = (s1, s2) => {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

const HealthcareChatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState(loadKnowledgeBase());

  // Handle user input and responses
  const handleUserInput = () => {
    if (userInput.trim().toLowerCase() === 'quit') {
      setChatHistory([...chatHistory, { sender: 'User', message: userInput }]);
      setUserInput('');
      return;
    }

    const questions = knowledgeBase.questions.map((q) => q.question);
    const bestMatch = findBestMatch(userInput, questions);

    if (bestMatch) {
      const answer = knowledgeBase.questions.find((q) => q.question === bestMatch).answer;
      setChatHistory([
        ...chatHistory,
        { sender: 'User', message: userInput },
        { sender: 'Bot', message: answer },
      ]);
    } else {
      const newAnswer = prompt("I don't know the answer. Can you teach me? Type the answer or 'skip' to skip:");

      if (newAnswer && newAnswer.toLowerCase() !== 'skip') {
        const newKnowledge = {
          question: userInput,
          answer: newAnswer,
        };
        const updatedKnowledgeBase = {
          ...knowledgeBase,
          questions: [...knowledgeBase.questions, newKnowledge],
        };
        setKnowledgeBase(updatedKnowledgeBase);
        saveKnowledgeBase(updatedKnowledgeBase);

        setChatHistory([
          ...chatHistory,
          { sender: 'User', message: userInput },
          { sender: 'Bot', message: 'Thank you! I learned a new response.' },
        ]);
      } else {
        setChatHistory([
          ...chatHistory,
          { sender: 'User', message: userInput },
          { sender: 'Bot', message: "Ok, let's move on." },
        ]);
      }
    }

    setUserInput('');
  };

  useEffect(() => {
    // Save knowledge base on every update
    saveKnowledgeBase(knowledgeBase);
  }, [knowledgeBase]);

  // Handle enter key press for input submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  return (
    <div className="chatbot">
      <h2>Healthcare Customer Service Chatbot</h2>
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={chat.sender === 'Bot' ? 'bot-message' : 'user-message'}>
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="How can we assist you today?"
          onKeyDown={handleKeyDown} // Call function when 'Enter' is pressed
        />
        <button onClick={handleUserInput}>Send</button>
      </div>
    </div>
  );
};

export default HealthcareChatbot;
