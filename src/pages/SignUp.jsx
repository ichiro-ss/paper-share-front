import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { url } from '../const';
import { Header } from '../components/Header';
export const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrormessage] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const onSignUp = () => {
    const data = {
      loginId: email,
      password,
    };

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const { token } = res.data;
        setCookie('token', token);
        setCookie('name', data.loginId);
        navigate('/');
      })
      .catch((err) => {
        setErrormessage(`サインアップに失敗しました。 ${err}`);
        return null;
      });

    if (cookies.token) return <Navigate to="/" />;

    return null;
  };
  return (
    <main className="signup">
      <Header />
      <p className="error-message">{errorMessage}</p>
      {/* eslint-disable */}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-200 dark:border-gray-300">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-left text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
              Sign up
            </h1>
            <form onSubmit={handleSubmit(onSignUp)} className="space-y-4 md:space-y-6">
              <label htmlFor="email" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                loginID(email)
                <input
                  {...register('email', {
                    required: 'please input your email',
                    pattern: {
                      value: /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
                      message: 'please check your email',
                    },
                  })}
                  type="email"
                  onChange={handleEmailChange}
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-wihite dark:border-gray-300 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </label>
              {errors.email && (
                <p className="text-right text-sm font-medium dark:text-red-500">{errors.email.message}</p>
              )}
              <label
                htmlFor="password"
                className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                password
                <input
                  {...register('password', {
                    required: 'please input password',
                    minLength: {
                      value: 2,
                      message: 'minLength: 2',
                    },
                  })}
                  type="password"
                  onChange={handlePasswordChange}
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-white dark:border-gray-300 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </label>
              {errors.password && (
                <p className="text-right text-sm font-medium dark:text-red-500">{errors.password.message}</p>
              )}
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* eslint-enable */}
    </main>
  );
};
