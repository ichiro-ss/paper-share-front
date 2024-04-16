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
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-gray-200 border-gray-300 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-left text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                edit username
              </h1>
              <p className="error-message">{errorMessage}</p>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onEdit)}>
                {/* eslint-disable */}
                <label htmlFor="name" className="text-left block mb-2 text-sm font-medium text-gray-900">
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-wihite"
                  />
                </label>
                {errors.name && (
                  <div className="text-right text-sm font-medium dark:text-red-500">{errors.name.message}</div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-2 mr-2"
                  >
                    Edit
                  </button>
                </div>
                {/* eslint-enable */}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
