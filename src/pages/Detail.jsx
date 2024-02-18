import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { url } from '../const';
import { Header } from '../components/Header';
import ReactMarkdown from 'react-markdown';

export const Detail = () => {
  const [cookies] = useCookies();
  const params = useParams();
  const [summary, setSummary] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/summaries`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
        params: {
          id: `${params.id}`,
        },
      })
      .then((res) => {
        setSummary(res.data.summaries[0]);
      })
      .catch((err) => {
        setErrorMessage(`failed to get data. ${err}`);
      });
  }, []);

  return (
    <div>
      <main className="detail">
        <Header />
        <p className="error-msg">{errorMessage}</p>
        <div className="summary-detail">
          <div className="summary-detail__title">{summary.title}</div>
          <ReactMarkdown>{summary.markdown}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
};
