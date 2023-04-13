import {
	AccountManagerColumn,
	OrderTableColumn,
	OrderStatusFilter,
	StandardFormatterName,
	FormatterName,
} from '../../charting_library/broker-api';

export const ordersPageColumns: OrderTableColumn[] = [
	{
		label: 'Symbol',
		formatter: StandardFormatterName.Symbol,
		id: 'symbol',
		dataFields: ['symbol', 'symbol'],
	},
	{
		label: 'Side',
		id: 'side',
		dataFields: ['side'],
		formatter: StandardFormatterName.Side,
	},
	{
		label: 'Type',
		id: 'type',
		dataFields: ['type', 'parentId', 'stopType'],
		formatter: StandardFormatterName.Type,
	},
	{
		label: 'Qty',
		alignment: 'right',
		id: 'qty',
		dataFields: ['qty'],
		help: 'Size in lots',
	},
	{
		label: 'Limit Price',
		alignment: 'right',
		id: 'limitPrice',
		dataFields: ['limitPrice'],
		formatter: StandardFormatterName.FormatPrice,
	},
	{
		label: 'Stop Price',
		alignment: 'right',
		id: 'stopPrice',
		dataFields: ['stopPrice'],
		formatter: StandardFormatterName.FormatPrice,
	},
	{
		label: 'Last',
		alignment: 'right',
		id: 'last',
		dataFields: ['last'],
		formatter: StandardFormatterName.FormatPriceForexSup,
		highlightDiff: true,
	},
	{
		label: 'Execution',
		id: 'execution',
		dataFields: ['execution'],
	},
	{
		label: 'Status',
		id: 'status',
		dataFields: ['status'],
		formatter: StandardFormatterName.Status,
		supportedStatusFilters: [OrderStatusFilter.All],
	},
	{
		label: 'Order id',
		id: 'id',
		dataFields: ['id'],
	},
];

export const positionsPageColumns: AccountManagerColumn[] = [
	{
		label: 'Symbol',
		formatter: StandardFormatterName.Symbol,
		id: 'symbol',
		dataFields: ['symbol', 'symbol'],
	},
	{
		label: 'Side',
		id: 'side',
		dataFields: ['side'],
		formatter: StandardFormatterName.Side,
	},
	{
		label: 'Qty',
		alignment: 'right',
		id: 'qty',
		dataFields: ['qty'],
		help: 'Size in lots',
	},
	{
		label: 'Avg Fill Price',
		alignment: 'right',
		id: 'avgPrice',
		dataFields: ['avgPrice'],
		formatter: StandardFormatterName.FormatPrice,
	},
	{
		label: 'Last',
		alignment: 'right',
		id: 'last',
		dataFields: ['last'],
		formatter: StandardFormatterName.FormatPriceForexSup,
		highlightDiff: true,
	},
	{
		label: 'Profit',
		alignment: 'right',
		id: 'pl',
		dataFields: ['pl'],
		formatter: StandardFormatterName.Profit,
	},
];

export const accountSummaryColumns: AccountManagerColumn[] = [
	{
		label: 'Title',
		notSortable: true,
		id: 'title',
		dataFields: ['title'],
		formatter: 'custom_uppercase' as FormatterName,
	},
	{
		label: 'Balance',
		alignment: 'right',
		id: 'balance',
		dataFields: ['balance'],
		formatter: StandardFormatterName.Fixed,
	},
	{
		label: 'Open PL',
		alignment: 'right',
		id: 'pl',
		dataFields: ['pl'],
		formatter: StandardFormatterName.Profit,
		notSortable: true,
	},
	{
		label: 'Equity',
		alignment: 'right',
		id: 'equity',
		dataFields: ['equity'],
		formatter: StandardFormatterName.Fixed,
		notSortable: true,
	},
];
