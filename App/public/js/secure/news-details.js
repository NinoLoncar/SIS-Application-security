let newsId;
window.addEventListener("load", () => {
	newsId = getIdFromUrl();
	getPageContent();
	handleAddCommentButton();
});

async function getPageContent() {
	let newsData = await getNewsData(newsId);
	fillPageWithNewsData(newsData);
	getNewsComments(newsId);
}

function getIdFromUrl() {
	let currentUrl = window.location.href;
	let urlParts = currentUrl.split("/");
	let id = urlParts[urlParts.length - 1];
	return id;
}

async function getNewsData() {
	const response = await fetch(`http://localhost:12000/vijest/${newsId}`);
	const data = await response.json();
	if (response.status == 200 && data != undefined) {
		return data;
	}
}

function fillPageWithNewsData(newsData) {
	let newsHeading = document.getElementById("news-heading");
	let newsImage = document.getElementById("news-image");
	let newsText = document.getElementById("news-text");

	newsHeading.textContent = newsData.heading;
	newsImage.src = newsData.url;
	newsImage.alt = "Slika";
	newsText.textContent = newsData.content;
}

async function getNewsComments() {
	const response = await fetch(`http://localhost:12000/komentari/${newsId}`);
	if (response.status == 200) {
		const data = await response.json();
		showComments(data);
	}
}

function handleAddCommentButton() {
	let btnAddComment = document.getElementById("add-comment-button");

	btnAddComment.addEventListener("click", async (event) => {
		event.preventDefault();
		let txtComment = document.getElementById("new-comment");

		let header = new Headers();
		header.set("Content-Type", "application/json");
		let params = {
			method: "POST",
			headers: header,
			body: JSON.stringify({
				content: txtComment.value,
				newsId: newsId,
			}),
		};
		const response = await fetch(
			"http://localhost:12000/secure/dodaj-komentar",
			params
		);
		if (response.status == 201) {
			txtComment.value = "";
			getNewsComments();
		}
	});
}

function showComments(data) {
	let tbody = document.getElementById("comments-table-body");
	tbody.innerHTML = "";

	data.forEach((comment) => {
		let tr = document.createElement("tr");
		let td1 = document.createElement("td");
		let usernameDiv = document.createElement("div");
		usernameDiv.className = "commenter-username";
		usernameDiv.textContent = comment.user.name + " " + comment.user.surname;
		td1.appendChild(usernameDiv);

		let dateDiv = document.createElement("div");
		dateDiv.textContent = comment.date;
		td1.appendChild(dateDiv);
		tr.appendChild(td1);

		let td2 = document.createElement("td");
		td2.className = "comment-text";
		td2.textContent = DOMPurify.sanitize(comment.content);
		tr.appendChild(td2);
		tbody.appendChild(tr);
	});
}
