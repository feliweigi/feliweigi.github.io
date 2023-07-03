let evaNumber;
let trainID;
let data;
let MessageCodes

async function getAbfahrtstafel(ril100) {
  var Abfahrtstafel = document.getElementById("Abfahrtstafel");
  Abfahrtstafel.innerHTML = "";

  document.getElementById("Changes").innerHTML = "";
loadMessageText()
getStationEvaNumber(ril100)
  for (var i = -3; i < 3; i++) {
    getDepatures(evaNumber, getCurrentDate(i), getCurrentHour(i));
  }

  

  
  hideRows(sortTable(getChanges(evaNumber)));
}

function getStationEvaNumber(ril100) {
  var myHeaders = new Headers();
  myHeaders.append("DB-Client-ID", "b9fac6fe073cc6244297b2e8587b2ab1");
  myHeaders.append("DB-Api-Key", "902e319aeae8bd7a6299b82a175b0ec5");

  fetch(
    "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/station/" +
      ril100,
    {
      method: "GET",
      headers: myHeaders,
    }
  )
    .then(function (response) {
      return response.text(); // Die Antwort als Text erhalten
    })
    .then(function (data) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data, "text/xml"); // Das XML in ein XML-Dokument umwandeln
      console.log(xmlDoc);
      // Du kannst nun auf die Daten im XML-Dokument zugreifen
      // Das erste <station>-Element auswählen
      var stationElement = xmlDoc.querySelector("station");

      // Den Wert des "eva"-Attributs auslesen
      evaNumber = stationElement.getAttribute("eva");
      document.getElementById("evaNumber").innerHTML = evaNumber;

      // Verarbeite die XML-Daten weiter...
    })
    .catch(function (error) {
      // Fehlerbehandlung
    });
}

