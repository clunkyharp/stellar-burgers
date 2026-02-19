import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectProfileOrders } from '../../services/selectors';
import { fetchProfileOrders } from '../../services/slices';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);
  useEffect(() => {
    dispatch(fetchProfileOrders());
    const timer = window.setInterval(
      () => dispatch(fetchProfileOrders()),
      5000
    );
    return () => {
      window.clearInterval(timer);
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
