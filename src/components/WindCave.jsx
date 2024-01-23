import React, { useCallback, useEffect } from 'react';
import { shape, func } from 'prop-types';
import _get from 'lodash.get';
import { paymentMethodShape } from '../../../../utils/payment';
import RadioInput from '../../../../components/common/Form/RadioInput';
import usePerformPlaceOrder from '../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../hooks/usePayOneCheckoutFormContext';
import usePaymentMethodCartContext from '../../../../components/paymentMethod/hooks/usePaymentMethodCartContext';
import usePaymentMethodFormContext from '../../../../components/paymentMethod/hooks/usePaymentMethodFormContext';

function WindCave({ method, selected, actions }) {
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const { submitHandler } = usePaymentMethodFormContext();
  const isSelected = method.code === selected.code;
  const performPlaceOrder = usePerformPlaceOrder(method.code);
  const { methodList } = usePaymentMethodCartContext();
  const placeOrderWithPayPal = useCallback(
    (values) => performPlaceOrder(values),
    [performPlaceOrder]
  );

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithPayPal);
  }, [method, registerPaymentAction, placeOrderWithPayPal]);

  const handlePaymentMethodSelection = async (event) => {
    const methodSelected = _get(methodList, `${event.target.value}.code`);
    await actions.change(event);
    await submitHandler(methodSelected);
  };

  if (!isSelected) {
    return (
      <RadioInput
        value={method.code}
        label={method.title}
        name="paymentMethod"
        checked={isSelected}
        onChange={handlePaymentMethodSelection}
      />
    );
  }
  return (
    <div>
      <div>
        <RadioInput
          value={method.code}
          label={method.title}
          name="paymentMethod"
          checked={isSelected}
          onChange={handlePaymentMethodSelection}
        />
      </div>
    </div>
  );
}
WindCave.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};
export default WindCave;
