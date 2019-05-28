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
let priceTusd = null;
let pricePax = null;
let priceUsdc = null;
let priceUsds = null;

function getBestStable() {
	binance.prices((error, ticker) => {
		if (error) return console.error(error);
		priceTusd = ticker.TUSDUSDT;
		pricePax = ticker.PAXUSDT;
		priceUsdc = ticker.USDCUSDT;
		priceUsds = ticker.USDSUSDT;
	});
}

function getLastPrice() {
	binance.prices('BTCUSDT', (error, ticker) => {
		if (error) return console.error(error);
		console.log(`Latest BTC Price: ${ticker.BTCUSDT}`);
	});
}

async function getBalance() {
	try {
		await binance.balance((error, balances) => {
			if (error) return console.error(error);
			availableTusd = parseFloat(balances.TUSD.available);
			availableUsdt = parseFloat(balances.USDT.available);
			onOrderUsdt = parseFloat(balances.USDT.onOrder);
			onOrderTusd = parseFloat(balances.USDT.onOrder);
			total = availableTusd + availableUsdt + onOrderTusd + onOrderUsdt;
			getBestStable();
			console.clear();
			console.log(`BINANCE BOT - USDS
==========================================
SALDO TOTAL: ${total} USD
SALDO INICIAL: ${config.INITIAL_INVESTMENT} USD
LUCRO ATUAL: ${total - config.INITIAL_INVESTMENT} USD
Data Atual: ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}
Preços das stables: TUSD: ${priceTusd} || PAX: ${pricePax} || USDC: ${priceUsdc} || USDS: ${priceUsds}
Preço Mínimo de Compra: ${config.MIN_BUY_PRICE} ----- Margem de Venda: ${config.SELL_MARGIN}`);

			setBuySell();
		});
	} catch (error) {
		console.error(error);
	}
}

function setBuySell() {
	try {
		binance.prices('USDSUSDT', (error, ticker) => {
			if (error) return console.error(error);
			console.log('==========================================');
			ticker.USDSUSDT <= config.MIN_BUY_PRICE
				? console.log(`O preço já está favorável, vamos lucrar`)
				: console.log(`O preço do USDS ainda está acima do mínimo de ${config.MIN_BUY_PRICE} configurado.`);

			if (ticker.USDSUSDT <= config.MIN_BUY_PRICE && availableUsdt > 20) {
				try {
					binance.buy('USDSUSDT', ((availableUsdt - 0.1) / ticker.USDSUSDT).toFixed(2), ticker.USDSUSDT);
					buyPrice = ticker.USDSUSDT;
					sellPrice = buyPrice + config.SELL_MARGIN;
					console.log('Comprado a: ' + ticker.USDSUSDT);
				} catch (e) {
					throw e;
				}
			}

			if (ticker.USDSUSDT > config.MIN_BUY_PRICE && availableTusd > 20) {
				try {
					binance.sell('PAXUSDT', (availableTusd - 0.1).toFixed(2), sellPrice);
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
