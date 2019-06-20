import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import './header.scss';
import { RouteProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

interface ComponentProps extends RouteProps {}

export const Header: React.ComponentType<ComponentProps> = withRouter(({ location, history }) => {
  const { pathname } = location;
  const chatsPathName = '/support/chats';
  const servicesPathName = '/support/services';
  const sessionUser: SessionUser = JSON.parse(localStorage.getItem('sessionUser'));
  const { user: { roles } } = sessionUser;
  const isSupport = roles.some(({ name }) => name === 'SUPPORT');

  console.log('is:', isSupport);

  function closeSession() {
    localStorage.removeItem('sessionUser');
    history.push('/login');
  }

  return (
    <Menu fluid pointing className="app-header">
      {isSupport && (
        <NavLink to={chatsPathName}>
          <Menu.Item name="Chats" active={pathname === chatsPathName} icon="comments outline" />
        </NavLink>
      )}
      <NavLink to={servicesPathName}>
        <Menu.Item name="Servicios" active={pathname === servicesPathName}
                   icon="comments outline" />
      </NavLink>
      <Menu.Menu position="right">
        <Menu.Item>
          <img src={sessionUser.user.profileImage} className="user-image" />
        </Menu.Item>
        <Dropdown item text={sessionUser.user.fullname}>
          <Dropdown.Menu>
            <Dropdown.Item onClick={closeSession}>Cerrar Sesión</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
});
