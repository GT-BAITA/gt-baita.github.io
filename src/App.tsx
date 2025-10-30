import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/not-found';
import { Home } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
