let errorContainer;

window.addEventListener('load', () => {
    errorContainer = document.getElementById("error-container");
    handleLoginButtonClick();
});

function handleLoginButtonClick() {
    let btnLogin = document.getElementById("login-button");
    btnLogin.addEventListener('click', async (event) => {
        event.preventDefault();

        let userData = getUserLoginData();
        let isValidUserLoginData = validateUserLoginData(userData);
        if (!isValidUserLoginData) {
            return;
        }

        let header = new Headers();
        header.set('Content-Type', 'application/json');
        let params = {
            method: "POST",
            headers: header,
            body: JSON.stringify(userData)
        };
        console.log(JSON.stringify(userData))
        const response = await fetch("http://localhost:12000/unsecure/prijava", params);
        if (response.status == 200) {
            window.location.href = "/unsecure";
        }
        else {
            let data = await response.json();
            let errorMessage = data.error;
            errorContainer.innerHTML = `<p>${errorMessage}</p>`;
        }
    })
}

function getUserLoginData() {
    let txtEmail = document.getElementById("email-input").value;
    let txtPassword = document.getElementById("password-input").value;

    let data = {
        email: txtEmail,
        password: txtPassword,
    }
    return data;
}

function validateUserLoginData(userData) {
    errorContainer = document.getElementById("error-container");
    errorContainer.innerHTML = '';
    for (let key in userData) {
        if (userData[key] === null || userData[key] === undefined || userData[key] === '') {
            errorContainer.innerHTML = "<p>Morate popuniti sva polja!</p>";
            return false;
        }
    }
    return true;
}