import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { url } from '../const';
// import SummariesTable from './SummariesTable';

export const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [summaries, setSummaries] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  useEffect(() => {
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
      })
      .catch((err) => {
        setErrorMessage(`failed to get data. ${err}`);
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
          <div className="new-paper">
            <Link to="/new">本を投稿</Link>
          </div>
        </>
      )}
    </div>
  );
};
