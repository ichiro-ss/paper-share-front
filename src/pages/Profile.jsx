import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { url } from '../const';
import { Header } from '../components/Header';

export const Profile = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [name, setName] = useState(cookies.name);
  const [errorMessage, setErrormessage] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const handleNameChange = (e) => setName(e.target.value);

  const onEdit = () => {
    const data = {
      name,
    };

    axios
      .put(`${url}/users`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setCookie('name', res.data.name);
        navigate('/');
      })
      .catch((err) => {
        setErrormessage(`変更に失敗しました。 ${err}`);
        return null;
      });
    return null;
  };

  return (
    <div>
      <main className="profile">
        <Header />
        <h1>edit username</h1>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-form" onSubmit={handleSubmit(onEdit)}>
          {/* eslint-disable */}
          <label htmlFor="name">
            name
            <input
              {...register('name', {
                required: 'please input your name',
                maxLength: {
                  value: 30,
                  message: 'maxLength: 30',
                },
              })}
              value={name}
              type="text"
              onChange={handleNameChange}
              id="text"
            />
          </label>
          {errors.name && <div>{errors.name.message}</div>}
          <button type="submit" className="edit-button">
            Edit
          </button>
          {/* eslint-enable */}
        </form>
      </main>
    </div>
  );
};
