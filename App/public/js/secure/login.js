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
        const response = await fetch("http://localhost:12000/secure/prijava", params);
        if (response.status == 200) {
            let user = await response.json();
            twoFactorAuthentication(user);
        }
        else {
            let data = await response.json();
            let errorMessage = data.error;
            errorContainer.innerHTML = `<p>${errorMessage}</p>`;
        }
    })
}

function twoFactorAuthentication(user) {
    if (user.activated_2fa) {
        var twoFactorAuth = document.getElementById("two-factor-auth");
        twoFactorAuth.style.visibility = "visible";
        let btnVerifyCode = document.getElementById("two-factor-code-button");
        btnVerifyCode.addEventListener('click', async (event) => {
            event.preventDefault();
            let header = new Headers();
            header.set('Content-Type', 'application/json');
            let code = document.getElementById("two-factor-code");
            let data = {
                token: code.value
            }
            let params = {
                method: "POST",
                headers: header,
                body: JSON.stringify(data)
            };
            const response = await fetch("http://localhost:12000/secure/provjeri-auth-kod", params);
            if (response.status == 200) {
                window.location.href = "/secure"
            }
            else {
                window.location.reload();
            }
        })
    }
    else {
        window.location.href = "/secure"
    }
}

function getUserLoginData() {
    let txtEmail = document.getElementById("email-input");
    let txtPassword = document.getElementById("password-input");

    let data = {
        email: txtEmail.value,
        password: txtPassword.value,
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