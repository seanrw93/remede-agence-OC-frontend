import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import Transactions from './pages/Transactions';
import UserProfile from './pages/UserProfile';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/account/:id" element={<Transactions />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
