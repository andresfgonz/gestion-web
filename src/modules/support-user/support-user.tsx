import React from 'react';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';
import { ChatSection } from './chats';
import { SupportSection } from './support-services';
import { Switch, Route, Redirect, NavLink, RouteProps } from 'react-router-dom';
import './support-user.scss';
import { Header } from '../../components/header';

interface ComponentProps extends RouteProps {}

export const SupportUserModule: React.FC<ComponentProps> = ({ location }) => {
  const { pathname } = location;
  const chatsPathName = '/support/chats';
  const servicesPathName = '/support/services';
  const sessionUser: SessionUser = JSON.parse(localStorage.getItem('sessionUser'));

  return (
    <div className="module-container">
      <Header />
      <Segment className="section-container">
        <Switch>
          <Redirect from="/support" to="/support/services" exact />
          <Route path="/support/chats" component={ChatSection} />
          <Route path="/support/services" component={SupportSection} />
        </Switch>
      </Segment>
    </div>
  );
};
