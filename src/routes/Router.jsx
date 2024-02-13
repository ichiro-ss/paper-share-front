import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { SignUp } from '../pages/SignUp';

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};
