window.onload = function() {
	getDelay("D0");
	getDelay("D1");
	getDelay("D2");
	getDelay("D3");
	getDelay("D4");
	getDelay("D5");
	getDelay("D6");
	getDelay("D7");
	getDelay("D8");
	getDelay("D10");
	getDelay("D11");
	getDelay("D35");
	getDelay("D46");
	getDelay("D48");
	getDelay("D49");
	getDelay("D52");
	getDelay("D55");
	getDelay("D56");
};

function getDelay(road){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.dopravniinfo.cz/RoadData.ashx?road="+road, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var daten = JSON.parse(xhr.responseText);
			
			var a = document.createElement("a");
			var b = document.createElement("b");
			var c = document.createElement("c");
			var d = document.createElement("d");
			a.innerHTML = Math.floor(daten.AggregateFCDData[0].Delay/60) + " min " + daten.AggregateFCDData[0].Delay%60 + " sek"
			if (daten.AggregateFCDData[0].CongestionLength >= 950){
					b.innerHTML = "<font color='red'><b>" + (daten.AggregateFCDData[0].CongestionLength/1000).toFixed(1) + " km " + "</b></font>"
			} else {
					b.innerHTML = (daten.AggregateFCDData[0].CongestionLength/1000).toFixed(1) + " km "
			}
			c.innerHTML = Math.floor(daten.AggregateFCDData[1].Delay/60) + " min " + daten.AggregateFCDData[1].Delay%60 + " sek"
			if (daten.AggregateFCDData[1].CongestionLength >= 950){
					d.innerHTML = "<font color='red'><b>" + (daten.AggregateFCDData[1].CongestionLength/1000).toFixed(1) + " km " + "</b></font>"
			} else {
					d.innerHTML = (daten.AggregateFCDData[1].CongestionLength/1000).toFixed(1) + " km "
			}			
			document.getElementById(road+'_d0_t').innerHTML = a.innerHTML;
			document.getElementById(road+'_d0_c').innerHTML = b.innerHTML;
			document.getElementById(road+'_d1_t').innerHTML = c.innerHTML;
			document.getElementById(road+'_d1_c').innerHTML = d.innerHTML;
		}		
	}
	xhr.send(null)
}
