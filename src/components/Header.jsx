import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const handleSignOut = () => {
    removeCookie('token');
    removeCookie('name');
    navigate('/signin');
  };
  return (
    <header className="header">
      <h1>Share Papers</h1>
      {cookies.token ? (
        <>
          <strong>{cookies.name}</strong>
          <button type="button" onClick={handleSignOut} className="sign-out-button">
            SIGN OUT
          </button>
        </>
      ) : (
        <Link to="/signin">
          <button type="button" className="sign-in-button">
            SIGN IN
          </button>
        </Link>
      )}
    </header>
  );
};
