let txtRepeatedPassword;
let countriesSelectInput;

window.addEventListener("load", async () => {
    txtRepeatedPassword = document.getElementById("confirm-password-input");
    countriesSelectInput = document.getElementById("select-input");
    handleRegistrationButtonClick();
});

async function handleRegistrationButtonClick() {
    let btnRegister = document.getElementById("register-button");
    btnRegister.addEventListener('click', async (event) => {
        event.preventDefault();

        let userData = getUserRegistrationData();
        let isValidUserRegistrationData = validateUserRegistrationData(userData);
        if (!isValidUserRegistrationData) {
            return;
        }

        let header = new Headers();
        header.set('Content-Type', 'application/json');
        let params = {
            method: "POST",
            headers: header,
            body: JSON.stringify(userData)
        };
        const response = await fetch("http://localhost:12000/unsecure/registracija", params);
        if (response.status == 201)
            window.location.href = "/unsecure/prijava";
        else {
            let data = await response.json();
            let errorMessage = data.error;
            console.log(errorMessage);
        }
    })
}

function getUserRegistrationData() {
    let txtFirstName = document.getElementById("first-name-input");
    let txtLastName = document.getElementById("last-name-input");
    let txtEmail = document.getElementById("email-input");
    let txtPassword = document.getElementById("password-input");
    let txtAddress = document.getElementById("adress-input");
    let txtPostal = document.getElementById("postal-input");

    let data = {
        roles_id: 0,
        countries_id: countriesSelectInput.value,
        name: txtFirstName.value,
        surname: txtLastName.value,
        email: txtEmail.value,
        password: txtPassword.value,
        balance: 0,
        address: txtAddress.value,
        postal: txtPostal.value,
    }
    return data;
}

function validateUserRegistrationData(userData) {
    let errorContainer = document.getElementById("error-container");
    errorContainer.innerHTML = '';
    for (let key in userData) {
        if (userData[key] === null || userData[key] === undefined || userData[key] === '') {
            errorContainer.innerHTML += "<p>Morate popuniti sva polja!</p>";
            return false;
        }
    }
    if (txtRepeatedPassword.value === '') {
        errorContainer.innerHTML += "<p>Morate popuniti sva polja!</p>";
        return false;
    }
    if (countriesSelectInput.value == 0) {
        errorContainer.innerHTML += "<p>Niste odabrali državu!</p>";
        return false;
    }
    if (txtRepeatedPassword.value != userData.password) {
        errorContainer.innerHTML += "<p>Upisane lozinke se ne podudaraju!</p>";
        return false;
    }
    return true;
}
