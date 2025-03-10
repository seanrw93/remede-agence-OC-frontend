import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';
import { UserProfile } from './pages/UserProfile';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Layout />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
