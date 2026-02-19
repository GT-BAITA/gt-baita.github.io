import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/not-found';
import { Home } from './pages';
import RandomRedirect from './pages/redirect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wayf-ux-test" element={<RandomRedirect />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
