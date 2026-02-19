import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' end className={clsx(styles.link, 'mr-10')}>
            <BurgerIcon
              type={
                pathname === '/' || pathname.startsWith('/ingredients')
                  ? 'primary'
                  : 'secondary'
              }
            />
            <p className='text text_type_main-default ml-2'>Конструктор</p>
          </NavLink>
          <NavLink to='/feed' className={styles.link}>
            <ListIcon
              type={pathname.startsWith('/feed') ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <Link to='/' className={styles.logo}>
          <Logo className='' />
        </Link>
        <NavLink
          to='/profile'
          className={clsx(styles.link, styles.link_position_last)}
        >
          <ProfileIcon
            type={pathname.startsWith('/profile') ? 'primary' : 'secondary'}
          />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
