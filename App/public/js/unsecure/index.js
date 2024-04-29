window.addEventListener('load', () => {
    getUserBalance();
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

function handleAddFundsButton() {
    let btnAddFunds = document.getElementById("add-funds-button");
    btnAddFunds.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = "/unsecure/transakcije";
    })
}

async function getNewestNews() {

}