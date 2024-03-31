import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { url } from '../const';
import { Header } from '../components/Header';
import './newSummary.scss';

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
        <h1>NewSummary</h1>
        <p className="error-msg">{errorMessage}</p>
        <form className="newsummary-form" onSubmit={handleSubmit(onNewSummary)}>
          {/* eslint-disable */}
          <div>
            <label htmlFor="title">
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
              />
            </label>
          </div>
          <div>
            <label htmlFor="markdown">
              markdown
              <textarea
                {...register('markdown', {
                  required: 'please input markdown',
                })}
                type="text"
                onChange={handleMarkdownChange}
                id="markdown"
              />
            </label>
          </div>
          <div>
            <label htmlFor="authors">
              authors
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
                  <button type="button" onClick={() => remove(index)}>
                    delete
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append('')}>
                add
              </button>
            </label>
          </div>
          {errors.name && <div>{errors.name.message}</div>}
          <button type="submit" className="newsummary-button">
            POST
          </button>
          {/* eslint-enable */}
        </form>
      </main>
    </div>
  );
};
