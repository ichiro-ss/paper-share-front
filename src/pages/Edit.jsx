import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useForm, useFieldArray } from 'react-hook-form';
import { Header } from '../components/Header';
import { url } from '../const';

export const Edit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [errorMessage, setErrorMessage] = useState();
  const [summary, setSummary] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const { fields, prepend, append, remove } = useFieldArray({
    control,
    name: 'authors',
  });

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
      authors: summary.authors,
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
        <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <p className="error-msg">{errorMessage}</p>
          {pageLoading ? (
            <div className="loading custom-loader">
              <ClipLoader color="blue" size={50} aria-label="Loading Spinner" data-testid="loader" />
            </div>
          ) : (
            <>
              {summary && (
                <div className="w-full border bg-gray-200 border-gray-200 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onEdit)}>
                      {/* eslint-disable */}
                      <label htmlFor="title" className="text-left block mb-2 text-sm font-medium text-gray-900">
                        title
                        <input
                          {...register('title', {
                            required: 'please input title',
                            maxLength: {
                              value: 120,
                              message: 'maxLength: 120',
                            },
                          })}
                          value={summary.title}
                          type="text"
                          onChange={(e) => setSummary({ ...summary, title: e.target.value })}
                          id="title"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        />
                      </label>
                      <label htmlFor="markdown" className="text-left block mb-2 text-sm font-medium text-gray-900">
                        markdown
                        <textarea
                          {...register('markdown', {
                            required: 'please input markdown',
                          })}
                          value={summary.markdown}
                          type="text"
                          onChange={(e) => setSummary({ ...summary, markdown: e.target.value })}
                          id="markdown"
                        />
                      </label>
                      <div>
                        <label htmlFor="authors">
                          <div className="block text-left">authors</div>
                          {fields.map((field, index) => (
                            <div key={field.id}>
                              <input
                                {...register(`authors.${index}.name`, {
                                  required: 'please input name',
                                })}
                                value={summary.authors[index]}
                                type="text"
                                onChange={(e) => {
                                  const newAuthors = [...summary.authors];
                                  newAuthors[index] = e.target.value;
                                  setSummary({ ...summary, authors: newAuthors });
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-gray-800 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-2 mr-2"
                              >
                                DELETE
                              </button>
                            </div>
                          ))}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => append('')}
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-2 mr-2"
                            >
                              ADD
                            </button>
                          </div>
                        </label>
                      </div>
                      {errors.name && (
                        <div className="text-right text-sm font-medium dark:text-red-500">{errors.name.message}</div>
                      )}
                      <div className="flex justify-evenly">
                        <button
                          type="submit"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-2 mr-2"
                        >
                          POST
                        </button>
                        {/* eslint-enable */}
                        <button
                          type="button"
                          onClick={onDelete}
                          className="text-gray-800 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-2 mr-2"
                        >
                          DELETE
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
