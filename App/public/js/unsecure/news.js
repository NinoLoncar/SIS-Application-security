window.addEventListener('load', async () => {
    getAllNews();
});

async function getAllNews() {
    const response = await fetch("http://localhost:12000/sve-vijesti");
    const data = await response.json();

    if (response.status == 200 && data != undefined) {
        fillPageWithNews(data)
    }
}

function fillPageWithNews(data) {
    let newsContainer = document.getElementById('news');

    data.forEach(newsItem => {
        let newsElement = document.createElement('div');
        newsElement.classList.add('news-element');

        let imageElement = document.createElement('img');
        imageElement.classList.add('news-image');
        imageElement.src = newsItem.url;
        newsElement.appendChild(imageElement);

        let titleElement = document.createElement('h2');
        titleElement.textContent = newsItem.heading;
        newsElement.appendChild(titleElement);

        let textElement = document.createElement('div');
        textElement.classList.add('news-text');
        textElement.textContent = newsItem.content;
        newsElement.appendChild(textElement);

        newsElement.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = `/unsecure/vijesti/${newsItem.id}`;
        })

        newsContainer.appendChild(newsElement);
    });
}