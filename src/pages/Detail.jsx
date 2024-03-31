import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { url } from '../const';
import { Header } from '../components/Header';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import './detail.scss';

export const Detail = () => {
  const [cookies] = useCookies();
  const params = useParams();
  const [summary, setSummary] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);
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
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="detail">
        <p className="error-msg">{errorMessage}</p>
        {pageLoading ? (
          <div className="loading custom-loader">
            <ClipLoader color="blue" size={50} aria-label="Loading Spinner" data-testid="loader" />
          </div>
        ) : (
          <div className="summary-detail">
            <div className="summary-detail__title">{summary.title}</div>
            <div className="summary-detail__authors">
              {summary.authors?.map((author) => (
                <a key={author}> {author}</a>
              ))}
            </div>
            <div className="markdown">
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                components={{
                  p: ({ children }) => <p style={{ marginBottom: '1em' }}>{children}</p>,
                }}
              >
                {summary.markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
