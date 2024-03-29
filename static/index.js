const myForm = document.getElementById("myForm");

async function submitMyForm(event) {
  if (event) {
    event.preventDefault(); // don't use action to submit form
  }

  let total = 0;

  const trng = document.getElementById("trng").checked;

  const diceRows = document.querySelectorAll("tr.dice-row");
  for (const row of diceRows) {
    const inputs = row.querySelectorAll("input");
    const output = row.querySelectorAll("output")[0];
    const nFaces = inputs[0].value;
    const nDices = inputs[1].value;

    if (nDices == 0 || nFaces == 0) {
      output.innerHTML = "";
      continue;
    }

    const url = new URL("r", document.baseURI);
    url.searchParams.append("num", nDices);
    url.searchParams.append("max", nFaces);
    url.searchParams.append("trng", trng);

    const response = await fetch(url);
    if (!response.ok) {
      output.innerHTML = await response.text();
      continue;
    }

    const result = await response.json();
    output.innerHTML = result.join("+");
    total += result.reduce((sum, n) => sum + n, 0);
  }

  const modifier = parseInt(document.getElementById("modifier").value);
  const modifierOutput = document.getElementById("modifier-output");
  total += modifier;
  modifierOutput.innerHTML = (modifier < 0 ? "" : "+") + modifier;

  document.getElementById("total").innerHTML = total;
}

function resetMyForm() {
  document.querySelectorAll("output").forEach((elem) => elem.innerHTML = "");
  document.querySelectorAll(".custom-dice").forEach((elem) => elem.remove());
}

function addCustomDice() {
  const tbody = document.querySelector("tbody");
  const newRow = tbody.insertRow(tbody.rows.length - 1);
  newRow.className = "dice-row custom-dice";
  newRow.innerHTML = `
  <td><button type="button">x</button></td>
  <td>d<input type="number"></td>
  <td><input type="number" value="0" min="0"></td>
  <td><output></output></td>
  `;
  newRow.querySelector("button").addEventListener("click", () => newRow.remove());
}

const addCustomDiceButton = document.getElementById("add-custom-dice");
addCustomDiceButton.addEventListener("click", addCustomDice);

myForm.addEventListener("submit", submitMyForm);
myForm.addEventListener("reset", resetMyForm);

document.querySelectorAll(".normal-dice").forEach((elem) => {
  const img = elem.querySelector("img");
  img.addEventListener("click", () => {
    myForm.reset();
    elem.querySelectorAll("input")[1].value = 1;
    submitMyForm();
  });
});
