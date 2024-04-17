import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { url } from '../const';
import { Header } from '../components/Header';

export const NewSummary = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [errorMessage, setErrormessage] = useState();
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [authors, setAuthors] = useState([]);
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
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleMarkdownChange = (e) => setMarkdown(e.target.value);

  const onNewSummary = () => {
    const data = {
      title,
      markdown,
      authors,
    };

    axios
      .post(`${url}/summaries`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        setErrormessage(`変更に失敗しました。 ${err}`);
      });
    return null;
  };
  return (
    <div>
      <Header />
      <main className="newSummary">
        <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <p className="error-msg">{errorMessage}</p>
          <div className="w-full border bg-gray-200 border-gray-200 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onNewSummary)}>
                {/* eslint-disable */}
                <div>
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
                      type="text"
                      onChange={handleTitleChange}
                      id="title"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    />
                  </label>
                </div>
                <div>
                  <label htmlFor="markdown" className="text-left block mb-2 text-sm font-medium text-gray-900">
                    markdown
                    <textarea
                      {...register('markdown', {
                        required: 'please input markdown',
                      })}
                      type="text"
                      onChange={handleMarkdownChange}
                      id="markdown"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    />
                  </label>
                </div>
                <div>
                  <label htmlFor="authors">
                    <div className="block text-left">authors</div>
                    {fields.map((field, index) => (
                      <div key={field.id}>
                        <input
                          {...register(`authors.${index}.name`, {
                            required: 'please input name',
                          })}
                          type="text"
                          onChange={(e) => {
                            const newAuthors = [...authors];
                            newAuthors[index] = e.target.value;
                            setAuthors(newAuthors);
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
                {errors.name && <div>{errors.name.message}</div>}
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-2 mr-2"
                >
                  POST
                </button>
                {/* eslint-enable */}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
