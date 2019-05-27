let config = require('./config.json');
let binance = require('node-binance-api')().options({
	APIKEY: config.API_KEY,
	APISECRET: config.SECRET_KEY,
	useServerTime: true
});
let total = null;
let availableTusd = null;
let availableUsdt = null;
let onOrderUsdt = null;
let onOrderTusd = null;
let data = new Date();
let buyPrice = null;
let sellPrice = null;

function getLastPrice() {
	binance.prices('BTCUSDT', (error, ticker) => {
		if (error) return console.error(error);
		console.log(`Latest BTC Price: ${ticker.BTCUSDT}`);
	});
}

function getBalance() {
	try {
		binance.balance((error, balances) => {
			if (error) return console.error(error);
			availableTusd = parseFloat(balances.TUSD.available);
			availableUsdt = parseFloat(balances.USDT.available);
			onOrderUsdt = parseFloat(balances.USDT.onOrder);
			onOrderTusd = parseFloat(balances.USDT.onOrder);
			total = availableTusd + availableUsdt + onOrderTusd + onOrderUsdt;

			console.clear();
			console.log(`BINANCE BOT
==========================================
SALDO TOTAL: ${total} USD
SALDO INICIAL: ${config.INITIAL_INVESTMENT} USD
LUCRO ATUAL: ${total - config.INITIAL_INVESTMENT} USD
Data Atual: ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`);

			setBuySell();
		});
	} catch (error) {
		console.error(error);
	}
}

function setBuySell() {
	try {
		binance.prices('TUSDUSDT', (error, ticker) => {
			if (error) return console.error(error);
			console.log('==========================================');
			console.log('Preço do TUSD: ', ticker.TUSDUSDT);
			ticker.TUSDUSDT <= config.MIN_BUY_PRICE
				? console.log(`
O preço já está favorável, vamos lucrar`)
				: console.log(`
				O preço do TUSD ainda está acima do mínimo de ${config.MIN_BUY_PRICE} que você configurou!`);

			if (ticker.TUSDUSDT <= config.MIN_BUY_PRICE && availableUsdt > 20) {
				try {
					binance.buy('TUSDUSDT', ((availableUsdt - 0.1) / ticker.TUSDUSDT).toFixed(2), ticker.TUSDUSDT);
					buyPrice = ticker.TUSDUSDT;
					sellPrice = buyPrice + config.SELL_MARGIN;
					console.log('Comprado a: ' + ticker.TUSDUSDT);
				} catch (e) {
					throw e;
				}
			}

			if (ticker.TUSDUSDT > config.MIN_BUY_PRICE && availableTusd > 20) {
				try {
					binance.sell('TUSDUSDT', (availableTusd - 0.1).toFixed(2), sellPrice);
					console.log('Vendido a: ' + sellPrice);
				} catch (e) {
					throw e;
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
}

setInterval(() => {
	getBalance();
}, 10000);
