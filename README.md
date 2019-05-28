# Binance-Stablecoins-Bot

## Funcionamento

É bem simples. Escolha qual moeda quer utilizar e rode o respectivo arquivo .js:

        bot.js    (TUSD/USDT)
        pax.js    (PAX/USDT)
        usdc.js   (USDC/USDT)
        usds.js   (USDS/USDT)
        


O bot se aproveita das pequenas variações entre qualquer stable coin e o USDT na Binance. Em cada negociação, você ganha um pouco mais do que as taxas da Binance.

O bot está programado para comprar sempre que o preço estiver abaixo de um valor definido e vender quando o preço atingir o valor comprado + margem estipulada. 

No arquivo config.json, configure os valores (abaixo estão os valores padrão):

    "MIN_BUY_PRICE": 0.9950,  
    "SELL_MARGIN": 0.045,


** DICA: Deixe um saldo de BNB na sua carteira para pagar menos fee e, consequentemente, lucrar mais! **


## Instalação

Clone esse repositório e edite o arquivo config.json inserindo sua API key e Secret key da Binance.

Instale o NodeJS: https://nodejs.org/en/

Vá para a pasta onde baixou o bot com o terminal e execute:

```bash
npm install
```

## Utilização

Ter mais de US $20 em sua conta da Binance

Ainda na pasta do Bot

```bash
npm start
```

Seja paciente e espere seu saldo em TUSD e USDT aumentar.

## LUCROU?

Considere apoiar esta e outras iniciativas realizando uma contribuição:

        BTC: 1JscKknuB8WycWU2puQSSm1qg9KefXNFTA
        
     


## Créditos
Ideia inicial @usdkhey
Adaptações @itxtoledo

## Licença
[MIT](https://choosealicense.com/licenses/mit/)
