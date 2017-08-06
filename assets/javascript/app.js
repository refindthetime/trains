// Var:global
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery Var Global
var traxTrain = $("#train-name");
var traxTrainDestination = $("#train-destination");
// form validation for time and frequency of trains
var traxTime = $("#train-time").mask("00:00");
var traxTimeFreq = $("#time-freq").mask("00");


//Firebase
 var config = {
    apiKey: "AIzaSyDrleeo0JENI7OLm3_0IqkvCgrJ6Q2zz0M",
    authDomain: "trains-57507.firebaseapp.com",
    databaseURL: "https://trains-57507.firebaseio.com",
    projectId: "trains-57507",
    storageBucket: "trains-57507.appspot.com",
    messagingSenderId: "876058255475"
  };
  firebase.initializeApp(config);

// reference to the database as variable
var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    //  create local variables to store the data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;

    // subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // append table of trax trains, with new row of train info
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-trash icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    // Hover view of delete button (delete button does not do anything at this time)
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

  
});

// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
    // prevent from from reseting
    event.preventDefault();

    // get/store inputs
    trainName = traxTrain.val().trim();
    trainDestination = traxTrainDestination.val().trim();
    trainTime = moment(traxTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = traxTimeFreq.val().trim();

    // add to firebase databse
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train successuflly added!");

    //  empty form once submitted
    traxTrain.val("");
    traxTrainDestination.val("");
    traxTime.val("");
    traxTimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (traxTrain.val().length === 0 || traxTrainDestination.val().length === 0 || traxTime.val().length === 0 || traxTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

//same as above just for key press
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (traxTrain.val().length === 0 || traxTrainDestination.val().length === 0 || traxTime.val().length === 0 || traxTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});