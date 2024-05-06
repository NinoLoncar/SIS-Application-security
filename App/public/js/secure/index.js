window.addEventListener('load', async () => {
    getUserBalance();
    handleActivate2FAButton();
    getNewestNews();
    handleAddFundsButton();
});

async function getUserBalance() {
    const response = await fetch("http://localhost:12000/sesija/ulogirani-korisnik");
    if (response.status == 200) {
        let user = await response.json();
        let txtBalance = document.getElementById("balance-value");
        txtBalance.innerText = `${user.balance}$`;
    }
}

async function handleActivate2FAButton() {
    let btnActivate2fa = document.getElementById("activate-2fa-button");
    await setActivate2FAButtonText(btnActivate2fa);
    btnActivate2fa.addEventListener('click', async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:12000/secure/2fa");
        if (response.status == 201) {
            const imgElement = document.createElement('img');
            imgElement.src = await response.text();
            const imgContainer = document.getElementById('qr-container');
            imgContainer.appendChild(imgElement);
        }
        setActivate2FAButtonText(btnActivate2fa);
    })
}

async function setActivate2FAButtonText(btnActivate2fa) {
    const response = await fetch("http://localhost:12000/sesija/ulogirani-korisnik");
    if (response.status == 200) {
        let user = await response.json();
        if (user.activated_2fa) {
            btnActivate2fa.textContent = "Isključi 2FA";
        }
        else {
            btnActivate2fa.textContent = "Uključi 2FA";
        }
    }
}

function handleAddFundsButton() {
    let btnAddFunds = document.getElementById("add-funds-button");
    btnAddFunds.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = "/secure/transakcije";
    })
}

async function getNewestNews() {
    const response = await fetch("http://localhost:12000/najnovije-vijesti");
    const data = await response.json();

    if (response.status == 200 && data != undefined) {
        fillPageWithNews(data)
    }
}
function fillPageWithNews(data) {
    let newsContainer = document.getElementById('news');

    let firstNewsElement = document.createElement('div');
    firstNewsElement.id = 'news-1';
    firstNewsElement.dataset.id = data[0].id;
    firstNewsElement.classList.add('news-element');

    let firstImageElement = document.createElement('img');
    firstImageElement.classList.add('news-image');
    firstImageElement.src = data[0].url;
    firstNewsElement.appendChild(firstImageElement);

    let firstTitleElement = document.createElement('h2');
    firstTitleElement.textContent = data[0].heading;
    firstNewsElement.appendChild(firstTitleElement);

    let firstTextElement = document.createElement('div');
    firstTextElement.classList.add('news-text');
    firstTextElement.textContent = data[0].content;
    firstNewsElement.appendChild(firstTextElement);

    newsContainer.appendChild(firstNewsElement);
    /*----------------*/
    let secondNewsElement = document.createElement('div');
    secondNewsElement.id = 'news-2';
    secondNewsElement.dataset.id = data[1].id;
    secondNewsElement.classList.add('news-element');

    let secondImageElement = document.createElement('img');
    secondImageElement.classList.add('news-image');
    secondImageElement.src = data[1].url;
    secondNewsElement.appendChild(secondImageElement);

    let secondTitleElement = document.createElement('h2');
    secondTitleElement.textContent = data[1].heading;
    secondNewsElement.appendChild(secondTitleElement);

    let secondTextElement = document.createElement('div');
    secondTextElement.classList.add('news-text');
    secondTextElement.textContent = data[1].content;
    secondNewsElement.appendChild(secondTextElement);

    newsContainer.appendChild(secondNewsElement);

    addEventListenersOnNews(firstNewsElement, secondNewsElement);
}

function addEventListenersOnNews(firstNews, secondNews) {
    firstNews.addEventListener('click', (event) => {
        event.preventDefault();
        let newsId = firstNews.dataset.id;
        window.location.href = `/secure/vijesti/${newsId}`;
    });
    secondNews.addEventListener('click', (event) => {
        event.preventDefault();
        let newsId = secondNews.dataset.id;
        window.location.href = `/secure/vijesti/${newsId}`;
    });
}