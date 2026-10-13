import { dates } from './utils/dates.js';

let tickersArr = [];

const generateReportBtn = document.querySelector('.generate-report-btn');
const inputForm = document.getElementById('ticker-input-form');
const tickersDiv = document.querySelector('.ticker-choice-display');
const tickerInput = document.getElementById('ticker-input');
const actionPanel = document.querySelector('.action-panel');
const loadingArea = document.querySelector('.loading-panel');
const outputPanel = document.querySelector('.output-panel');
const apiMessage = document.getElementById('api-message');
const goBackBtn = document.querySelector('.go-back-btn');

generateReportBtn.addEventListener('click', fetchStockData);
inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    processTickers();
});
goBackBtn.addEventListener('click', goBack);

function processTickers() {
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
}

function renderTickers() {
    tickersDiv.innerHTML = '';
    tickersArr.forEach((ticker) => {
        const newTickerSpan = document.createElement('span');
        newTickerSpan.textContent = ticker;
        newTickerSpan.classList.add('ticker');
        tickersDiv.appendChild(newTickerSpan);
    });
}

async function fetchStockData() {
    actionPanel.style.display = 'none';
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

async function fetchReport(stockData) {
    try {
        const response = await fetch('/api/googlegenai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: JSON.stringify(stockData),
                systemInstruction:
                    "You are a trading guru. Given the stock price data below, write a report of no more than 100 words describing each stock's performance and recommending whether to buy, hold, or sell.",
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(
                data.error || `Request failed (${response.status})`
            );
        }
        console.log('Data: ', data);
        renderReport(data.text);
    } catch (error) {
        console.error('Error fetching stock report:', error);
        loadingArea.innerText = 'There was an error fetching the stock report.';
    }
}

function renderReport(output) {
    loadingArea.style.display = 'none';
    outputPanel.style.display = 'flex';
    const reportResult = document.querySelector('.report-result');
    reportResult.textContent = output;
    reportResult.style.display = 'flex';
}

function goBack() {
    tickersArr = [];
    tickersDiv.innerHTML = '';
    tickersDiv.textContent = 'Your tickers will appear here...';
    generateReportBtn.disabled = true;
    actionPanel.style.display = 'flex';
    loadingArea.style.display = 'none';
    outputPanel.style.display = 'none';
}
