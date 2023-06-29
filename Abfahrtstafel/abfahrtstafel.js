function getDepatures(ril100,hour){
	
    if(document.getElementById("Abfahrtstafel") == null) {
        var Abfahrtstafel = document.createElement("TABLE")
    Abfahrtstafel.setAttribute("id","Abfahrtstafel")    
    document.body.appendChild(Abfahrtstafel)
    } else {
        var Abfahrtstafel = document.getElementById("Abfahrtstafel")
        Abfahrtstafel.innerHTML = ""
    }

    Abfahrtstafel.innerHTML = getStationID(ril100)
    
    
    }

function getStationID(ril100) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://bahn.expert/api/stopPlace/v1/search/"+ril100+"?filterForIris=true&max=1&groupedBySales=false", true);
	xhr.setRequestHeader("Accept", "application/json")
    xhr.onreadystatechange = function() {
        const data = JSON.parse(xhr.responseText);
        return data.evaNumber	
	}
	xhr.send(null)





}