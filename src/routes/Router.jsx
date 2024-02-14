import { useCookies } from 'react-cookie';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { SignUp } from '../pages/SignUp';
import { SignIn } from '../pages/SignIn';
import { Profile } from '../pages/Profile';

export const Router = () => {
  const [cookies] = useCookies();
  return (
    <HashRouter>
      <Routes>
        <Route path="/signin" element={cookies.token ? <Navigate replace to="/" /> : <SignIn />} />
        <Route path="/signup" element={cookies.token ? <Navigate replace to="/" /> : <SignUp />} />
        <Route path="/profile" element={cookies.token ? <Profile /> : <Navigate replace to="/" />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};
