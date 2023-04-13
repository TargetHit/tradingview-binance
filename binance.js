class BinanceDatafeed {
  constructor(options) {
    this.binanceHost = "https://api.binance.com";
    this.debug = options.debug || false;
  }

  async binanceServerTime() {
    try {
      const response = await fetch(`${this.binanceHost}/api/v3/time`);
      const json = await response.json();
      if (this.debug) {
        console.log(json);
      }
      return json.serverTime;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch Binance server time.");
    }
  }

  async binanceSymbols() {
    try {
      const response = await fetch(`${this.binanceHost}/api/v3/exchangeInfo`);
      const json = await response.json();
      if (this.debug) {
        console.log(json);
      }
      return json.symbols;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch Binance symbols.");
    }
  }

  async binanceKlines(symbol, interval, startTime, endTime, limit) {
    const url = `${this.binanceHost}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&startTime=${startTime}&endTime=${endTime}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      throw new Error(`Unable to fetch klines for symbol ${symbol}.`);
    }
  }

  async onReady(callback) {
    try {
      const symbols = await this.binanceSymbols();
      this.symbols = symbols;
      callback({
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        supported_resolutions: [
          "1",
          "3",
          "5",
          "15",
          "30",
          "60",
          "120",
          "240",
          "360",
          "480",
          "720",
          "1D",
          "3D",
          "1W",
          "1M",
        ],
      });
    } catch (error) {
      console.error(error);
      throw new Error("Unable to initialize Binance datafeed.");
    }
  }

  async searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    userInput = userInput.toUpperCase();
    onResultReadyCallback(
      this.symbols
        .filter((symbol) => {
          return symbol.symbol.indexOf(userInput) >= 0;
        })
        .map((symbol) => {
          return {
            symbol: symbol.symbol,
            full_name: symbol.symbol,
            description: symbol.baseAsset + " / " + symbol.quoteAsset,
            ticker: symbol.symbol,
            exchange: "Binance",
            type: "crypto",
          };
        })
    );
  }

  async resolveSymbol(
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) {
    this.debug && console.log("resolveSymbol:", symbolName);

    const comps = symbolName.split(":");
    symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase();

    function pricescale(symbol) {
      for (let filter of symbol.filters) {
        if (filter.filterType === "PRICE_FILTER") {
          return Math.round(1 / parseFloat(filter.tickSize));
        }
      }
      return 1;
    }

    for (let symbol of this.symbols) {
      if (symbol.symbol === symbolName) {
        setTimeout(() => {
          onSymbolResolvedCallback({
            name: symbol.symbol,
            full_name: symbol.symbol,
            description: symbol.baseAsset + " / " + symbol.quoteAsset,
            ticker: symbol.symbol,
            exchange: "Binance",
            listed_exchange: "Binance",
            type: "crypto",
            session: "24x7",
            format: "price",
            minmov: 1,
            pricescale: pricescale(symbol),
            timezone: "UTC",
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            currency_code: symbol.quoteAsset,
          });
        }, 0);
        return;
      }
    }

    onResolveErrorCallback("not found");
  }

  async getBars(symbolInfo, resolution, periodParams, onResult, onError) {
    const interval = {
      1: "1m",
      3: "3m",
      5: "5m",
      15: "15m",
      30: "30m",
      60: "1h",
      120: "2h",
      240: "4h",
      360: "6h",
      480: "8h",
      720: "12h",
      D: "1d",
      "1D": "1d",
      "3D": "3d",
      W: "1w",
      "1W": "1w",
      M: "1M",
      "1M": "1M",
    }[resolution];

    if (!interval) {
      onError("Invalid interval");
    }

    let totalKlines = [];

    const finishKlines = () => {
      if (this.debug) {
        console.log("Total Klines", totalKlines.length);
      }

      if (totalKlines.length === 0) {
        onResult([], { noData: true });
      } else {
        onResult(
          totalKlines.map((kline) => {
            console.log("Kline", kline);
            return {
              time: kline[0],
              open: parseFloat(kline[1]),
              high: parseFloat(kline[2]),
              low: parseFloat(kline[3]),
              close: parseFloat(kline[4]),
              volume: parseFloat(kline[5]),
            };
          }),
          {
            noData: false,
          }
        );
      }
    };

    const getKlines = (from, to) => {
      this.binanceKlines(symbolInfo.name, interval, from, to, 500)
        .then((klines) => {
          totalKlines = totalKlines.concat(klines);

          console.log("klines", klines);

          if (klines.length === 500) {
            from = klines[klines.length - 1][0] + 1;
            getKlines(from, to);
          } else {
            finishKlines();
          }
        })
        .catch((err) => {
          console.error(err);
          onError("Some problem");
        });
    };

    var from_time = periodParams.from * 1000;
    var to_time = periodParams.to * 1000;

    getKlines(from_time, to_time);
  }

  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) {
    const interval = {
      1: "1m",
      3: "3m",
      5: "5m",
      15: "15m",
      30: "30m",
      60: "1h",
      120: "2h",
      240: "4h",
      360: "6h",
      480: "8h",
      720: "12h",
      D: "1d",
      "1D": "1d",
      "3D": "3d",
      W: "1w",
      "1W": "1w",
      M: "1M",
      "1M": "1M",
    }[resolution];

    const websocket = new WebSocket("wss://stream.binance.com:9443/ws");

    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${symbolInfo.name.toLowerCase()}@kline_${interval}`],
          id: 1,
        })
      );
    };

    let lastBar = null;

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (
        message.e === "kline" &&
        message.k.i === interval &&
        message.k.s === symbolInfo.name
      ) {
        const kline = message.k;
        const bar = {
          time: kline.t,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
          volume: parseFloat(kline.v),
        };

        if (!lastBar || bar.time > lastBar.time) {
          lastBar = bar;
          onRealtimeCallback(bar);
        } else if (bar.time === lastBar.time) {
          lastBar = bar;
          onRealtimeCallback(bar);
        }
      }
    };

    websocket.onerror = (event) => {
      console.error(event);
    };

    websocket.onclose = () => {
      console.log("WebSocket closed");
    };
  }

  unsubscribeBars(subscriberUID) {
    this.debug && console.log("👉 unsubscribeBars:", subscriberUID);
  }

  getServerTime(callback) {
    this.binanceServerTime()
      .then((time) => {
        callback(Math.floor(time / 1000));
      })
      .catch((err) => {
        console.error(err);
      });
  }
}