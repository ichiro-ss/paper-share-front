import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { SignUp } from '../pages/SignUp';
import { SignIn } from '../pages/SignIn';

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};
