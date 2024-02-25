import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useForm } from 'react-hook-form';
import { Header } from '../components/Header';
import { url } from '../const';
import './edit.scss';

export const Edit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [errorMessage, setErrorMessage] = useState();
  const [summary, setSummary] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

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
        if (!res.data.summaries) {
          navigate('/');
        }
        if (!res.data.summaries[0].isMine) {
          navigate(`/detail/${params.id}`);
        }
        setSummary(res.data.summaries[0]);
      })
      .catch((err) => {
        setErrorMessage(`failed to get data. ${err}`);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  const onEdit = () => {
    const data = {
      title: summary.title,
      markdown: summary.markdown,
    };
    axios
      .put(`${url}/summaries`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
        params: {
          id: `${params.id}`,
        },
      })
      .then((res) => {
        setSummary(res.data);
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`failed to edit. ${err}`);
      });
    return null;
  };

  const onDelete = () => {
    axios
      .delete(`${url}/summaries`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
        params: {
          id: `${params.id}`,
        },
      })
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`failed to delete. ${err}`);
      });
    return null;
  };

  return (
    <div>
      <Header />
      <main className="edit">
        <p className="error-msg">{errorMessage}</p>
        <h1>Edit</h1>
        {pageLoading ? (
          <div className="loading custom-loader">
            <ClipLoader color="blue" size={50} aria-label="Loading Spinner" data-testid="loader" />
          </div>
        ) : (
          <>
            {summary && (
              <div>
                <form className="newummary-form" onSubmit={handleSubmit(onEdit)}>
                  {/* eslint-disable */}
                  <label htmlFor="title">
                    title
                    <input
                      {...register('title', {
                        required: 'please input title',
                        maxLength: {
                          value: 30,
                          message: 'maxLength: 30',
                        },
                      })}
                      value={summary.title}
                      type="text"
                      onChange={(e) => setSummary({ ...summary, title: e.target.value })}
                      id="title"
                    />
                  </label>
                  <label htmlFor="markdown">
                    markdown
                    <input
                      {...register('markdown', {
                        required: 'please input markdown',
                      })}
                      value={summary.markdown}
                      type="text"
                      onChange={(e) => setSummary({ ...summary, markdown: e.target.value })}
                      id="markdown"
                    />
                  </label>
                  {errors.name && <div>{errors.name.message}</div>}
                  <button type="submit" className="newsummary-button">
                    POST
                  </button>
                  {/* eslint-enable */}
                  <button type="button" onClick={onDelete}>
                    DELETE
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
