[Crypto indicators]: https://crypto-indicators20.netlify.app/

# Crypto Indicators

Crypto indicators is a crypto tracker website that uses Binance's API to find a coin of your choice and apply indicators

**Link to project:** https://crypto-indicators20.netlify.app/

<img src="https://i.ibb.co/mNg83qw/ezgif-4-8ece80c788.gif" height="80%" />

## Usage

Click on an indicator of your choice. You will then be given a short description of the indicator you've chosen and at the bottom there will
be two options. One to search for a crypto coin ticker, and a dropdown menu. You must search a ticker and choose your prefer time period
from the dropdown menu in order for the graph to show up.

Since the back-end server for Crypto-indicators is hosted render.com, wait for a bit for the server to "wake up" which shouldn't take more than a few
seconds or so.

Once the graph loads, you will see the graph display OHLC along with the indicator of your choice displayed on the graph. You can also check
for buy/sell signals too. Momentum indicators like RSI and StochRSI have Overbought/Oversold signals instead.



## How It's Made:

**Tech used:** HTML, CSS, Javascript, Node.js, Express, 

I first had to figure out how to make the graph so I used Tradingview lightweight charts to display data. I then created a Node.js server
to filter out data points in the Binance api using express and then used Tulind.js to filter out said data points and make calculations
based on that. Back at the front-end, I used regular HTML and CSS to style the page in a similar UI inspired by Tradingview. Then I used
Javascript to impliment the indicators on the Tradingview view chart. To deal with parameters, I added both a search bar and a dropdown button.
Finally, I made the tradingview chart responsive for mobile use.

## Optimizations

I wanted to transform this into React at some point so the search bar can be more dynamic instead of having to "guess" which coin tickers
are acceptable. I also wanted to add a 'golden cross' indicator section. 

## Lessons Learned:

This project was my first full-stack and it really felt intimidating at first but doing this project made me finally understand Node.js A LOT better
compared to when I was only reading documentation about it. I've learned that the back-end isn't as scary and it's very straight forward compared
to front-end where things can get a little subjective.
