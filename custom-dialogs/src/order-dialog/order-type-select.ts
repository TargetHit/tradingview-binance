const orderTypeSelectElement = document.createElement('select');
orderTypeSelectElement.className = 'custom-order-dialog__order-type-select';

const marketOption = document.createElement('option');
marketOption.className = 'custom-order-dialog__order-type';
marketOption.value = '2';
marketOption.textContent = 'Market';

const limitOption = document.createElement('option');
limitOption.className = 'custom-order-dialog__order-type';
limitOption.value = '1';
limitOption.textContent = 'Limit';

const stopOption = document.createElement('option');
stopOption.className = 'custom-order-dialog__order-type';
stopOption.value = '3';
stopOption.textContent = 'Stop';

orderTypeSelectElement.appendChild(marketOption);
orderTypeSelectElement.appendChild(limitOption);
orderTypeSelectElement.appendChild(stopOption);

export const orderTypeSelect = orderTypeSelectElement;
