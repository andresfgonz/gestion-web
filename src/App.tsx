import React from 'react';
import logo from './logo.svg';
import './App.scss';
import 'semantic-ui-css/semantic.min.css';

import { ApolloClient, from, HttpLink, InMemoryCache, split } from 'apollo-client-preset';
import { ApolloProvider as HooksProvider } from 'react-apollo-hooks';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import { AuthModule } from './modules/auth';
import { SupportUserModule } from './modules/support-user';
import { Header } from './components/header';

const httpLink = new HttpLink({ uri: 'http://localhost:3000' });
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/subscriptions',
  options: {
    reconnect: true,
    connectionParams: () => {
      const sessionUser: any = JSON.parse((localStorage.getItem('sessionUser') as string));
      return {
        authorization: sessionUser ? sessionUser.jwtToken : null,
      };
    },
  },
});

const authMiddleware = setContext(() => {
  const sessionUser: any = JSON.parse((localStorage.getItem('sessionUser') as string));
  return {
    headers: {
      authorization: sessionUser ? sessionUser.jwtToken : null,
    },
  };
});

const client = new ApolloClient({
  link: from([authMiddleware, split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  )]),
  cache: new InMemoryCache(),
});

interface ComponentProps extends RouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<ComponentProps> = ({ component, ...rest }) => {
  const sessionUser: SessionUser = JSON.parse(localStorage.getItem('sessionUser') as string);
  return sessionUser ? <Route {...rest} component={component} /> : <Redirect to="/login" />;
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <HooksProvider client={client}>
        <BrowserRouter>
          <Switch>
            <Redirect from="/" to="/login" exact />
            <Route path="/login" component={AuthModule} />
            <PrivateRoute path="/support" component={SupportUserModule} />
          </Switch>
        </BrowserRouter>
      </HooksProvider>
    </ApolloProvider>
  );
};

export default App;
