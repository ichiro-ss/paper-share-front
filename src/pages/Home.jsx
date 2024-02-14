import { useCookies } from 'react-cookie';
import { Header } from '../components/Header';
export const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  return (
    <div className="home">
      <Header />
      <h2>papers</h2>
      <div>{cookies.name}</div>
    </div>
  );
};
