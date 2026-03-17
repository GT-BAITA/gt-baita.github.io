import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/not-found';
import { Home } from './pages';
import { AboutPage } from './pages/about';
import { Layout } from './components/layout/layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        {/* <Route path="/wayf-ux-test" element={<RandomRedirect />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
