import categoriesObject from "./categories.js";

const wordSpot = document.querySelector(".word-spot");
const choosenCategorySpot = document.querySelector(".choosen-category");
const changeCategoryBtns = document.querySelector(".change-category-btns");
const gallowsSpot = document.querySelector(".gallows-spot");

const allNamesOfCategoriesArrays = Object.keys(categoriesObject);
const categoriesArraysNum = allNamesOfCategoriesArrays.length;
let gallowsPiecesCounter = 0;
let currentCategoryIndex = 0;
let secretWord;

initSecretWord(categoriesObject[choosenCategorySpot.textContent.toLowerCase()]);
startInteraction();

function startInteraction() {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
}

function handleMouseClick({ target }) {
  if (target.classList.contains("letter")) {
    manipulateStateAttribute(target, "set");
    manipulateStateAttribute(changeCategoryBtns, "set");
    checkLetter(target.dataset.letter);
  }
  if (target.dataset.btn === "previous") changeCategoryIndex("previous");
  if (target.dataset.btn === "next") changeCategoryIndex("next");
}

function manipulateStateAttribute(
  element,
  manipulateMethod,
  stateAttributeValue = "disabled"
) {
  if (manipulateMethod === "set") element.dataset.state = stateAttributeValue;
  if (manipulateMethod === "get") return element.dataset.state;
}

function handleKeyPress(event) {
  if (event.ctrlKey) return;
  const keyPressed = event.key;
  const correspondingBtn = document.querySelector(
    `[data-letter="${keyPressed}"]`
  );
  if (
    keyPressed.match(/^[A-Za-z]$/) &&
    manipulateStateAttribute(correspondingBtn, "get") !== "disabled"
  ) {
    manipulateStateAttribute(correspondingBtn, "set");
    manipulateStateAttribute(changeCategoryBtns, "set");
    checkLetter(keyPressed);
  }
  if (
    keyPressed === "ArrowRight" &&
    manipulateStateAttribute(changeCategoryBtns, "get") !== "disabled"
  )
    changeCategoryIndex("next");
  if (
    keyPressed === "ArrowLeft" &&
    manipulateStateAttribute(changeCategoryBtns, "get") !== "disabled"
  )
    changeCategoryIndex("previous");
}

function checkLetter(letter) {
  const secretWordLettersSpots = Array.from(wordSpot.querySelectorAll("div"));
  const secretWordLetters = secretWord.toLowerCase().split("");
  secretWordLetters.forEach((secretLetter, index) => {
    if (secretLetter === letter) {
      secretWordLettersSpots
        .at(index)
        .querySelector(".word-letter").textContent = letter;
    }
  });

  if (
    Array.from(document.querySelectorAll(".word-letter")).every(
      (element) => element.textContent !== ""
    )
  ) {
    stopInteraction();
    showMessage("You saved the man!", "green");
  }

  if (!secretWordLetters.includes(letter)) {
    manipulateStateAttribute(
      gallowsSpot.children[gallowsPiecesCounter],
      "set",
      "visible"
    );
    gallowsPiecesCounter++;
  }

  if (gallowsSpot.children[gallowsPiecesCounter] == null) {
    stopInteraction();
    showMessage(
      `Game over, the word was "${secretWord.toUpperCase()}". The man was hanged!`,
      "red"
    );
  }
}

function showMessage(message, messageColor) {
  const messageElement = document.createElement("p");
  messageElement.classList.add("message");
  messageElement.textContent = message;
  messageElement.style.color = messageColor;
  document.querySelector(".letters-board").style.marginBottom = 0;
  document
    .querySelector(".category-spot")
    .insertAdjacentElement("beforebegin", messageElement);
}

function changeCategoryIndex(prevOrNext) {
  if (prevOrNext === "previous") {
    currentCategoryIndex === 0
      ? (currentCategoryIndex = categoriesArraysNum - 1)
      : currentCategoryIndex--;
  }
  if (prevOrNext === "next") {
    currentCategoryIndex === categoriesArraysNum - 1
      ? (currentCategoryIndex = 0)
      : currentCategoryIndex++;
  }
  chooseCategory(categoriesObject);
}

function chooseCategory(categoriesObject) {
  const choosenCategoryArray =
    categoriesObject[allNamesOfCategoriesArrays.at(currentCategoryIndex)];
  initSecretWord(choosenCategoryArray);
  choosenCategorySpot.textContent = `${allNamesOfCategoriesArrays
    .at(currentCategoryIndex)
    .charAt(0)
    .toUpperCase()}${allNamesOfCategoriesArrays
    .at(currentCategoryIndex)
    .slice(1)}`;
}

function initSecretWord(categoriesArr) {
  const randomIndex = Math.floor(Math.random() * categoriesArr.length);
  secretWord = categoriesArr.at(randomIndex);
  createLetterSpots(secretWord);
}

function createLetterSpots(word) {
  clearWordSpot();
  word.split("").forEach((letter) => {
    let markup;
    letter === " "
      ? (markup = `
  <div class="space-bettwen-words"></div>
  `)
      : (markup = `
        <div class="word-letter-spot">
        <span class="word-letter"></span>
        </div>
       `);

    wordSpot.insertAdjacentHTML("beforeend", markup);
  });
}

function clearWordSpot() {
  wordSpot.innerHTML = "";
}
