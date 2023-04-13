import { IBrokerWithoutRealtime, Order } from '../../../charting_library/broker-api';
import './index.css';

export function createCancelOrderDialog(onResultCallback: (result: boolean) => void): HTMLElement {
	const cancelOrderDialog = document.createElement('div');
	cancelOrderDialog.classList.add('cancel-order-dialog');

	cancelOrderDialog.innerHTML = `
		<div class="cancel-order-dialog__header">
			Cancel Order
		</div>
		<div id="cancel-order-content" class="cancel-order-dialog__content">
		</div>
		<div class="cancel-order-dialog__confirmation-section">
			<button id="cancel-order-cancel">Cancel</button>
			<button id="cancel-order-confirm">Confirm</button>
		</div>
	`;
	document.body.appendChild(cancelOrderDialog);
	const cancelButton = document.getElementById('cancel-order-cancel');
	cancelButton?.addEventListener('click', () => {
		onResultCallback(false);
	});
	return cancelOrderDialog;
}

type CreateCancelOrderButtonListener = (order: Order, onResultCallback: (result: boolean) => void) => () => void;

export function createCancelOrderButtonListenerFactory(broker: IBrokerWithoutRealtime): CreateCancelOrderButtonListener {
	return (order: Order, onResultCallback: (result: boolean) => void) => {
		return () => {
			broker.cancelOrder(order.id)
				.then(() => {
					onResultCallback(true);
				})
				.catch(() => {
					onResultCallback(false);
				});
		};
	};
}

function createCancelOrderContent(orderContentElement: HTMLElement, order: Order): void {
	orderContentElement.innerHTML = `
		<p>Are you sure you want to cancel order ${order.id}?</p>
		<p>
			<b>Order Summary</b><br/>
			Symbol: <b>${order.symbol}</b><br/>
			Quantity: <b>${order.qty}</b><br/>
			Take Profit: <b>${order.takeProfit}</b><br/>
			Stop Loss: <b>${order.stopLoss}</b>
		</p>
	`;
}

export function showCancelOrderDialog(customCancelOrderDialog: HTMLElement, buttonListener: () => void, order: Order): void {
	customCancelOrderDialog.style.display = 'flex';
	const orderContent = document.getElementById('cancel-order-content');
	const confirmButton = document.getElementById('cancel-order-confirm');
	if (orderContent) {
		createCancelOrderContent(orderContent, order);
	}
	confirmButton?.addEventListener('click', buttonListener);
}

export function hideCancelOrderDialog(customCancelOrderDialog: HTMLElement, buttonListener: () => void): void {
	customCancelOrderDialog.style.display = 'none';
	const confirmButton = document.getElementById('cancel-order-confirm');
	confirmButton?.removeEventListener('click', buttonListener);
}