function getChanges(evaNumber) {
  var myHeaders = new Headers();
  myHeaders.append("DB-Client-ID", "b9fac6fe073cc6244297b2e8587b2ab1");
  myHeaders.append("DB-Api-Key", "902e319aeae8bd7a6299b82a175b0ec5");

  fetch(
    "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/fchg/" +
      evaNumber,
    {
      method: "GET",
      headers: myHeaders,
    }
  )
    .then(function (response) {
      return response.text(); // Die Antwort als Text erhalten
    })
    .then(function (data) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data, "text/xml"); // Das XML in ein XML-Dokument umwandeln
      console.log("Changes:");
      console.log(xmlDoc);
      console.log(xmlDoc.getElementsByTagName("s").length + " Einträge");

      for (var i = 0; i < xmlDoc.getElementsByTagName("s").length; i++) {
        train = xmlDoc.getElementsByTagName("s")[i];
        trainID = train.getAttribute("id");
        console.log(train);

        if (document.getElementById(trainID) != null) {
          hasArrival = checkArrival(train);
          hasDepature = checkDepature(train);

          if (hasArrival) {
            console.log(i + ":hasArrival");
            realArrivalTime = DBDateToTime(
              train.getElementsByTagName("ar")[0].getAttribute("ct")
            )
            ArrivalDifference = calculateTimeDifference(document.getElementById(trainID + "-2").innerHTML,realArrivalTime)
            console.log("Difference:" + ArrivalDifference)
            
            sortTime = makeDateObject(
              train.getElementsByTagName("ar")[0].getAttribute("ct")
            );
            console.log("sortTime Arrival");
            console.log(sortTime);
            if (ArrivalDifference>0) {
                ArrivalDifference="+"+ArrivalDifference
                if(ArrivalDifference>4){
                    document.getElementById(trainID + "-2").className = "delayed"
                } else{document.getElementById(trainID + "-2").className = "slightly_delayed"}
             } else{
                if(ArrivalDifference == 0) {
                    document.getElementById(trainID + "-2").className = "onPoint"
                }else{document.getElementById(trainID + "-2").className = "early"}
             }
            console.log(realArrivalTime + "(" + ArrivalDifference + ")")
            document.getElementById(trainID + "-2").innerHTML =
                realArrivalTime + "(" + ArrivalDifference + ")"
            console.log("changed Arrival");
            document.getElementById(trainID + "-7").innerHTML = sortTime;
            console.log("changed sortTime Arrival");




          } else {
            console.log(i + ":hasNoArrival");
          }

          if(checkForNewPlatformArrival(train)==1){
            document.getElementById(trainID + "-5").className = "delayed"
            document.getElementById(trainID + "-5").innerHTML = train.getElementsByTagName("ar")[0].getAttribute("cp")
           }

          if (train.getElementsByTagName("ar")[0] != undefined) {
            if (
              train.getElementsByTagName("ar")[0].getAttribute("cs") != null
            ) {
                console.log("Ankunft fällt aus")
                try {
                    document.getElementById(trainID).className = "cancelled"
                    document.getElementById(trainID + "-2").className = "cancelled"
                } catch (error) {
                    document.getElementById(trainID).className = "cancelled"
                }

            }
          }

          if (train.getElementsByTagName("dp")[0] != undefined) {
            if (
              train.getElementsByTagName("dp")[0].getAttribute("cs") != null
            ) {
                console.log("Abfahrt fällt aus")
                try {
                    document.getElementById(trainID).className = "cancelled"
                    document.getElementById(trainID + "-3").className = "cancelled"
                } catch (error) {
                    document.getElementById(trainID).className = "cancelled"
                }

            } else {document.getElementById(trainID).className = ""}
          }

          if (hasDepature) {
            console.log(i + ":hasDepature");
            realDepatureTime = DBDateToTime(
              train.getElementsByTagName("dp")[0].getAttribute("ct")
            )
            DepatureDifference = calculateTimeDifference(document.getElementById(trainID + "-3").innerHTML,realDepatureTime)
            console.log(realDepatureTime);
            sortTime = makeDateObject(
              train.getElementsByTagName("dp")[0].getAttribute("ct")
            );
            console.log("sortTime Depature");
            
            if (DepatureDifference>0) {
                DepatureDifference="+"+DepatureDifference
                
                if(DepatureDifference>4){
                    document.getElementById(trainID + "-3").className = "delayed"
                } else{document.getElementById(trainID + "-3").className = "slightly_delayed"}
             } else{
                if(DepatureDifference == 0) {
                    document.getElementById(trainID + "-3").className = "onPoint"
                }else{document.getElementById(trainID + "-3").className = "early"}
             }
             document.getElementById(trainID + "-3").innerHTML =
             realDepatureTime + "(" + DepatureDifference + ")"
            console.log("changed Depature");
            try {
              document.getElementById(trainID + "-7").innerHTML = sortTime;
            } catch (error) {
              document.getElementById(trainID + "-7").innerHTML = sortTime;
            }
            console.log("changed sortTime Depature");




          } else {
            console.log(i + ":hasNoDepature");
          }

          if(checkForNewPlatformDepature(train)==1){
            document.getElementById(trainID + "-5").className = "delayed"
            document.getElementById(trainID + "-5").innerHTML = train.getElementsByTagName("dp")[0].getAttribute("cp")
           }

           trainMessage = checkMessages(train)
           trainMessage = trainMessage.split("<br>").toString()
           if (trainMessage.length > 0) {
            document.getElementById(trainID + "-4").innerHTML = ("<span class='delayMessage'>" + trainMessage +"</span></br>" + document.getElementById(trainID + "-4").innerHTML)
           }
           
        }


        


        // Verarbeite die XML-Daten weiter...
      }
    })
    .catch(function (error) {
      // Fehlerbehandlung
    });
}

