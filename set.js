/**
 * Jeyamerun Subhas
 * 7/21/2020
 * Section: AE
 * TA: Jeff Worley
 * This is the set.js file linked to my set.html file.
 * Contains the user's interactions with the buttons, cards, etc. , and the game in general.
 */

"use strict";

(function() {

  let timerId;
  let remainingSeconds;
  let totalCards;
  const STYLE = ["solid", "outline", "striped"];
  const SHAPE = ["diamond", "oval", "squiggle"];
  const COLOR = ["green", "purple", "red"];
  const COUNT = ["1", "2", "3"];

  window.addEventListener("load", init);

  /** Function that runs when the page is loaded and sets up other functions. */
  function init() {
    id("start-btn").addEventListener("click", function() {
      toggleViews();
      startTimer();
      let isEasy = checkEasy();
      addCards(isEasy);
    });
    id("refresh-btn").addEventListener("click", function() {
      let isEasy = checkEasy();
      addCards(isEasy);
      removeCards();
    });
    id("back-btn").addEventListener("click", function() {
      clearInterval(timerId);
      id("set-count").textContent = 0;
      toggleViews();
      removeCards();
      id("refresh-btn").disabled = false;
    });
  }

  /**
   * Returns a boolean regarding whether the game is on easy mode or not.
   * @returns {boolean} - boolean of game being easy.
   */
  function checkEasy() {
    totalCards = 12;
    let isEasy = false;
    if (qs("input").checked) {
      isEasy = true;
      totalCards = 9;
    }
    return isEasy;
  }

  /**
   * Adds the cards to the board.
   * @param {boolean} isEasy - boolean regarding whether the game is on easy mode or not.
   */
  function addCards(isEasy) {
    for (let i = 0; i < totalCards; i++) {
      id("board").appendChild(generateUniqueCard(isEasy));
    }
  }

  /** Removes the cards from the board. */
  function removeCards() {
    for (let i = 0; i < totalCards; i++) {
      id("board").removeChild(id("board").children[0]);
    }
  }

  /** Changes to and from game and menu view. */
  function toggleViews() {
    id("game-view").classList.toggle("hidden");
    id("menu-view").classList.toggle("hidden");
  }

  /**
   * Returns an array of attributes for the cards.
   * @param {boolean} isEasy - boolean regarding whether the game is on easy mode or not.
   * @returns {array} - array of card attributes.
   */
  function generateRandomAttributes(isEasy) {
    let randMultiplier = 3;
    let allAttributes = [STYLE, SHAPE, COLOR, COUNT];
    let size = allAttributes.length;
    let randAttributes = new Array(size);
    let i = 0;
    if (isEasy) {
      randAttributes[0] = STYLE[0];
      i++;
    }
    for (; i < size; i++) {
      let rand = Math.floor(randMultiplier * Math.random());
      randAttributes[i] = allAttributes[i][rand];
    }
    return randAttributes;
  }

  /**
   * Returns a card as a DOM object.
   * @param {boolean} isEasy - boolean regarding whether the game is on easy mode or not.
   * @returns {object} - Returns a DOM object in the card.
   */
  function generateUniqueCard(isEasy) {
    let randAttributesStrings = generateRandAttributesStrings(isEasy);
    if (id("board").hasChildNodes()) {
      let currCards = id("board").children;
      let size = currCards.length;
      let existingCardAttributes = new Array(size);
      for (let i = 0; i < size; i++) {
        existingCardAttributes[i] = currCards[i].children[0].alt;
      }
      while (existingCardAttributes.includes(randAttributesStrings[1])) {
        randAttributesStrings = generateRandAttributesStrings(isEasy);
      }
    }
    return makeCard(randAttributesStrings);
  }

  /**
   * Returns a card as a DOM object.
   * @param {array} randAttributesStrings - array of attributes.
   * @returns {object} - Returns a DOM object in the card.
   */
  function makeCard(randAttributesStrings) {
    let div = document.createElement("div");

    for (let i = 0; i < randAttributesStrings[2]; i++) {
      let img = document.createElement("img");
      img.src = "img/" + randAttributesStrings[0] + ".png";
      img.alt = randAttributesStrings[1];
      div.appendChild(img);
    }
    div.id = randAttributesStrings[1];
    div.classList.add("card");
    div.addEventListener("click", cardSelected);
    return div;
  }

  /**
   * Returns an array of strings to be used to access the images.
   * @param {boolean} isEasy - boolean regarding whether the game is on easy mode or not.
   * @returns {array} - Returns an array of strings.
   */
  function generateRandAttributesStrings(isEasy) {
    let randAttributes = generateRandomAttributes(isEasy);
    let srcAttributesString = "";
    for (let i = 0; i < 2; i++) {
      srcAttributesString += randAttributes[i] + "-";
    }
    srcAttributesString += randAttributes[2];
    let altAttributesString = srcAttributesString + "-" + randAttributes[3];
    return [srcAttributesString, altAttributesString, randAttributes[3]];
  }

  /** Starts the timer for the game. */
  function startTimer() {
    let opts = qs("select");
    remainingSeconds = opts.options[opts.selectedIndex].value;
    let timeFormat = gameTimerFormat();
    id("time").textContent = timeFormat;
    timerId = setInterval(advanceTimer, 1000);
  }

  /**
   * Calculates and returns the remaining seconds in proper format.
   * @param {integer} remainingSeconds - integer of remaining seconds.
   * @returns {string} - Returns a formatted time string.
   */
  function gameTimerFormat() {
    let timeFormat = "0";
    timeFormat += Math.floor(remainingSeconds / 60) + ":";
    if (remainingSeconds % 60 > 9) {
      timeFormat += remainingSeconds % 60;
    } else {
      timeFormat += "0" + remainingSeconds % 60;
    }
    return timeFormat;
  }

  /** Decrements the times as time passes, and controls what happens when time hits zero. */
  function advanceTimer() {
    remainingSeconds--;
    let timeFormat = gameTimerFormat(remainingSeconds);
    id("time").textContent = timeFormat;
    if (remainingSeconds === 0) {
      for (let i = 0; i < qsa(".card").length; i++) {
        qsa(".card")[i].classList.remove("selected");
        qsa(".card")[i].removeEventListener("click", cardSelected);
      }
      id("refresh-btn").disabled = true;
      clearInterval(timerId);
    }
  }

  /** Selects the cards and controls what happens when you select 3 cards and don't/get a set. */
  function cardSelected() {
    let selectedCards = [];
    this.classList.toggle("selected");
    for (let i = 0; i < qsa(".card").length; i++) {
      if (qsa(".card")[i].classList.contains("selected")) {
        selectedCards.push(qsa(".card")[i]);
      }
    }
    if (selectedCards.length === 3) {
      for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.remove("selected");
      }
      if (isASet(selectedCards)) {
        isSetAction(selectedCards);
      } else {
        notSetAction(selectedCards);
      }
    }
  }

  /**
   * Controls the action that occurs when the cards selected do make a set.
   * @param {array} selectedCards - array of the selected cards.
   */
  function isSetAction(selectedCards) {
    let num = id("set-count").textContent;
    num++;
    id("set-count").textContent = num;
    for (let i = 0; i < selectedCards.length; i++) {
      let para = document.createElement("p");
      para.textContent = "SET!";
      let replacementCard = generateUniqueCard(checkEasy());
      id("board").replaceChild(replacementCard, selectedCards[i]);
      replacementCard.appendChild(para);
      replacementCard.classList.add("hide-imgs");
      setTimeout(function() {
        replacementCard.removeChild(para);
        replacementCard.classList.remove("hide-imgs");
      }, 1000);
    }
  }

  /**
   * Controls the action that occurs when the cards selected do not make a set.
   * @param {array} selectedCards - array of the selected cards.
   */
  function notSetAction(selectedCards) {
    for (let i = 0; i < selectedCards.length; i++) {
      let para = document.createElement("p");
      para.textContent = "Not a Set";
      selectedCards[i].appendChild(para);
      selectedCards[i].classList.add("hide-imgs");
      setTimeout(function() {
        selectedCards[i].removeChild(para);
        selectedCards[i].classList.remove("hide-imgs");
      }, 1000);
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card
   * are either all the same or all different, then the cards make a set. If not, they do not make
   * a set.
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
    let attribute = [];
    for (let i = 0; i < selected.length; i++) {
      attribute.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attribute[0].length; i++) {
      let same = attribute[0][i] === attribute[1][i] &&
                    attribute[1][i] === attribute[2][i];
      let diff = attribute[0][i] !== attribute[1][i] &&
                    attribute[1][i] !== attribute[2][i] &&
                    attribute[0][i] !== attribute[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
  }

})();