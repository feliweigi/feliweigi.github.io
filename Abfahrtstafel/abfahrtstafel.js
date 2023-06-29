let evaNumber

function getAbfahrtstafel(ril100){
	

        var Abfahrtstafel = document.getElementById("Abfahrtstafel")
        Abfahrtstafel.innerHTML = ""

    
    getStationEvaNumber(ril100)
    getDepatures(evaNumber, getCurrentDate(-3), getCurrentHour(-3))
    getDepatures(evaNumber, getCurrentDate(-2), getCurrentHour(-2))
    getDepatures(evaNumber, getCurrentDate(-1), getCurrentHour(-1))
    getDepatures(evaNumber, getCurrentDate(0), getCurrentHour(0))
    getDepatures(evaNumber, getCurrentDate(1), getCurrentHour(1))
    getDepatures(evaNumber, getCurrentDate(2), getCurrentHour(2))
    getDepatures(evaNumber, getCurrentDate(3), getCurrentHour(3))
    getDepatures(evaNumber, getCurrentDate(4), getCurrentHour(4))
    
    
    }

function getStationEvaNumber(ril100) {

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/station/"+ril100, true);
	xhr.setRequestHeader("Accept", "application/json")
    xhr.setRequestHeader("DB-Client-ID", "b9fac6fe073cc6244297b2e8587b2ab1")
    xhr.setRequestHeader("DB-Api-Key", "902e319aeae8bd7a6299b82a175b0ec5")
    
    xhr.onreadystatechange = function() {
        parser = new DOMParser();
        const data =  parser.parseFromString(xhr.responseText, "text/xml") ;
        var stationElement = data.querySelector('station');

            evaNumber = stationElement.getAttribute('eva')
            document.getElementById('evaNumber').innerHTML = evaNumber


//        evaNumber = data.getElementsByTagName('station')[0].getAttribute('eva')
	}
	xhr.send(null)



}


function getDepatures(evaNumber,date,hour){
    var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/" + evaNumber + "/" + date + "/" + hour, true);
	xhr.setRequestHeader("Accept", "application/json")
    xhr.setRequestHeader("DB-Client-ID", "b9fac6fe073cc6244297b2e8587b2ab1")
    xhr.setRequestHeader("DB-Api-Key", "902e319aeae8bd7a6299b82a175b0ec5")

    xhr.onreadystatechange = function() {
        
        parser = new DOMParser();
        const data =  parser.parseFromString(xhr.responseText, "text/xml") ;
        var table = document.getElementById('Abfahrtstafel')


        for (var i = 0; i < data.getElementsByTagName('s').length; i++){

        train = data.getElementsByTagName('s')[i]
        trainID = train.getAttribute('id')

        if(document.getElementById(trainID) == null) {

        arrivalTime = ""
        depatureTime = ""

        hasArrival = checkArrival(train)
        hasDepature = checkDepature(train)

        category = train.getElementsByTagName('tl')[0].getAttribute('c')
        trainNumber = train.getElementsByTagName('tl')[0].getAttribute('n')

        if (hasArrival == 1) {
            arrivalTime = DBDateToTime(train.getElementsByTagName('ar')[0].getAttribute('pt'))
            wagenreihungURL = "#top"
            sortTime = makeDateObject(train.getElementsByTagName('ar')[0].getAttribute('pt'))
        } else {arrivalTime = ""}

        if (hasDepature == 1) {
            depatureTime = DBDateToTime(train.getElementsByTagName('dp')[0].getAttribute('pt'))
            wagenreihungURL = "https://www.apps-bahn.de/wgr/wr/800469/20"+date+"/"+category+"/"+trainNumber+"/"+evaNumber+"/20"+train.getElementsByTagName('dp')[0].getAttribute('pt')
            sortTime = makeDateObject(train.getElementsByTagName('dp')[0].getAttribute('pt'))
        } else {depatureTime = ""}


        if (hasDepature == 1) {
            verlauf = train.getElementsByTagName('dp')[0].getAttribute('ppth')
            verlauf = verlauf.split("|")
            ziel = verlauf[verlauf.length - 1]
        } else {
            verlauf = train.getElementsByTagName('ar')[0].getAttribute('ppth')
            verlauf = verlauf.split("|")
            ziel = "von " + verlauf[0]
        }

        if (hasDepature == 1) {
            gleis = train.getElementsByTagName('dp')[0].getAttribute('pp')
        } else {
            gleis = train.getElementsByTagName('ar')[0].getAttribute('pp')
        }

        


            


            var row = `<tr id=${trainID}>
                    <td id=${trainID+"-1a"}>${category}</td>
                    <td id=${trainID+"-1b"}>${trainNumber}</td>
                    <td id=${trainID+"-2"}>${arrivalTime}</td>
                    <td id=${trainID+"-3"}>${depatureTime}</td>
                    <td id=${trainID+"-4"}>${ziel}</td>
                    <td id=${trainID+"-5"}>${gleis}</td>
                    <td id=${trainID+"-6"}><a href=${wagenreihungURL} target="_blank">Wagenreihung</a></td>
                    <td id=${trainID+"-7"}>${sortTime}</td>
                </tr>`
            table.innerHTML += row

        }}
        	
	}
	xhr.send(null)

    
}


