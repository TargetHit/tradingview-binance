/**
 * @module Make sure that you include Promise polyfill in your bundle to support old browsers
 * @see {@link https://caniuse.com/#search=Promise | Browsers with native Promise support}
 * @see {@link https://www.npmjs.com/package/promise-polyfill | Polyfill}
 */
import { accountSummaryColumns, ordersPageColumns, positionsPageColumns, } from './columns';
export class BrokerSample {
    constructor(host, quotesProvider) {
        this._accountManagerData = { title: 'Trading Sample', balance: 10000000, equity: 10000000, pl: 0 };
        this._positionById = {};
        this._positions = [];
        this._orderById = {};
        this._orders = [];
        this._executions = [];
        this._idsCounter = 1;
        this._quotesProvider = quotesProvider;
        this._host = host;
        this._host.setButtonDropdownActions(this._buttonDropdownItems());
        const sellBuyButtonsVisibility = this._host.sellBuyButtonsVisibility();
        if (sellBuyButtonsVisibility !== null) {
            sellBuyButtonsVisibility.subscribe(() => {
                this._host.setButtonDropdownActions(this._buttonDropdownItems());
            });
        }
        const domPanelVisibility = this._host.domPanelVisibility();
        if (domPanelVisibility) {
            domPanelVisibility.subscribe(() => {
                this._host.setButtonDropdownActions(this._buttonDropdownItems());
            });
        }
        const orderPanelVisibility = this._host.orderPanelVisibility();
        if (orderPanelVisibility) {
            orderPanelVisibility.subscribe(() => {
                this._host.setButtonDropdownActions(this._buttonDropdownItems());
            });
        }
        this._amChangeDelegate = this._host.factory.createDelegate();
        this._balanceValue = this._host.factory.createWatchedValue(this._accountManagerData.balance);
        this._equityValue = this._host.factory.createWatchedValue(this._accountManagerData.equity);
        this._amChangeDelegate.subscribe(null, (values) => {
            this._balanceValue.setValue(values.balance);
            this._equityValue.setValue(values.equity);
        });
    }
    connectionStatus() {
        return 1 /* ConnectionStatus.Connected */;
    }
    chartContextMenuActions(context, options) {
        return this._host.defaultContextMenuActions(context);
    }
    isTradable(symbol) {
        return Promise.resolve(true);
    }
    async placeOrder(preOrder) {
        const handler = (params) => {
            if (preOrder.duration) {
                // tslint:disable-next-line:no-console
                console.log('Duration are not implemented in this sample.');
            }
            this._host.activateBottomWidget();
            const order = {
                id: `${this._idsCounter++}`,
                duration: params.duration,
                limitPrice: params.limitPrice,
                profit: 0,
                qty: params.qty,
                side: params.side || 1 /* Side.Buy */,
                status: 6 /* OrderStatus.Working */,
                stopPrice: params.stopPrice,
                symbol: params.symbol,
                type: params.type || 2 /* OrderType.Market */,
                execution: params.customFields ? params.customFields['2410'] : '',
                takeProfit: params.takeProfit,
                stopLoss: params.stopLoss,
            };
            this._updateOrder(order);
            return Promise.resolve();
        };
        await handler(preOrder);
        return {};
    }
    modifyOrder(order) {
        const handler = (params) => {
            const originalOrder = this._orderById[params.id];
            if (originalOrder) {
                const modifiedOrder = { ...originalOrder };
                modifiedOrder.qty = params.qty;
                modifiedOrder.stopPrice = params.stopPrice;
                modifiedOrder.limitPrice = params.limitPrice;
                modifiedOrder.execution = params.customFields ? params.customFields['2410'] : '';
                this._updateOrder(modifiedOrder);
            }
            return Promise.resolve();
        };
        return handler(order);
    }
    editPositionBrackets(positionId, positionBrackets) {
        const handler = (id, brackets) => {
            const position = this._positionById[id];
            if (position) {
                const modifiedPosition = { ...position };
                modifiedPosition.takeProfit = brackets.takeProfit || position.takeProfit || null;
                modifiedPosition.stopLoss = brackets.stopLoss || position.stopLoss || null;
                this._updatePosition(modifiedPosition);
            }
            return Promise.resolve();
        };
        return handler(positionId, positionBrackets);
    }
    async closePosition(positionId) {
        const position = this._positionById[positionId];
        const handler = () => {
            this.placeOrder({
                symbol: position.symbol,
                side: position.side === -1 /* Side.Sell */ ? 1 /* Side.Buy */ : -1 /* Side.Sell */,
                type: 2 /* OrderType.Market */,
                qty: position.qty,
            });
        };
        await handler();
    }
    orders() {
        return Promise.resolve(this._orders.slice());
    }
    positions() {
        return Promise.resolve(this._positions.slice());
    }
    executions(symbol) {
        return Promise.resolve(this._executions
            .filter((data) => {
            return data.symbol === symbol;
        }));
    }
    async reversePosition(positionId) {
        const position = this._positionById[positionId];
        const handler = () => {
            return this.placeOrder({
                symbol: position.symbol,
                side: position.side === -1 /* Side.Sell */ ? 1 /* Side.Buy */ : -1 /* Side.Sell */,
                type: 2 /* OrderType.Market */,
                qty: position.qty * 2,
            });
        };
        await handler();
    }
    cancelOrder(orderId) {
        const order = this._orderById[orderId];
        const handler = () => {
            order.status = 1 /* OrderStatus.Canceled */;
            this._updateOrder(order);
            return Promise.resolve();
        };
        return handler();
    }
    cancelOrders(symbol, side, ordersIds) {
        const closeHandler = () => {
            return Promise.all(ordersIds.map((orderId) => {
                return this.cancelOrder(orderId);
            })).then(() => { }); // tslint:disable-line:no-empty
        };
        return closeHandler();
    }
    accountManagerInfo() {
        const summaryProps = [
            {
                text: 'Balance',
                wValue: this._balanceValue,
                formatter: "fixed" /* StandardFormatterName.Fixed */,
                isDefault: true,
            },
            {
                text: 'Equity',
                wValue: this._equityValue,
                formatter: "fixed" /* StandardFormatterName.Fixed */,
                isDefault: true,
            },
        ];
        return {
            accountTitle: 'Trading Sample',
            summary: summaryProps,
            orderColumns: ordersPageColumns,
            positionColumns: positionsPageColumns,
            pages: [
                {
                    id: 'accountsummary',
                    title: 'Account Summary',
                    tables: [
                        {
                            id: 'accountsummary',
                            columns: accountSummaryColumns,
                            getData: () => {
                                return Promise.resolve([this._accountManagerData]);
                            },
                            initialSorting: {
                                property: 'balance',
                                asc: false,
                            },
                            changeDelegate: this._amChangeDelegate,
                        },
                    ],
                },
            ],
            contextMenuActions: (contextMenuEvent, activePageActions) => {
                return Promise.resolve(this._bottomContextMenuItems(activePageActions));
            },
        };
    }
    async symbolInfo(symbol) {
        const mintick = await this._host.getSymbolMinTick(symbol);
        const pipSize = mintick; // pip size can differ from minTick
        const accountCurrencyRate = 1; // account currency rate
        const pointValue = 1; // USD value of 1 point of price
        return {
            qty: {
                min: 1,
                max: 1e12,
                step: 1,
            },
            pipValue: pipSize * pointValue * accountCurrencyRate || 1,
            pipSize: pipSize,
            minTick: mintick,
            description: '',
        };
    }
    currentAccount() {
        return '1';
    }
    async accountsMetainfo() {
        return [
            {
                id: '1',
                name: 'Test account',
            },
        ];
    }
    _bottomContextMenuItems(activePageActions) {
        const separator = { separator: true };
        const sellBuyButtonsVisibility = this._host.sellBuyButtonsVisibility();
        if (activePageActions.length) {
            activePageActions.push(separator);
        }
        return activePageActions.concat([
            {
                text: 'Show Buy/Sell Buttons',
                action: () => {
                    if (sellBuyButtonsVisibility) {
                        sellBuyButtonsVisibility.setValue(!sellBuyButtonsVisibility.value());
                    }
                },
                checkable: true,
                checked: sellBuyButtonsVisibility !== null && sellBuyButtonsVisibility.value(),
            },
            {
                text: 'Trading Settings...',
                action: () => {
                    this._host.showTradingProperties();
                },
            },
        ]);
    }
    _buttonDropdownItems() {
        const defaultActions = this._host.defaultDropdownMenuActions();
        return defaultActions.concat([
            {
                text: 'Trading Settings...',
                action: () => {
                    this._host.showTradingProperties();
                },
            },
        ]);
    }
    _createPositionForOrder(order) {
        const positionId = order.symbol;
        let position = this._positionById[positionId];
        const orderSide = order.side;
        const orderQty = order.qty;
        order.avgPrice = order.price;
        if (position) {
            const sign = order.side === position.side ? 1 : -1;
            if (sign > 0) {
                position.avgPrice = (position.qty * position.avgPrice + order.qty * order.price) / (position.qty + order.qty);
            }
            else {
                position.avgPrice = position.avgPrice;
                const amountToClose = Math.min(orderQty, position.qty);
                this._accountManagerData.balance += (order.price - position.avgPrice) * amountToClose * (position.side === -1 /* Side.Sell */ ? -1 : 1);
            }
            position.qty = position.qty + order.qty * sign;
            if (position.qty < 0) {
                position.side = position.side === -1 /* Side.Sell */ ? 1 /* Side.Buy */ : -1 /* Side.Sell */;
                position.qty *= -1;
            }
        }
        else {
            position = {
                ...order,
                id: positionId,
                avgPrice: order.price,
            };
        }
        const execution = {
            id: `${this._idsCounter++}`,
            brokerSymbol: order.brokerSymbol,
            price: order.price,
            qty: orderQty,
            side: orderSide,
            symbol: order.symbol,
            time: Date.now(),
        };
        this._executions.push(execution);
        this._host.executionUpdate(execution);
        this._updatePosition(position);
        this._recalculateAMData();
    }
    _updateOrderLast(order) {
        this._host.orderPartialUpdate(order.id, { last: order.last });
    }
    _updateOrder(order) {
        const executionChecks = {
            [-1 /* Side.Sell */]: {
                [2 /* OrderType.Market */]: () => !!order.price,
                [1 /* OrderType.Limit */]: () => order.limitPrice !== undefined && order.last >= order.limitPrice,
                [3 /* OrderType.Stop */]: () => order.stopPrice !== undefined && order.last <= order.stopPrice,
                [4 /* OrderType.StopLimit */]: () => false,
            },
            [1 /* Side.Buy */]: {
                [2 /* OrderType.Market */]: () => !!order.price,
                [1 /* OrderType.Limit */]: () => order.limitPrice !== undefined && order.last <= order.limitPrice,
                [3 /* OrderType.Stop */]: () => order.stopPrice !== undefined && order.last >= order.stopPrice,
                [4 /* OrderType.StopLimit */]: () => false,
            },
        };
        const hasOrderAlready = Boolean(this._orderById[order.id]);
        this._orderById[order.id] = order;
        if (!hasOrderAlready) {
            this._orders.push(order);
            this._subscribeData(order.symbol, order.id, (last) => {
                if (order.last === last) {
                    return;
                }
                order.last = last;
                if (order.price == null) {
                    order.price = order.last;
                }
                if (order.status === 6 /* OrderStatus.Working */ && executionChecks[order.side][order.type]()) {
                    const positionData = { ...order };
                    delete positionData.status;
                    order.price = order.last;
                    order.avgPrice = order.last;
                    this._createPositionForOrder(positionData);
                    order.status = 2 /* OrderStatus.Filled */;
                    this._updateOrder(order);
                }
                this._updateOrderLast(order);
            });
        }
        this._host.orderUpdate(order);
    }
    _updatePosition(position) {
        const hasPositionAlready = Boolean(this._positionById[position.id]);
        if (hasPositionAlready && !position.qty) {
            this._unsubscribeData(position.id);
            const index = this._positions.indexOf(position);
            if (index !== -1) {
                this._positions.splice(index, 1);
            }
            delete this._positionById[position.id];
            this._host.positionUpdate(position);
            return;
        }
        if (!hasPositionAlready) {
            this._positions.push(position);
            this._subscribeData(position.symbol, position.id, (last) => {
                if (position.last === last) {
                    return;
                }
                position.last = last;
                position.profit = (position.last - position.price) * position.qty * (position.side === -1 /* Side.Sell */ ? -1 : 1);
                this._host.plUpdate(position.symbol, position.profit);
                this._host.positionPartialUpdate(position.id, position);
                this._recalculateAMData();
            });
        }
        this._positionById[position.id] = position;
        this._host.positionUpdate(position);
    }
    _subscribeData(symbol, id, updateFunction) {
        this._quotesProvider.subscribeQuotes([], [symbol], (symbols) => {
            const deltaData = symbols[0];
            if (deltaData.s !== 'ok') {
                return;
            }
            if (typeof deltaData.v.lp === 'number') {
                updateFunction(deltaData.v.lp);
            }
        }, getDatafeedSubscriptionId(id));
    }
    _unsubscribeData(id) {
        this._quotesProvider.unsubscribeQuotes(getDatafeedSubscriptionId(id));
    }
    _recalculateAMData() {
        let pl = 0;
        this._positions.forEach((position) => {
            pl += position.profit || 0;
        });
        this._accountManagerData.pl = pl;
        this._accountManagerData.equity = this._accountManagerData.balance + pl;
        this._amChangeDelegate.fire(this._accountManagerData);
    }
}
function getDatafeedSubscriptionId(id) {
    return `SampleBroker-${id}`;
}
