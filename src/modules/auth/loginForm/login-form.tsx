import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Field, Formik } from 'formik';
import { InputField } from '../../../components/input-field/input-field';
import gql from 'graphql-tag';
import './login-form.scss';
import { MutationFn, useMutation } from 'react-apollo-hooks';
import { FetchResult } from 'react-apollo';
import { withRouter } from 'react-router-dom';

interface LoginFormValues {
  username: string;
  password: string;
}

const loginFormInitialValues: LoginFormValues = {
  username: '',
  password: '',
};

const loginFormSchema = Yup.object().shape<LoginFormValues>({
  username: Yup.string().required('Este campo es requerido'),
  password: Yup.string().required('Este campo es requerido'),
});

const loginMutation = gql`
  mutation loginUser($username: String!, $password: String!) {
    sessionUser:loginUser(username: $username, password: $password) {
      jwtToken
      user {
        fullname
        roles{
          name
        }
        profileImage
      }
    }
  }
`;

export const LoginForm = withRouter(({ history }) => {

  const loginUser = useMutation(loginMutation);

  async function onFormSubmit(values: LoginFormValues) {
    const { username, password } = values;
    try {
      const { data }: FetchResult<{ sessionUser: SessionUser }> = await loginUser({
        variables: {
          username,
          password,
        },
      });

      localStorage.setItem('sessionUser', JSON.stringify(data.sessionUser));
      history.push('/support');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Segment className="login-form-container">
      <h1>Login</h1>
      <Formik
        initialValues={loginFormInitialValues}
        onSubmit={onFormSubmit}
        validationSchema={loginFormSchema}
        render={({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="login-form">
            <div className="fields-section">
              <Field name="username" component={InputField} label="Usuario" />
              <Field name="password" component={InputField} label="Contraseña" type="password"/>
            </div>
            <Button type="submit" fluid primary>Iniciar Sesion</Button>
          </Form>
        )}
      />
    </Segment>
  );
});
