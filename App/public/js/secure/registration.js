let txtRepeatedPassword;
let countriesSelectInput;

window.addEventListener("load", () => {
	txtRepeatedPassword = document.getElementById("confirm-password-input");
	countriesSelectInput = document.getElementById("select-input");
	handleRegistrationButtonClick();
});

function handleRegistrationButtonClick() {
	let btnRegister = document.getElementById("register-button");
	btnRegister.addEventListener("click", async (event) => {
		event.preventDefault();

		let userData = getUserRegistrationData();
		let isValidUserRegistrationData = validateUserRegistrationData(userData);
		if (!isValidUserRegistrationData) {
			return;
		}

		let header = new Headers();
		header.set("Content-Type", "application/json");
		let params = {
			method: "POST",
			headers: header,
			body: JSON.stringify(userData),
		};
		const response = await fetch(
			"http://localhost:12000/secure/registracija",
			params
		);
		if (response.status == 201) window.location.href = "/secure/prijava";
		else {
			let data = await response.text();
			let errorContainer = document.getElementById("error-container");
			errorContainer.innerHTML += `<p>${data}</p>`;
		}
	});
}

function getUserRegistrationData() {
	let txtFirstName = document.getElementById("first-name-input");
	let txtLastName = document.getElementById("last-name-input");
	let txtEmail = document.getElementById("email-input");
	let txtPassword = document.getElementById("password-input");
	let txtAddress = document.getElementById("adress-input");
	let txtPostal = document.getElementById("postal-input");

	let data = {
		countries_id: parseInt(countriesSelectInput.value),
		name: txtFirstName.value,
		surname: txtLastName.value,
		email: txtEmail.value,
		password: txtPassword.value,
		address: txtAddress.value,
		postal: txtPostal.value,
	};
	return data;
}

function validateUserRegistrationData(userData) {
	let errorContainer = document.getElementById("error-container");
	errorContainer.innerHTML = "";
	for (let key in userData) {
		if (
			userData[key] === null ||
			userData[key] === undefined ||
			userData[key] === ""
		) {
			errorContainer.innerHTML += "<p>Morate popuniti sva polja</p>";
			return false;
		}
	}
	if (txtRepeatedPassword.value === "") {
		errorContainer.innerHTML += "<p>Morate popuniti sva polja</p>";
		return false;
	}
	if (countriesSelectInput.value == 0) {
		errorContainer.innerHTML += "<p>Niste odabrali državu</p>";
		return false;
	}
	if (txtRepeatedPassword.value != userData.password) {
		errorContainer.innerHTML += "<p>Upisane lozinke se ne podudaraju</p>";
		return false;
	}

	if (checkEmail(userData.email) == false) {
		errorContainer.innerHTML += "<p>Email nije u ispravnom formatu</p>";
		return false;
	}

	if (checkPostalCode(userData.postal) == false) {
		console.log(userData.postal);
		errorContainer.innerHTML +=
			"<p>Poštanski broj mora biti peteroznamenkasti broj</p>";
		return false;
	}

	if (userData.password.length < 8) {
		errorContainer.innerHTML +=
			"<p>Lozinka mora sadržavati barem 8 znakova</p>";
		return false;
	}

	return true;
}

function checkEmail(text) {
	const regex = new RegExp(
		"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
	);
	return regex.test(text);
}

function checkPostalCode(text) {
	const regex = new RegExp("^\\d{5}$");
	return regex.test(text);
}
