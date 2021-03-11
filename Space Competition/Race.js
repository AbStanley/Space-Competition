window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {

  var Starting = document.querySelector("#PickButton").addEventListener("click", SetNames);

  var MyBox = document.getElementById("TextLines");
  var SaveBttn = document.getElementById("Save");

  if (localStorage.getItem("TextLines")) {
    MyBox.value = localStorage.getItem("TextLines");
  }
  SaveBttn.addEventListener("click", function () {
    localStorage.setItem("TextLines", MyBox.value);
  });


}

// GLOBAL VARIABLES
var names = [];
var LineOfNames;
var Winner = "";
var timerIdRace;
var BreakLine = "<br>";

function playSound(url) {
  var audio = document.createElement('audio');
  audio.style.display = "none";
  audio.src = url;
  audio.autoplay = true;

  audio.onended = function () {
    audio.remove();

  };
  document.body.appendChild(audio);
}


function SetNames() {
  LineOfNames = document.querySelector("#TextLines").value.split("\n");

  var RocketCount = 1;
  var AddingImg = 1;
  for (var i = 0; i < LineOfNames.length; i++) {
    LineOfNames[i] = LineOfNames[i].trim();
    if (LineOfNames[i] != undefined) {
      LineOfNames[i] = LineOfNames[i].replace(/\s/g, '');
      if (LineOfNames.length > 4) {
        LineOfNames = LineOfNames.sort(function (a, b) {
          return 0.5 - Math.random()
        });
      }

    }

    if (RocketCount <= 6 && LineOfNames[i] != "") {
      names.push(LineOfNames[i]);
      RocketCount++;
    }
  }
  if (names.length < 4) {
    alert("Please, insert 4 names at less");
    LineOfNames = [];
    names = [];
  } else {

    SetPlayers();
  }

}

function SetPlayers() {
  var RocketCount = 1;
  for (var i = 0; i < names.length; i++) {

    document.querySelector("header").style.display = "none";
    document.querySelector("h1").style.display = "none";
    document.querySelector("#Save").style.display = "none";

    var Field = document.querySelector("#Field");

    var RaceBtn = document.createElement("button");
    RaceBtn.setAttribute('id', "RaceBtn");
    RaceBtn.innerHTML = "Race";

    var CancelBtn = document.createElement("button");
    CancelBtn.setAttribute('id', "CancelBtn");
    CancelBtn.innerHTML = "Cancel";


    // Creates a div for the new Rocket
    var RocketField = document.createElement('div');
    RocketField.id = "Rocket" + RocketCount;
    // It set the image rocket in variable img
    var img = document.createElement('img');
    img.src = "imgs/rocket " + RocketCount + ".png";
    // Puts the object img inside of the div object
    RocketField.appendChild(img);



    // Add the Div object with the img inside of the #Field
    Field.appendChild(RocketField);
    //Add the line break
    RocketField.innerHTML += BreakLine;

    var PlayerName = document.createElement("Player");
    PlayerName.innerHTML = names[i];
    // It adds the name of the player bellow of the corresponding img
    var NewRocketImg = document.querySelector("#Rocket" + RocketCount);
    // it adds it
    NewRocketImg.appendChild(PlayerName);

    RocketCount++;
  }


  Field.appendChild(RaceBtn);
  Field.innerHTML += BreakLine;
  Field.appendChild(CancelBtn);
  Field.innerHTML += BreakLine + BreakLine + BreakLine;

  document.querySelector("#TextLines").style.display = "none";
  document.querySelector("#PickButton").style.display = "none";

  var Race = document.querySelector("#RaceBtn").addEventListener("click", Launching);
  var Canceling = document.querySelector("#CancelBtn").addEventListener("click", CleanRaceScreen);

}


function CleanRaceScreen() {

  document.querySelector("#TextLines").style.display = "";
  document.querySelector("#PickButton").style.display = "";
  document.querySelector("header").style.display = "";
  document.querySelector("h1").style.display = "";
  document.querySelector("#Save").style.display = "";

  LineOfNames = [];
  names = [];
  document.getElementById("Field").innerHTML = "";
}

