import { useContext } from 'react';
import get from 'lodash.get';

import CartContext from '../../../../context/Cart/CartContext';

export default function usePayOneCartContext() {
  const [cartData, { setRestPaymentMethod, setOrderInfo }] =
    useContext(CartContext);
  const cartId = get(cartData, 'cart.id');

  return {
    cartId,
    setOrderInfo,
    setRestPaymentMethod,
  };
}
