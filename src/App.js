// import './App.css';
// import Chatbot from './Chatbot';
// import HealthcareChatbot from './HealthcareChatbot';

// function App() {
//   return (
//     <>
//     <Chatbot/>
//     <HealthcareChatbot/>
//     </>
//   );
// }

// export default App;


import './App.css';
import Chatbot from './Chatbot';
import HealthcareChatbot from './HealthcareChatbot';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/chatbot">Chatbot</Link></li>
          <li><Link to="/healthcare-chatbot">Healthcare Chatbot</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/healthcare-chatbot" element={<HealthcareChatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
