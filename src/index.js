import { dates } from './utils/dates.js';

const tickersArr = [];

const generateReportBtn = document.querySelector('.generate-report-btn');
generateReportBtn.addEventListener('click', fetchStockData);

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const tickerInput = document.getElementById('ticker-input');
    console.log('Value entered: ', tickerInput.value);
    if (tickerInput.value.length > 2) {
        generateReportBtn.disabled = false;
        const newTickerStr = tickerInput.value;
        tickersArr.push(newTickerStr.toUpperCase());
        tickerInput.value = '';
        renderTickers();
    } else {
        const label = document.getElementsByTagName('label')[0];
        label.style.color = 'red';
        label.textContent =
            'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.';
    }
});

function renderTickers() {
    const tickersDiv = document.querySelector('.ticker-choice-display');
    tickersDiv.innerHTML = '';
    tickersArr.forEach((ticker) => {
        const newTickerSpan = document.createElement('span');
        newTickerSpan.textContent = ticker;
        newTickerSpan.classList.add('ticker');
        tickersDiv.appendChild(newTickerSpan);
    });
}

const loadingArea = document.querySelector('.loading-panel');
const apiMessage = document.getElementById('api-message');

async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none';
    loadingArea.style.display = 'flex';

    try {
        const stockData = await Promise.all(
            tickersArr.map(async (ticker) => {
                const response = await fetch(
                    `/api/stocks/${ticker}?from=${dates.startDate}&to=${dates.endDate}`
                );
                const data = await response.json();
                if (response.status === 200 && data) {
                    apiMessage.innerText = 'Creating report...';
                    return data;
                } else {
                    loadingArea.innerText =
                        'There was an error fetching stock data.';
                }
            })
        );
        fetchReport(stockData);
    } catch (err) {
        loadingArea.innerText = 'There was an error fetching stock data.';
        console.error('error: ', err);
    }
}

async function fetchReport(data) {
    console.log(data);
    /**
     * Challenge:
     * 1. Use the OpenAI API to generate a report advising
     * on whether to buy or sell the shares based on the data
     * that comes in as a parameter.
     *
     * 🎁 See hint.md for help!
     *
     * 🏆 Bonus points: use a try catch to handle errors.
     * **/
}
