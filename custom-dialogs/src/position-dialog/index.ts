import {
	Position,
	Brackets,
	IBrokerWithoutRealtime,
	Trade,
} from '../../../charting_library/broker-api';

import { header } from './header';

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

export function createPositionDialog(broker: IBrokerWithoutRealtime, onResultCallback: (result: boolean) => void): HTMLElement {
	const customDialog = document.createElement('div');
	customDialog.className = 'custom-position-dialog';

	qtySection.appendChild(qtyHeader);
	qtySection.appendChild(qtyInput);

	tpSection.appendChild(tpHeader);
	tpSection.appendChild(tpInput);

	slSection.appendChild(slHeader);
	slSection.appendChild(slInput);

	okButton.addEventListener('click', (e: MouseEvent | TouchEvent) => {
		const positionId = customDialog.getAttribute('data-symbol') as string;
		const brackets = {
			takeProfit: Number(tpInput.value) || undefined,
			stopLoss: Number(slInput.value) || undefined,
		};

		if (!broker.editPositionBrackets) {
			throw new Error('should be implemented');
		}

		broker.editPositionBrackets(positionId, brackets)
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
	customDialog.appendChild(qtySection);
	customDialog.appendChild(tpSection);
	customDialog.appendChild(slSection);
	customDialog.appendChild(buttonsBlock);

	document.body.appendChild(customDialog);

	return customDialog;
}

export function showPositionDialog(customPositionDialog: HTMLElement, position: Position | Trade, brackets: Brackets): void {
	customPositionDialog.style.display = 'block';
	customPositionDialog.setAttribute('data-symbol', position.id);
	(customPositionDialog.getElementsByClassName('custom-position-dialog__qty-input')[0] as HTMLInputElement).value = String(position.qty);
	(customPositionDialog.getElementsByClassName('custom-position-dialog__tp-input')[0] as HTMLInputElement).value = (brackets.takeProfit !== undefined ? String(brackets.takeProfit) : undefined) || '';
	(customPositionDialog.getElementsByClassName('custom-position-dialog__sl-input')[0] as HTMLInputElement).value = (brackets.stopLoss !== undefined ? String(brackets.stopLoss) : undefined) || '';
}
