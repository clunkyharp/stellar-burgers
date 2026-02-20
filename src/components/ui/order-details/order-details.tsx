import React from 'react';
import styles from './order-details.module.css';
import doneImg from '../../../images/done.svg';
import { OrderDetailsUIProps } from './type';

const statusText: { [key: string]: string } = {
  cancelled: 'Отменён',
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#E52B1A';
    case 'done':
      return '#00CCCC';
    default:
      return '#F2F2F3';
  }
};

export const OrderDetailsUI: React.FC<OrderDetailsUIProps> = ({
  orderNumber,
  status
}) => (
  <>
    <h2 className={`${styles.title} text text_type_digits-large mt-2 mb-4`}>
      {orderNumber}
    </h2>
    <p className='text text_type_main-medium'>идентификатор заказа</p>
    {status && (
      <p
        className='text text_type_main-default mt-2 mb-4'
        style={{ color: getStatusColor(status) }}
      >
        {statusText[status] || status}
      </p>
    )}
    <img
      className={styles.img}
      src={doneImg}
      alt='изображение статуса заказа.'
    />
    <p className='text text_type_main-default mb-1'>
      Ваш заказ начали готовить
    </p>
    <p className={`${styles.text} text text_type_main-default`}>
      Дождитесь готовности на орбитальной станции
    </p>
  </>
);
