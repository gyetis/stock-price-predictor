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
}
