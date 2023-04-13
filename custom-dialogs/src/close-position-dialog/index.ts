import { IBrokerWithoutRealtime, Position } from '../../../charting_library/broker-api';
import './index.css';

export function createClosePositionDialog(onResultCallback: (result: boolean) => void): HTMLElement {
	const closePositionDialog = document.createElement('div');
	closePositionDialog.classList.add('close-position-dialog');

	closePositionDialog.innerHTML = `
		<div class="close-position-dialog__header">
			Close Position
		</div>
		<div id="close-position-content" class="close-position-dialog__content">
			
		</div>
		<div class="close-position-dialog__confirmation-section">
			<button id="close-position-cancel">Cancel</button>
			<button id="close-position-confirm">Confirm</button>
		</div>
	`;
	document.body.appendChild(closePositionDialog);
	const cancelButton = document.getElementById('close-position-cancel');
	cancelButton?.addEventListener('click', () => {
		onResultCallback(false);
	});
	return closePositionDialog;
}

type CreateClosePositionButtonListener = (order: Position, onResultCallback: (result: boolean) => void) => () => void;

export function createClosePositionButtonListenerFactory(broker: IBrokerWithoutRealtime): CreateClosePositionButtonListener {
	return (position: Position, onResultCallback: (result: boolean) => void) => {
		return () => {
			broker.closePosition?.(position.id)
				.then(() => {
					onResultCallback(true);
				})
				.catch(() => {
					onResultCallback(false);
				});
		};
	};
}

function createClosePositionContent(positionContentElement: HTMLElement, position: Position): void {
	positionContentElement.innerHTML = `
		<p>Are you sure you want to close position ${position.id}?</p>
		<p>
			<b>Position Summary</b><br/>
			Symbol: <b>${position.symbol}</b><br/>
			Quantity: <b>${position.qty}</b><br/>
			Side: <b>${position.side}</b><br/>
			Average Price: <b>${position.avgPrice}</b>
		</p>
	`;
}

export function showClosePositionDialog(customClosePositionDialog: HTMLElement, buttonListener: () => void, position: Position): void {
	customClosePositionDialog.style.display = 'flex';
	const positionContent = document.getElementById('close-position-content');
	const confirmButton = document.getElementById('close-position-confirm');
	if (positionContent) {
		createClosePositionContent(positionContent, position);
	}
	confirmButton?.addEventListener('click', buttonListener);
}

export function hideClosePositionDialog(customClosePositionDialog: HTMLElement, buttonListener: () => void): void {
	customClosePositionDialog.style.display = 'none';
	const confirmButton = document.getElementById('close-position-confirm');
	confirmButton?.removeEventListener('click', buttonListener);
}