function Launching() {
  document.querySelector("#CancelBtn").style.display = "none";
  document.querySelector("#RaceBtn").style.display = "none";


  var RocketLaunch = 1;
  var Rocketdistance = 0;
  var CompetitorsList = [];
  var CompetitorsPosition = [];

  for (var i = 0; i <= names.length - 1; i++) {
    CompetitorsList.push(document.querySelector("#Rocket" + RocketLaunch));
    CompetitorsList[i].style.bottom = 0;
    CompetitorsList[i].style.left = Rocketdistance + "px";
    CompetitorsList[i].style.position = "absolute";
    RocketLaunch++;
    Rocketdistance += 120;

    CompetitorsPosition[i] = 0;
  }

  var timeleft = 3;
  var countdown = document.createElement("div");
  countdown.setAttribute('id', "countdown");
  countdown.innerHTML = "";
  Field.appendChild(countdown);

  countdown.style.position = "absolute";
  countdown.style.bottom = "50%";

  var downloadTimer = setInterval(
    function () {
      countdown.innerHTML = "The Race will start in " + timeleft + " seconds!";
      if (timeleft == 3) {
        var MyAudio = setTimeout(playSound("Sounds/Count.wav"), 5000);
      }
      timeleft -= 1;

      if (timeleft <= -1) {
        clearInterval(downloadTimer);
        document.getElementById("countdown").innerHTML = "Go!"
        Moving();

      }
    }, 1000);


  function Moving() {
    var timeleft = 1;
    var Dissapear = setInterval(
      function () {
        document.getElementById("countdown").innerHTML = "Go!"
        timeleft -= 1;
        if (timeleft <= -1) {
          clearInterval(Dissapear);
          document.getElementById("countdown").innerHTML = ""
        }
      }, 500);


    var Turn = 0

    var MyAudio = setTimeout(playSound("Sounds/RocketLaunch.wav"), 5000);
    var id = setInterval(frame, 10);

    function frame() {

      if (CompetitorsPosition[Turn] >= innerHeight - 148) {
        clearInterval(id);
        Winner = CompetitorsList[Turn];
        setTimeout(WinnerScreen, 1000);
      } else {
        if (CompetitorsPosition[Turn] > innerHeight - 145) {
          CompetitorsPosition[Turn] += Math.random() * (2 - 1) + 1;
        } else {

          CompetitorsPosition[Turn] += Math.random() * (4 - 1) + 1;
        }

        CompetitorsList[Turn].style.bottom = CompetitorsPosition[Turn] + 'px';
        if (Turn >= names.length - 1) {
          Turn = 0;
        } else {
          Turn++;
        }
      }
    }
  }

  function WinnerScreen() {
    setTimeout(playSound("Sounds/Congrats.wav"), 5000);
    for (var i = 0; i <= names.length - 1; i++) {

      var ElementToDelete = document.querySelector("#Rocket" + i + 1);
      Field.innerHTML = "";

      names.pop();
      LineOfNames.pop();
    }

    var WinnerLabel = document.createElement("h1");
    WinnerLabel.setAttribute('id', "WinnerLabel");
    WinnerLabel.innerHTML = "The Winner is: " + BreakLine;

    var WinnerName = document.createElement("div");
    WinnerName.setAttribute('id', "WinnerName");
    WinnerName.innerHTML = Winner.innerHTML;
    WinnerName.innerHTML += BreakLine + "Congratulations!"; //Winner.innerHTML;

    var PlayAgain = document.createElement("button");
    PlayAgain.setAttribute('id', "PlayAgain");
    PlayAgain.innerHTML = "PlayAgain?";

    WinnerLabel.appendChild(WinnerName);
    Field.innerHTML += BreakLine;
    Field.appendChild(WinnerLabel);
    Field.innerHTML += BreakLine;
    Field.appendChild(PlayAgain);
    Field.innerHTML += BreakLine + BreakLine + BreakLine;
    clearInterval(downloadTimer);

    var StartingAgain = document.querySelector("#PlayAgain").addEventListener("click", CleanRaceScreen);

  }

}