function getAbfahrtstafel(ril100,hour){
	
    if(document.getElementById("Abfahrtstafel") == null) {
        var Abfahrtstafel = document.createElement("TABLE")
    Abfahrtstafel.setAttribute("id","Abfahrtstafel")    
    document.body.appendChild(Abfahrtstafel)
    } else {
        var Abfahrtstafel = document.getElementById("Abfahrtstafel")
        Abfahrtstafel.innerHTML = ""
    }

    

    Abfahrtstafel.innerHTML = getDepatures(8010085)
    
    
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


function getWagenreihung(date,category,trainNumber,evaNumber,time) {
    
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.apps-bahn.de/wgr/wr/800469/"+date+"/"+category+"/"+trainNumber+"/"+evaNumber+"/"+date+time, true);
	xhr.setRequestHeader("Accept", "application/json")
    xhr.onreadystatechange = function() {
        const data = JSON.parse(xhr.responseText);


	}
	xhr.send(null)

}

function tryAPI(link){
    var xhr = new XMLHttpRequest();
	xhr.open("GET", link, true);
	xhr.setRequestHeader("Accept", "application/json")
    xhr.onreadystatechange = function() {
        const data = JSON.parse(xhr.responseText);
        return data	
	}
	xhr.send(null)

    
}


function getDepatures(evaNumber){
    var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/fchg/"+ evaNumber, true);
	xhr.setRequestHeader("Accept", "application/json")
    xhr.setRequestHeader("DB-Client-ID", "b9fac6fe073cc6244297b2e8587b2ab1")
    xhr.setRequestHeader("DB-Api-Key", "902e319aeae8bd7a6299b82a175b0ec5")

    xhr.onreadystatechange = function() {
        
        parser = new DOMParser();
        const data =  parser.parseFromString(xhr.responseText, "text/xml") ;
        var table = document.getElementById('Abfahrtstafel')

        train = data.getElementsByTagName('ar')

        var row = `<tr>
                       
                <td>${"1 - "+train[2].getAttribute('ct')}</td> 
                <td>${"2 - "+data.evaluate('//s[0]/ar/m[1]/@c',data,null,XPathResult.STRING_TYPE, null).stringValue}</td>
                <td>${"dkdj"}</td>
            </tr>`
        table.innerHTML += row


        	
	}
	xhr.send(null)

    
}


