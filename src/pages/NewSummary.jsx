import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleMarkdownChange = (e) => setMarkdown(e.target.value);

  const onNewSummary = () => {
    const data = {
      title,
      markdown,
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
                    value: 30,
                    message: 'maxLength: 30',
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
