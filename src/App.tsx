import { Demo, Hero } from './components';

const App = () => {
  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>
    
      <div className="app">
        <Hero />
        <Demo />
      </div>
    </main>
  );
};

export default App;
