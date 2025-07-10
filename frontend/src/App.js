import './App.css';
import Routers from './Routes/Routers';

 import ChatBot from './components/ChatBot/ChatBot.jsx';

function App() {
  // Keep your existing commented code if you plan to use it later
  return (
    <div>
        {/* All Website Routers - URLs */}
        <Routers/>
        
        {/* Add ChatBot component here */}
        <ChatBot />
    </div>

  );
}

export default App;