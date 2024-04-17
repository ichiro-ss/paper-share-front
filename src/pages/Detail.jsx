import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { url } from '../const';
import { Header } from '../components/Header';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

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
          <div className="lg:w-1/2 px-6 py-8 mx-auto md:h-screen lg:py-0">
            <h1 className="font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">{summary.title}</h1>
            <div className="text-right">
              {summary.authors?.map((author) => (
                <a key={author}> {author}</a>
              ))}
            </div>
            <div className="text-left block mb-2 text-sm font-medium text-gray-900">
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
