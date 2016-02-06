
var   CombinationFieldset   =   [document.getElementById("cFirst"), document.getElementById("cSecond"), document.getElementById("cThird"),  document.getElementById("cFourth")];
var   GuessFieldset         =   [document.getElementById("gFirst"), document.getElementById("gSecond"), document.getElementById("gThird"),  document.getElementById("gFourth")];
var   Result                =   document.getElementById("result");

function getClues(combination, guess) {
  var reds = 0;
  var whites = 0;
  for (var i = 0; i < guess.length; i++) {
    if (guess[i] == combination[i]) {
      reds++;
    } else if (combination.indexOf(guess[i]) != -1) {
      whites++;
    }
  }
  return [reds, whites];
}

function update() {
  var combination = [];
  combination[0] = CombinationFieldset[0].options[CombinationFieldset[0].selectedIndex].value;
  combination[1] = CombinationFieldset[1].options[CombinationFieldset[1].selectedIndex].value;
  combination[2] = CombinationFieldset[2].options[CombinationFieldset[2].selectedIndex].value;
  combination[3] = CombinationFieldset[3].options[CombinationFieldset[3].selectedIndex].value;


  var guess = [];
  guess[0] = GuessFieldset[0].options[GuessFieldset[0].selectedIndex].value;
  guess[1] = GuessFieldset[1].options[GuessFieldset[1].selectedIndex].value;
  guess[2] = GuessFieldset[2].options[GuessFieldset[2].selectedIndex].value;
  guess[3] = GuessFieldset[3].options[GuessFieldset[3].selectedIndex].value;

  if (combination.indexOf("none") != -1 || guess.indexOf("none") != -1) {
    Result.innerHTML = "Result: None (fill out the combination and guess fieldsets)";
    return;
  }

  var clues = getClues(combination, guess);

  Result.innerHTML = "Result: " + clues[0] + " red, " + clues[1] + " white";
}
