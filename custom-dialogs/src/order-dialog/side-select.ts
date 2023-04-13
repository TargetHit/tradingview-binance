const sideSelectElement = document.createElement('select');
sideSelectElement.className = 'custom-order-dialog__side-select';

const buyOption = document.createElement('option');
buyOption.className = 'custom-order-dialog__side';
buyOption.value = '1';
buyOption.textContent = 'Buy';

const sellOption = document.createElement('option');
sellOption.className = 'custom-order-dialog__side';
sellOption.value = '-1';
sellOption.textContent = 'Sell';

sideSelectElement.appendChild(buyOption);
sideSelectElement.appendChild(sellOption);

export const sideSelect = sideSelectElement;