function getDepatures(evaNumber, date, hour) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/" +
      evaNumber +
      "/" +
      date +
      "/" +
      hour,
    true
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("DB-Client-ID", "b9fac6fe073cc6244297b2e8587b2ab1");
  xhr.setRequestHeader("DB-Api-Key", "902e319aeae8bd7a6299b82a175b0ec5");

  xhr.onreadystatechange = function () {
    parser = new DOMParser();
    const data = parser.parseFromString(xhr.responseText, "text/xml");
    var table = document.getElementById("Abfahrtstafel");

    for (var i = 0; i < data.getElementsByTagName("s").length; i++) {
      train = data.getElementsByTagName("s")[i];
      trainID = train.getAttribute("id");

      if (document.getElementById(trainID) == null) {
        arrivalTime = "";
        depatureTime = "";

        hasArrival = checkArrival(train);
        hasDepature = checkDepature(train);

        category = train.getElementsByTagName("tl")[0].getAttribute("c");
        trainNumber = train.getElementsByTagName("tl")[0].getAttribute("n");

        if (hasArrival == 1) {
          arrivalTime = DBDateToTime(
            train.getElementsByTagName("ar")[0].getAttribute("pt")
          );
          wagenreihungURL = "#top";
          sortTime = makeDateObject(
            train.getElementsByTagName("ar")[0].getAttribute("pt")
          );
        } else {
          arrivalTime = "";
        }

        if (hasDepature == 1) {
          depatureTime = DBDateToTime(
            train.getElementsByTagName("dp")[0].getAttribute("pt")
          );
          wagenreihungURL =
            "https://www.apps-bahn.de/wgr/wr/800469/20" +
            date +
            "/" +
            category +
            "/" +
            trainNumber +
            "/" +
            evaNumber +
            "/20" +
            train.getElementsByTagName("dp")[0].getAttribute("pt");
          sortTime = makeDateObject(
            train.getElementsByTagName("dp")[0].getAttribute("pt")
          );
        } else {
          depatureTime = "";
        }

        if (hasDepature == 1) {
          verlauf = train.getElementsByTagName("dp")[0].getAttribute("ppth");
          verlauf = verlauf.split("|");
          ziel = verlauf[verlauf.length - 1];
        } else {
          verlauf = train.getElementsByTagName("ar")[0].getAttribute("ppth");
          verlauf = verlauf.split("|");
          ziel = "von " + verlauf[0];
        }

        if (hasDepature == 1) {
          gleis = train.getElementsByTagName("dp")[0].getAttribute("pp");
        } else {
          gleis = train.getElementsByTagName("ar")[0].getAttribute("pp");
        }

        var row = `<tr id=${trainID}>
                    <td id=${trainID + "-1a"}>${category}</td>
                    <td id=${trainID + "-1b"}>${trainNumber}</td>
                    <td id=${trainID + "-2"} class="planned">${arrivalTime}</td>
                    <td id=${trainID + "-3"} class="planned">${depatureTime}</td>
                    <td id=${trainID + "-4"}>${ziel}</td>
                    <td id=${trainID + "-5"}>${gleis}</td>
                    <td id=${trainID + "-6"}><a href=${wagenreihungURL} target="_blank"><img src="https://www.img-bahn.de/s3/prod/v/img_responsive/20dp_icon_transportation_car-sequence.svg"></img></a></td>
                    <td id=${trainID + "-7"}>${sortTime}</td>
                </tr>`;
        table.innerHTML += row;
      }
    }
  };
  xhr.send(null);
}

function getCurrentDate(offset) {
  var now = new Date();
  now.setHours(now.getHours() + offset);
  var year = now.getFullYear().toString().slice(-2);
  var month = (now.getMonth() + 1).toString().padStart(2, "0");
  var day = now.getDate().toString().padStart(2, "0");

  var currentDate = year + month + day;
  return currentDate;
}

function getCurrentHour(offset) {
  var now = new Date();
  now.setHours(now.getHours() + offset);
  var hours = now.getHours().toString().padStart(2, "0");
  var minutes = now.getMinutes().toString().padStart(2, "0");

  var currentHour = hours;
  return currentHour;
}

function getCurrentTime(offset) {
  var now = new Date();
  now.setHours(now.getHours() + offset);
  var year = now.getFullYear().toString().slice(-2);
  var month = (now.getMonth() + 1).toString().padStart(2, "0");
  var day = now.getDate().toString().padStart(2, "0");
  var hours = now.getHours().toString().padStart(2, "0");
  var minutes = now.getMinutes().toString().padStart(2, "0");

  var currentTime = year + month + day + hours + minutes;
  return currentTime;
}

function DBDateToTime(Date) {
  Date = `${Date}`;

  return Date.substring(6, 8) + ":" + Date.substring(8);
}

function checkArrival(Train) {
  console.log("Checking for Arrival");
  if (train.getElementsByTagName("ar")[0] == undefined) {
    return 0;
  } else {
    if (
      train.getElementsByTagName("ar")[0].getAttribute("pt") != undefined ||
      train.getElementsByTagName("ar")[0].getAttribute("ct") != undefined
    ) {
      return 1;
    } else {
      return 0;
    }
  }
}

