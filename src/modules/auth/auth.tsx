import React from 'react';
import { Redirect } from 'react-router';
import { LoginForm } from './loginForm';
import './auth.scss';

export const AuthModule: React.FC = () => {
  const sessionUser = JSON.parse(localStorage.getItem('sessionUser'));

  return (
    <div className="auth-module">
      {sessionUser ? <Redirect to="/support" /> : <LoginForm />}
    </div>
  );
};
