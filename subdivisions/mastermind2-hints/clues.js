
var   CombinationFieldset   =   [document.getElementById("cFirst"), document.getElementById("cSecond"), document.getElementById("cThird"),  document.getElementById("cFourth"),  document.getElementById("cFifth"),  document.getElementById("cSixth")];
var   GuessFieldset         =   [document.getElementById("gFirst"), document.getElementById("gSecond"), document.getElementById("gThird"),  document.getElementById("gFourth"),  document.getElementById("gFifth"),  document.getElementById("gSixth")];
var   Result                =    document.getElementById("result");
var   Num_Colors            =    8;

function randomCombinationWithRepition() {
  for (var i = 0; i < CombinationFieldset.length; i++) {
    CombinationFieldset[i].selectedIndex = Math.floor(Math.random() * CombinationFieldset.length + 2);
  }

  update();
}

function randomCombinationNoRepition() {
  var set = []
  for (var i = 1; i < Num_Colors + 1; i++) {
    set[i] = i;
  }

  for (var i = 0, index = set.length - 1; i < CombinationFieldset.length; i++, index--) {
    var randInd = Math.floor(Math.random() * index + 1);
    CombinationFieldset[i].selectedIndex = set[randInd];
    // Swap the two values
    set[index]    = set[randInd] ^ set[index];
    set[randInd]  = set[randInd] ^ set[index];
    set[index]    = set[randInd] ^ set[index];
  }

  update();
}

function getClues(combination, guess) {
  var reds = 0;
  var whites = 0;
  for (var i = 0; i < guess.length; i++) {
    if (guess[i] == combination[i]) {
      reds++;
    }
  }
  var processed = [];
  for (var i = 0; i < combination.length; i++) {
    for (var j = 0; j < guess.length; j++) {
      if (combination[i] == guess[j] && processed.indexOf(j) == -1) {
        processed.push(j);
        whites++;
        break;
      }
    }
  }
  whites -= reds;
  return [reds, whites];
}

function update() {
  var combination = [
    CombinationFieldset[0].options[CombinationFieldset[0].selectedIndex].value,
    CombinationFieldset[1].options[CombinationFieldset[1].selectedIndex].value,
    CombinationFieldset[2].options[CombinationFieldset[2].selectedIndex].value,
    CombinationFieldset[3].options[CombinationFieldset[3].selectedIndex].value,
    CombinationFieldset[4].options[CombinationFieldset[4].selectedIndex].value,
    CombinationFieldset[5].options[CombinationFieldset[5].selectedIndex].value
  ];


  var guess = [
    GuessFieldset[0].options[GuessFieldset[0].selectedIndex].value,
    GuessFieldset[1].options[GuessFieldset[1].selectedIndex].value,
    GuessFieldset[2].options[GuessFieldset[2].selectedIndex].value,
    GuessFieldset[3].options[GuessFieldset[3].selectedIndex].value,
    GuessFieldset[4].options[GuessFieldset[4].selectedIndex].value,
    GuessFieldset[5].options[GuessFieldset[5].selectedIndex].value
  ];

  for (var i = 0; i < combination.length; i++) {
    if (combination[i] == "none" || guess[i] == "none") {
      Result.innerHTML = "Result: None (fill out the combination and guess fieldsets)";
      return;
    }
  }

  var clues = getClues(combination, guess);

  Result.innerHTML = "Result: " + clues[0] + " red, " + clues[1] + " white";
}
