import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JsonPage } from './pages/JsonPage';
import { FormsPage } from './pages/FormsPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="w-[80%] min-h-screen flex flex-col">
        <div className="w-full mx-auto flex flex-col flex-1">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Navigation />
          </header>

          <main className="flex-1 flex items-center justify-center w-full">
            <Routes>
              <Route path="/" element={<JsonPage />} />
              <Route path="/forms" element={<FormsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
