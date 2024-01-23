import { useCallback } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { LOGIN_FORM, config } from '../../../../config';

import usePayOneAppContext from './usePayOneAppContext';
import usePayOneCartContext from './usePayOneCartContext';
import { _isObjEmpty } from '../utility';

export default function usePerformPlaceOrder(paymentMethodCode) {
  const { cartId } = usePayOneCartContext();
  const { isLoggedIn, setPageLoader, setErrorMessage } = usePayOneAppContext();
  console.log('perfom place order new');
  return useCallback(
    async (values, additionalData, extensionAttributes = {}) => {
      try {
        const email = _get(values, `${LOGIN_FORM}.email`);
        const paymentMethodData = {
          paymentMethod: {
            method: paymentMethodCode,
            additional_data: additionalData,
          },
        };

        if (!_isObjEmpty(extensionAttributes)) {
          _set(paymentMethodData, 'paymentMethod.extension_attributes', {
            ...extensionAttributes,
          });
        }

        if (!isLoggedIn) {
          _set(paymentMethodData, 'email', email);
        } else {
          _set(paymentMethodData, 'cartId', cartId);
        }

        setPageLoader(true);
        const response = await fetch(`${config.baseUrl}/zippayment/standard`);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (data && data.error) {
          console.log(data);
          setErrorMessage(data.message);
          return;
        }
        window.location.replace(data.redirect_uri);

        // const order = await setRestPaymentMethod(paymentMethodData, isLoggedIn);
        // console.log(order);
        // console.log('order', order);
        // setPageLoader(false);
        // performRedirect(order, data.redirect_uri);

        // if (order) {
        //   setOrderInfo(order);
        // }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          'This transaction could not be performed. Please select another payment method.'
        );
        setPageLoader(false);
      }
    },
    [isLoggedIn, setPageLoader, setErrorMessage, paymentMethodCode, cartId]
  );
}
