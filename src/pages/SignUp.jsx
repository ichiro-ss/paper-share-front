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
    <div>
      <main className="signup">
        <Header />
        <h2>sign up</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form" onSubmit={handleSubmit(onSignUp)}>
          {/* eslint-disable */}
          <label htmlFor="email">
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
            />
          </label>
          <label htmlFor="password">
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
            />
          </label>
          {errors.email && <div>{errors.email.message}</div>}
          {errors.password && <div>{errors.password.message}</div>}
          {/* eslint-enable */}
          <button type="submit" className="signup-button">
            Create
          </button>
        </form>
      </main>
    </div>
  );
};
