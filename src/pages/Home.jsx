import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { Header } from '../components/Header';
import { url } from '../const';
// import SummariesTable from './SummariesTable';

export const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [summaries, setSummaries] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);
    axios
      .get(`${url}/summaries`, {
        headers: cookies.token
          ? {
              authorization: `Bearer ${cookies.token}`,
            }
          : {},
      })
      .then((res) => {
        setSummaries(res.data.summaries);
        setPageLoading(false);
      })
      .catch((err) => {
        navigate('/signin');
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="home">
        {cookies.token && (
          <div className="flex flex-col items-center ">
            <p className="error-msg">{errorMessage}</p>
            {/* <SummariesTable summaries={summaries} /> */}
            {pageLoading ? (
              <div className="loading custom-loader">
                <ClipLoader color="blue" size={50} aria-label="Loading Spinner" data-testid="loader" />
              </div>
            ) : (
              <ul>
                {summaries && (
                  <div>
                    {summaries.map((summary, key) => (
                      <li
                        key={summary.id}
                        className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white dark:border-gray-200"
                      >
                        <Link
                          to={`detail/${summary.id}`}
                          className="text-left block mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-900"
                        >
                          {summary.title}
                        </Link>
                        {summary.isMine && (
                          <div className="flex justify-end">
                            <Link
                              to={`edit/${summary.id}`}
                              className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              edit
                            </Link>
                          </div>
                        )}
                      </li>
                    ))}
                  </div>
                )}
              </ul>
            )}
            <Link
              to="/new"
              className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              POST SUMMARY
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
