const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions =
    JSON.parse(localStorage.getItem("transactions"));

let transactions =
    localStorageTransactions !== null
        ? localStorageTransactions
        : [];

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please fill all fields!");
        return;
    }

    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: Number(amount.value)
    };

    transactions.push(transaction);

    updateLocalStorage();

    addTransaction(transaction);
    updateValues();

    text.value = "";
    amount.value = "";
});

function addTransaction(transaction) {

    const sign = transaction.amount < 0 ? "-" : "+";

    const item = document.createElement("li");

    item.innerHTML = `
        ${transaction.text}
        <span>${sign}₹${Math.abs(transaction.amount)}</span>
        <button onclick="removeTransaction(${transaction.id})">❌</button>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0);

    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0);

    balance.innerText = `₹${total.toFixed(2)}`;
    moneyPlus.innerText = `₹${income.toFixed(2)}`;
    moneyMinus.innerText = `₹${Math.abs(expense).toFixed(2)}`;
}

function removeTransaction(id) {

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    list.innerHTML = "";

    transactions.forEach(addTransaction);

    updateLocalStorage();
    updateValues();
}

function updateLocalStorage() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function init() {
    list.innerHTML = "";

    transactions.forEach(addTransaction);

    updateValues();
}

init();