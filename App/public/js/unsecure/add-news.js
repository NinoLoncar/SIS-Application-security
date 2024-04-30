window.addEventListener('load', () => {
    handleAddNewsButton();
});

function handleAddNewsButton() {
    let btnAddNews = document.getElementById("add-news-button");
    btnAddNews.addEventListener('click', async (event) => {
        event.preventDefault();
        let newsData = getNewsData();
        let isValidNewsData = validateNewsData(newsData);
        if (!isValidNewsData) {
            return;
        }
        console.log(isValidNewsData);
        let header = new Headers();
        header.set('Content-Type', 'application/json');
        let params = {
            method: "POST",
            headers: header,
            body: JSON.stringify(newsData)
        };
        const response = await fetch("http://localhost:12000/unsecure/dodaj-vijest", params);
        if (response.status == 201)
            window.location.href = "/unsecure/vijesti";
        else {
            let data = await response.json();
            let errorMessage = data.error;
            console.log(errorMessage);
        }
    })
}

function getNewsData() {
    let txtHeading = document.getElementById("news-heading");
    let txtContent = document.getElementById("news-text");
    let txtUrl = document.getElementById("image-url");
    let data = {
        title: txtHeading.value,
        content: txtContent.value,
        url: txtUrl.value,
    }
    return data;
}

function validateNewsData(newsData) {
    let errorContainer = document.getElementById("error-message");
    errorContainer.innerHTML = '';
    for (let key in newsData) {
        if (newsData[key] === null || newsData[key] === undefined || newsData[key] === '') {
            errorContainer.innerHTML += "<p>Morate popuniti sva polja!</p>";
            return false;
        }
    }
    return true;
}
