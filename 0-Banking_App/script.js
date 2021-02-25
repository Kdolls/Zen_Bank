"use strict";

// =   BANKIST APP     = //

// ─── Customer Data Objects ─
const account1 = {
  owner: "Karim Dolley",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1,
};

const account2 = {
  owner: "Victoria Dolley",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let currentAccount;

// ─── HTML Elements ──
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");


// ───────── Display Account's Movements ─
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ""; // ⇐ Clearing all rows before new data entry

  // ↩  Sorting the movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  // ↩ Creating movements row each time
  movs.movements.forEach(function (mov, i) {
    // ↩ Deposit or Withdrawal?
    const type = mov > 0 ? "Deposit" : "Withdrawal";
    const html = ` <div class="movements__row">
         <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}</div>
      </div> `;

    // ↩ Inserting the elements to the HTML
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};



// ───────── Calculate Balance
const calcDisplayBalance = function (x) {
  const balance = x.movements.reduce((acc, mov) => acc + mov, 0);
  x.balance = balance;
  labelBalance.textContent = `${balance} €`;
};



// ───────── Summary Display
const calcDisplaySummary = function (x) {
  const incomes = x.movements.filter((x) => x > 0).reduce((x, y) => x + y);
  labelSumIn.textContent = `${Math.trunc(incomes)} €`;

  const debited = x.movements.filter((x) => x < 0).reduce((x, y) => x + y);
  labelSumOut.textContent = `${debited}`;

  const interest = x.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * x.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};



// ───────── Creating User Names ─
const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(" ")
      .map(function (i) {
        return i[0];
      })
      .join("");
  });
};
creatUserNames(accounts);




// ───────── Updating The UI Function ─
const updateUI = function (currentAccount) {
  // ↩ Display Movements
  displayMovements(currentAccount);

  // ↩ Display Balance
  calcDisplayBalance(currentAccount);

  // ↩ Display Summary
  calcDisplaySummary(currentAccount);
};




// ───────── Always logged in ─
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;




// ─── Login Button Events ─
btnLogin.addEventListener("click", function (e) {
  // ↩ prevent default
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // ↩ Clear fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // ↩ Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
  }
});

// ───────── Transfer from an Account to another
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (x) => x.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  )
    // ↩  Adding Postive and Negative Amounts
    currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  // ↩  Updating UI
  updateUI(currentAccount);
});

// ───────── Requesting Loan ─
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  // ↩  if any movement is greater or equal 10% move to the next action
  if (amount > 0 && currentAccount.movements.some((x) => x >= amount / 10)) {
    // ↩  Add movemtent
    currentAccount.movements.push(amount);

    // ↩  calling update UI
    updateUI(currentAccount);
  }
  // ↩  clear field
  inputLoanAmount.value = "";
});

// ───────── Closing Account ─
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // ↩  Checking if User Name Correct
  if (
    currentAccount?.pin === Number(inputClosePin.value) &&
    currentAccount?.userName === inputCloseUsername.value
  ) {
    // ↩  Confirm the account
    const index = accounts.findIndex(
      (x) => accounts.userName === currentAccount.userName
    );
    // ↩  Deleting the account
    accounts.splice(index, 1);
    // ↩  Hide the UI
    containerApp.style.opacity = 0;
  }
});


let sorted = false;
// ───────── Sorting Movements ─
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});




// ───────── Date and time stamps ─
 const now = new Date();
// Date changing date format
const day =`${now.getDate()}`.padStart(2,0);
const month = `${now.getMonth() + 1}`.padStart(2,0)
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


// ───────── Logout Timer ─
// ↩  set time to 5
let time = 10;
// ↩  call timer each second
const timer = setInterval(function(){
  const min = String(Math.trunc(time / 60)).padStart(2, 0)
  const sec = String(time % 60).padStart(2,0)
// ↩  Display each call to UI
labelTimer.textContent = `${min}:${sec}`;
time-- // ↩  decrease by 1 sec 
// ↩  when 0 , stop timer and logout
if(time === 0){
  clearInterval(timer)

  // ↩ Display UI and message
    labelWelcome.textContent = 'Login'
    containerApp.style.opacity = 0;

    
} 

}, 1000)


const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 10;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};