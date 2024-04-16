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
      <div className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link className="flex items-center self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Share Papers
          </Link>
          <div className="flex items-center lg:order-2">
            {cookies.token ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                >
                  {cookies.name}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/signin">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
