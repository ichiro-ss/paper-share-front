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
    <div className="home">
      <Header />
      {cookies.token && (
        <>
          <p className="error-msg">{errorMessage}</p>
          <h2>summaries</h2>
          {/* <SummariesTable summaries={summaries} /> */}
          {pageLoading ? (
            <div className="loading custom-loader">
              <ClipLoader color="blue" size={50} aria-label="Loading Spinner" data-testid="loader" />
            </div>
          ) : (
            <>
              {summaries && (
                <div className="summary-list__table-container">
                  <table className="summary-list__table">
                    <thead className="summary-list__table-head">
                      <tr>
                        <th>タイトル</th>
                      </tr>
                    </thead>
                    <tbody className="summary-list__table-body">
                      {summaries.map((summary, key) => (
                        <tr key={summary.id}>
                          <td>
                            <Link to={`detail/${summary.id}`}>{summary.title}</Link>
                          </td>
                          {summary.isMine && <Link to={`edit/${summary.id}`}>edit</Link>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          <div className="new-summary">
            <Link to="/new">POST SUMMARY</Link>
          </div>
        </>
      )}
    </div>
  );
};
