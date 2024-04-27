window.addEventListener('load', () => {
    getUserBalance();
    getNewestNews();
});

async function getUserBalance() {
    const response = await fetch("http://localhost:12000/sesija/ulogirani-korisnik");
    if (response.status == 200) {
        let user = await response.json();
        let txtBalance = document.getElementById("balance-value");
        txtBalance.innerText = `${user.balance}$`;
    }
}

async function getNewestNews() {

}