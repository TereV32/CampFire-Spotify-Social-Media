import './App.css';
import { Main } from './components/main/main';
import baseUrl from './config';

function App() {

  console.log(baseUrl)

  return (
    <div className="App">
      {<Main />}
    </div>
  );
}

export default App;
