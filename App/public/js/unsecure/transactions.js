let userBalance;

window.addEventListener("load", async () => {
    getUserBalance();
    handleAddFundsButton();
    handleSendFundsButton();
});

async function getUserBalance() {
    const response = await fetch("http://localhost:12000/sesija/ulogirani-korisnik");
    if (response.status == 200) {
        let user = await response.json();
        let txtBalance = document.getElementById("balance-value");
        txtBalance.innerText = `${user.balance}$`;
        userBalance = user.balance;
    }
}

function handleAddFundsButton() {
    let btnAddFunds = document.getElementById("add-funds-button");
    btnAddFunds.addEventListener('click', async (event) => {
        event.preventDefault();
        let funds = getFunds();
        let header = new Headers();
        header.set('Content-Type', 'application/json');
        let params = {
            method: "POST",
            headers: header,
            body: JSON.stringify(funds)
        };
        const response = await fetch("http://localhost:12000/add-funds", params);
        if (response.status == 200) {
            await getUserBalance();
            clearTextboxes("add");
        }
        else {
            let addingErrorMessage = document.getElementById('adding-error');
            addingErrorMessage.innerHTML = `<p>${await response.text()}</p>`;
            clearTextboxes("add");
        }
    });
}

function handleSendFundsButton() {
    let sendingErrorMessage = document.getElementById('sending-error');
    let btnSendFunds = document.getElementById("send-funds-button");
    btnSendFunds.addEventListener('click', async (event) => {
        event.preventDefault();
        let funds = document.getElementById("funds-for-sending").value;
        let receiver = document.getElementById("reciever-email").value;
        if (funds > userBalance || funds == "" || receiver == "") {
            sendingErrorMessage.innerHTML = `<p>Provjerite unos!</p>`;
            return;
        }
        const response = await fetch(`http://localhost:12000/unsecure/send-funds?funds=${funds}&receiver=${receiver}`, {
            method: "post",
            credentials: "include"
        });

        if (response.status == 200) {
            getUserBalance();
            clearTextboxes("send");
        }
        else {
            sendingErrorMessage.innerHTML = `<p>${await response.text()}</p>`;
            clearTextboxes("send");
        }
    });
}

function getFunds() {
    let txtAddFunds = document.getElementById("funds-for-adding");
    let data = {
        funds: txtAddFunds.value
    }
    return data;
}

function clearTextboxes(type) {
    if (type == "send") {
        document.getElementById("funds-for-sending").value = "";
        document.getElementById("reciever-email").value = "";
    }
    else {
        document.getElementById("funds-for-adding").value = "";
    }
}
