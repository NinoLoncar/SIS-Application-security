window.addEventListener('load', () => {
    generatePage();
});

async function generatePage() {
    let newsId = getIdFromUrl();
    let newsData = await getNewsData(newsId);
    console.log("data", newsData);
    fillPageWithNewsData(newsData);
}

function getIdFromUrl() {
    let currentUrl = window.location.href;
    let urlParts = currentUrl.split("/");
    let id = urlParts[urlParts.length - 1];
    return id;
}

async function getNewsData(id) {
    const response = await fetch(`http://localhost:12000/unsecure/vijest/${id}`);
    const data = await response.json();
    if (response.status == 200 && data != undefined) {
        return data;
    }
}

function fillPageWithNewsData(newsData) {
    let newsHeading = document.getElementById('news-heading');
    let newsImage = document.getElementById('news-image');
    let newsText = document.getElementById('news-text');

    newsHeading.textContent = newsData.heading;
    newsImage.src = newsData.url;
    newsImage.alt = "Slika";
    newsText.textContent = newsData.content;
}