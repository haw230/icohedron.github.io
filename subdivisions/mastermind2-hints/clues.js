
var   CombinationFieldset   =   [document.getElementById("cFirst"), document.getElementById("cSecond"), document.getElementById("cThird"),  document.getElementById("cFourth"),  document.getElementById("cFifth"),  document.getElementById("cSixth")];
var   GuessFieldset         =   [document.getElementById("gFirst"), document.getElementById("gSecond"), document.getElementById("gThird"),  document.getElementById("gFourth"),  document.getElementById("gFifth"),  document.getElementById("gSixth")];
var   Result                =    document.getElementById("result");

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
