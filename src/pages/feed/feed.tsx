import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeedOrders } from '../../services/selectors';
import { fetchFeeds } from '../../services/slices';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };
  useEffect(() => {
    handleGetFeeds();
    const timer = window.setInterval(handleGetFeeds, 5000);
    return () => {
      window.clearInterval(timer);
    };
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