function getChanges(evaNumber){
    var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/fchg/" + evaNumber);
	xhr.setRequestHeader("Accept", "application/json")
    xhr.setRequestHeader("DB-Client-ID", "b9fac6fe073cc6244297b2e8587b2ab1")
    xhr.setRequestHeader("DB-Api-Key", "902e319aeae8bd7a6299b82a175b0ec5")

    xhr.onreadystatechange = function() {
        
        parser = new DOMParser();
        const data =  parser.parseFromString(xhr.responseText, "text/xml") ;
        var table = document.getElementById('Abfahrtstafel')
        document.getElementById('evaNumber').innerHTML = data.getElementsByTagName('s').length

        for (var i = 0; i < data.getElementsByTagName('s').length; i++){

        train = data.getElementsByTagName('s')[i]
        trainID = train.getAttribute('id')

        if(document.getElementById(trainID) != null) {

        arrivalTime = ""
        depatureTime = ""

        hasArrival = checkArrival(train)
        hasDepature = checkDepature(train)

        if (hasArrival == 1) {
            arrivalTime = DBDateToTime(train.getElementsByTagName('ar')[0].getAttribute('ct'))
            document.getElementById(trainID + "-2").innerHTML += "(" + arrivalTime + ")"
            document.getElementById(trainID + "-2").id = trainID + "-2c"
            sortTime = makeDateObject(train.getElementsByTagName('ar')[0].getAttribute('ct'))
            document.getElementById(trainID + "-7").innerHTML = sortTime
            document.getElementById(trainID + "-7").id = trainID + "-7c"
        } else {arrivalTime = ""}

        if (hasDepature == 1) {
            depatureTime = DBDateToTime(train.getElementsByTagName('dp')[0].getAttribute('ct'))
            document.getElementById(trainID + "-3").innerHTML += "(" + depatureTime + ")"
            document.getElementById(trainID + "-3").id = trainID + "-3c"
            sortTime = makeDateObject(train.getElementsByTagName('dp')[0].getAttribute('ct'))
            document.getElementById(trainID + "-7").innerHTML = sortTime
            document.getElementById(trainID + "-7").id = trainID + "-7c"
        } else {depatureTime = ""}


        if (hasDepature == 1) {
            verlauf = train.getElementsByTagName('dp')[0].getAttribute('ppth')
        } else {
            verlauf = "von " + train.getElementsByTagName('ar')[0].getAttribute('ppth')
        }

        if (hasDepature == 1) {
            gleis = train.getElementsByTagName('dp')[0].getAttribute('pp')
        } else {
            gleis = train.getElementsByTagName('ar')[0].getAttribute('pp')
        }

        


            
            verlauf = verlauf.split("|")
         /*   var row = `<tr id=${trainID}>
                    <td id=${trainID+"-1a"}>${category}</td>
                    <td id=${trainID+"-1b"}>${trainNumber}</td>
                    <td id=${trainID+"-2"}>${arrivalTime}</td>
                    <td id=${trainID+"-3"}>${depatureTime}</td>
                    <td id=${trainID+"-4"}>${verlauf[verlauf.length - 1]}</td>
                    <td id=${trainID+"-5"}>${gleis}</td>
                    <td id=${trainID+"-6"}><a href=${wagenreihungURL} target="_blank">Wagenreihung</a></td>
                    <td id=${trainID+"-7"}>${sortTime}</td>
                </tr>`
            table.innerHTML += row */

        }}
  	
	}
	xhr.send(null)

    
}




