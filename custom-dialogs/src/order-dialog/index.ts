import { Order, OrderTemplate, PreOrder, IBrokerWithoutRealtime } from '../../../charting_library/broker-api';

import { header } from './header';

import { sideSection } from './side-section';
import { sideHeader } from './side-header';
import { sideSelect } from './side-select';

import { orderTypeSection } from './order-type-section';
import { orderTypeHeader } from './order-type-header';
import { orderTypeSelect } from './order-type-select';

import { priceSection } from './price-section';
import { priceHeader } from './price-header';
import { priceInput } from './price-input';

import { qtySection } from './qty-section';
import { qtyHeader } from './qty-header';
import { qtyInput } from './qty-input';

import { tpSection } from './tp-section';
import { tpHeader } from './tp-header';
import { tpInput } from './tp-input';

import { slSection } from './sl-section';
import { slHeader } from './sl-header';
import { slInput } from './sl-input';

import { okButton } from './ok-button';
import { cancelButton } from './cancel-button';
import { buttonsBlock } from './buttons-block';

import './index.css';

export function createOrderDialog(broker: IBrokerWithoutRealtime, onResultCallback: (result: boolean) => void): HTMLElement {
	const customDialog = document.createElement('div');
	customDialog.className = 'custom-order-dialog';

	sideSection.appendChild(sideHeader);
	sideSection.appendChild(sideSelect);

	orderTypeSection.appendChild(orderTypeHeader);
	orderTypeSection.appendChild(orderTypeSelect);

	priceSection.appendChild(priceHeader);
	priceSection.appendChild(priceInput);

	qtySection.appendChild(qtyHeader);
	qtySection.appendChild(qtyInput);

	tpSection.appendChild(tpHeader);
	tpSection.appendChild(tpInput);

	slSection.appendChild(slHeader);
	slSection.appendChild(slInput);

	okButton.addEventListener('click', (e: MouseEvent | TouchEvent) => {
		const preOrder: PreOrder = {
			symbol: customDialog.getAttribute('data-symbol') as string,
			side: Number(sideSelect.value),
			type: Number(orderTypeSelect.value),
			qty: Number(qtyInput.value),
			takeProfit: Number(tpInput.value),
			stopLoss: Number(slInput.value),
		} as unknown as PreOrder;

		if (preOrder.type === 1) {
			preOrder.limitPrice = Number(priceInput.value);
		} else if (preOrder.type === 3) {
			preOrder.stopPrice = Number(priceInput.value);
		}

		broker.placeOrder(preOrder)
			.then(() => {
				onResultCallback(true);
			}).catch(() => {
				onResultCallback(false);
			});
	});

	cancelButton.addEventListener('click', (e: MouseEvent | TouchEvent) => {
		onResultCallback(false);
	});

	buttonsBlock.appendChild(okButton);
	buttonsBlock.appendChild(cancelButton);

	customDialog.appendChild(header);
	customDialog.appendChild(sideSection);
	customDialog.appendChild(orderTypeSection);
	customDialog.appendChild(priceSection);
	customDialog.appendChild(qtySection);
	customDialog.appendChild(tpSection);
	customDialog.appendChild(slSection);
	customDialog.appendChild(buttonsBlock);

	document.body.appendChild(customDialog);

	return customDialog;
}

export function showOrderDialog(customOrderDialog: HTMLElement, order: Order | OrderTemplate): void {
	customOrderDialog.style.display = 'block';
	customOrderDialog.setAttribute('data-symbol', order.symbol);

	if (order.side === 1 || order.side === -1) {
		const sideSelectElement = customOrderDialog.getElementsByClassName('custom-order-dialog__side-select')[0] as HTMLSelectElement;
		sideSelectElement.value = String(order.side);
	}
}