function checkDepature(Train) {
  console.log("Checking for Depature");
  if (train.getElementsByTagName("dp")[0] == undefined) {
    return 0;
  } else {
    if (
      train.getElementsByTagName("dp")[0].getAttribute("pt") != undefined ||
      train.getElementsByTagName("dp")[0].getAttribute("ct") != undefined
    ) {
      return 1;
    } else {
      return 0;
    }
  }
}

function makeDateObject(timeString) {
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
  date.setSeconds(59);

  return date;
}

function sortTable(dummy) {
  // Finde die Tabelle
  var table = document.getElementById("Abfahrtstafel");

  // Finde die Zeilen der Tabelle
  var rows = table.getElementsByTagName("tr");

  // Konvertiere die Zeilen in ein Array für die Sortierung
  var rowsArray = Array.prototype.slice.call(rows, 0);

  // Sortiere das Array basierend auf dem Datum
  rowsArray.sort(function (a, b) {
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

function hideRows(dummy) {
  var table = document.getElementById("Abfahrtstafel");
  var rows = table.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    // Starte bei 1, um die Kopfzeile zu überspringen
    var cells = rows[i].getElementsByTagName("td");
    var dateCell = cells[7]; // 8. Spalte (Index 7)

    var dateValue = new Date(dateCell.innerText);
    var currentDate = new Date();

    if (dateValue < currentDate) {
      rows[i].style.display = "none"; // Ausblenden der Zeile
    }
  }
}

function calculateTimeDifference(time1, time2) {
    // Zerlege die Zeichenketten in Stunden und Minuten
    var [hours1, minutes1] = time1.split(':');
    var [hours2, minutes2] = time2.split(':');
    
    // Konvertiere die Stunden und Minuten in Zahlen
    var totalMinutes1 = parseInt(hours1) * 60 + parseInt(minutes1);
    var totalMinutes2 = parseInt(hours2) * 60 + parseInt(minutes2);
    
    // Berechne die Differenz in Minuten
    var difference = totalMinutes2 - totalMinutes1;


    if(difference<-100){
        difference = difference + 1440
    }

    
    
    return difference;
  }

function checkForNewPlatformArrival(train){
  console.log("Checking for Platform");
  if (train.getElementsByTagName("ar")[0] == undefined) {
    return 0;
  } else {
    if (
      train.getElementsByTagName("ar")[0].getAttribute("cp") != undefined
    ) {
      console.log("found new Platform Arrival")
      return 1;
    } else {
      return 0;
    }
  }  

}

function checkForNewPlatformDepature(train){
  console.log("Checking for Platform");
  if (train.getElementsByTagName("dp")[0] == undefined) {
    return 0;
  } else {
    if (
      train.getElementsByTagName("dp")[0].getAttribute("cp") != undefined
    ) {
      console.log("found new Platform Depature")
      return 1;
    } else {
      return 0;
    }
  }  

}

function checkMessages(train){
  const messages = []
  const usedCodes  = []

  if(train.getElementsByTagName("dp")[0] == undefined){



  } else {
    if(train.getElementsByTagName("dp")[0].getElementsByTagName("m").length > 0){
      for(var i = 0; i < (train.getElementsByTagName("dp")[0].getElementsByTagName("m").length); i++){
        code = train.getElementsByTagName("dp")[0].getElementsByTagName("m")[i].getAttribute('c')
        if(((! (usedCodes.includes(code))) && (code > 0)) && (code < 100)){
          console.log(code)
          usedCodes.push(code)
          console.log(usedCodes)
          messageText = getMessagefromCode(code)
          messages.push(messageText)
          console.log(messages)


        }



      }
    }


  }




  return messages
}


function getMessagefromCode(code){
      console.log(MessageCodes.getElementsByTagName('c')[code].getAttribute('content'))
      delayText = MessageCodes.getElementsByTagName('c')[code].getAttribute('content')
      return delayText
}


function loadMessageText(){
  fetch(
    "messages.xml",
    {
      method: "GET",
    }
  )
    .then(function (response) {
      return response.text(); // Die Antwort als Text erhalten
    })
    .then(function (data) {
      var parser = new DOMParser();
      MessageCodes = parser.parseFromString(data, "text/xml"); // Das XML in ein XML-Dokument umwandeln      
      // Du kannst nun auf die Daten im XML-Dokument zugreifen
      // Das erste <station>-Element auswählen
      // Verarbeite die XML-Daten weiter...
    })
    .catch(function (error) {
      // Fehlerbehandlung
    });  
}