function getCurrentDate(offset) {
  var now = new Date();
  now.setHours(now.getHours() + offset);
  var year = now.getFullYear().toString().slice(-2);
  var month = (now.getMonth() + 1).toString().padStart(2, '0');
  var day = now.getDate().toString().padStart(2, '0');
  
  var currentDate = year + month + day;
  return currentDate;
}

function getCurrentHour(offset) {
    var now = new Date();
    now.setHours(now.getHours() + offset);
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    
    var currentHour = hours;
    return currentHour;
  }

  function getCurrentTime(offset) {
    var now = new Date();
    now.setHours(now.getHours() + offset);
    var year = now.getFullYear().toString().slice(-2);
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    
    var currentTime = year + month + day + hours + minutes;
    return currentTime;
  }

  function DBDateToTime(Date) {
    Date = `${Date}`

    return Date.substring(6,8) + ":" + Date.substring(8)

  }

  function checkArrival(Train) {
    if (train.getElementsByTagName('ar')[0]== undefined) {
        return 0
    } else {
        return 1
    }
  }

  function checkDepature(Train) {
    if (train.getElementsByTagName('dp')[0] == undefined) {
        return 0
    } else {
        return 1
    }
  }


  function makeDateObject(timeString){
    var year = parseInt(timeString.substr(0, 2), 10);
    var month = parseInt(timeString.substr(2, 2), 10) - 1;
    var day = parseInt(timeString.substr(4, 2), 10);
    var hours = parseInt(timeString.substr(6, 2), 10);
    var minutes = parseInt(timeString.substr(8, 2), 10);
    
    var date = new Date();
    date.setFullYear(2000 + year); // Falls das Jahr in der Form YY angegeben ist, hier 2000 addieren
    date.setMonth(month);
    date.setDate(day);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0)

    return date

  }



  function sortTable() {
// Finde die Tabelle
var table = document.getElementById("Abfahrtstafel");

// Finde die Zeilen der Tabelle
var rows = table.getElementsByTagName("tr");

// Konvertiere die Zeilen in ein Array für die Sortierung
var rowsArray = Array.prototype.slice.call(rows, 0);

// Sortiere das Array basierend auf dem Datum
rowsArray.sort(function(a, b) {
  var dateA = new Date(a.cells[7].textContent);
  var dateB = new Date(b.cells[7].textContent);
  return dateA - dateB;
});

// Entferne alle Zeilen aus der Tabelle
while (table.firstChild) {
  table.removeChild(table.firstChild);
}

// Füge die sortierten Zeilen wieder zur Tabelle hinzu
for (var i = 0; i < rowsArray.length; i++) {
  table.appendChild(rowsArray[i]);
}

  }  



  function hideRows() {
    var table = document.getElementById("Abfahrtstafel");
    var rows = table.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) { // Starte bei 1, um die Kopfzeile zu überspringen
      var cells = rows[i].getElementsByTagName("td");
      var dateCell = cells[7]; // 8. Spalte (Index 7)

      var dateValue = new Date(dateCell.innerText);
      var currentDate = new Date();

      if (dateValue < currentDate) {
        rows[i].style.display = "none"; // Ausblenden der Zeile
      }
    }}
