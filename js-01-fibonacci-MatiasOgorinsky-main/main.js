function fibonacci(number) {
  if (number > 0 && number <= 3) {
    return 1;
  } else if (number > 3) {
    let prev = 0;
    let curr = 1;
    for (let i = 2; i <= number; i++) {
      const next = prev + curr;
      prev = curr;
      curr = next;
    }
    return curr;
  } else {
    return "";
  }
}

// milestone fibonacci using recursive function
function fibonacciRecursive(n) {
  if (n < 2) {
    return n;
  }
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

function calculateFib() {
  let input = document.getElementById("inputData").value;
  let parseInput = parseInt(input);
  let warning = document.getElementById("alert");
  warning.classList.remove("alert");
  warning.classList.remove("alert-danger");
  warning.classList.remove("w-25");
  warning.innerText = "";
  let isChecked = document.getElementById("saveCalculation").checked;
  let resultTag = document.getElementById("resultError");
  resultTag.classList.add("d-none");
  if (parseInput > 50) {
    warning.innerText = "can't be more than 50";
    warning.classList.add("alert");
    warning.classList.add("alert-danger");
    warning.classList.add("w-25");
  } else if (parseInput < 0 && !isChecked) {
    warning.innerText = "can't be less than 0";
    warning.classList.add("alert");
    warning.classList.add("alert-danger");
    warning.classList.add("w-25");
  } else {
    if (!isChecked) {
      resultRecursiveFibonacciFunction = fibonacciRecursive(parseInput);
      let resultTag = document.getElementById("resultSpan");
      resultTag.innerText = resultRecursiveFibonacciFunction;
    } else {
      fetchFromServer(parseInput);
    }
  }
}

function init() {
  let button = document.getElementById("fibonacciCall");
  button.addEventListener("click", calculateFib);
  let loader = document.getElementById("loader");
  loader.classList.add("vanish-spinner");
  ResultsServer();
}

init();

async function ResultsServer() {
  const FIBONACCI_SERVER_RESULT = `http://localhost:5050/getFibonacciResults `;
  return await fetch(FIBONACCI_SERVER_RESULT)
    .then(function (response) {
      results = response.json();
      return results;
    })
    .then(function (data) {
      for (let i = 0; i < data.results.length; i++) {
        let list = document.getElementById("unordered-list");
        let item = document.createElement("li");
        let paragraph = document.createElement("p");
        let date = data.results[i].createdDate;
        paragraph.innerHTML = `The Fibonacci of <strong>${
          data.results[i].number
        }</strong> is <strong>${
          data.results[i].result
        }</strong> Calculated at: ${new Date(date)} `;
        paragraph.classList.add("border-bottom");
        paragraph.classList.add("border-dark");
        paragraph.classList.add("border-1");
        paragraph.classList.add("d-inline-block");
        paragraph.classList.add("pb-2");
        list.appendChild(item);
        item.appendChild(paragraph);
      }
    });
}

async function fetchFromServer(number) {
  let errorMessage = document.getElementById("resultError");
  errorMessage.classList.add("d-none");
  let loader = document.getElementById("loader");
  let displayedResult = document.getElementById("resultSpan");
  displayedResult.innerText = "";
  loader.classList.remove("vanish-spinner");
  const FIBONACCI_SERVER = `http://localhost:5050/fibonacci/${number}`;
  return await fetch(FIBONACCI_SERVER)
    .then(async (response) => {
      if (response.ok) {
        result = await response.json();
        return result;
      } else {
        let msgError;
        await response.text().then((elem) => {
          msgError = elem;
          let resultTag = document.getElementById("resultError");
          resultTag.classList.remove("d-none");
          resultTag.innerText = ` Server error: ${msgError}`;
          loader.classList.add("vanish-spinner");
        });
      }
    })
    .then((elem) => {
      console.log(elem.result);
      loader.classList.add("vanish-spinner");
      resultFibonacci = elem.result;
      let resultTag = document.getElementById("resultSpan");
      resultTag.innerText = resultFibonacci;
      let list = document.getElementById("unordered-list");
      let item = document.createElement("li");
      let paragraph = document.createElement("p");
      paragraph.innerHTML = `The Fibonacci of <strong>${number}</strong> is <strong>${resultFibonacci}</strong> Calculated at: ${new Date()}`;
      paragraph.classList.add("border-bottom");
      paragraph.classList.add("border-dark");
      paragraph.classList.add("border-1");
      paragraph.classList.add("d-inline-block");
      paragraph.classList.add("pb-2");
      list.prepend(item);
      item.prepend(paragraph);
    });
}
