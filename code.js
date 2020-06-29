//gets the users latitude longitude position from the inbuild geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
		showMessage("It looks like your device doesn't support geolocation, try entering a postcode instead.", "alert-dark");
    }
}

//runs when the geolocation was successful
function geolocationSuccess(position){
	findNearest(position.coords.latitude, position.coords.longitude);
}

//runs when the geolocation failed
function geolocationError(){
	showMessage("You need to allow access to your location to use this feature.");
}

//gets a latitude longitude position for the given post code
function getLocationFromPostCode(){
	var postCode = document.forms["postCodeForm"]["postcode"].value;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var result = JSON.parse(this.responseText);
			findNearest(result.result.latitude, result.result.longitude);
		}
		
		if (this.status == 404 || this.status == 400){
			showMessage("Whoops, that postcode was not valid. Please try again.", "alert-warning");
		}
	};
  xhttp.open("GET", "https://api.postcodes.io/postcodes/"+postCode, true);
  xhttp.send();
  return false;
}

//finds the restaurant nearest to the given point
function findNearest(latitude, longitude){
	//parses the json file
	var restaurants = JSON.parse(restaurantData);

	if	(restaurants != null){
		
		//defaults the nearest restaurant to the first in the array
		var currentNearest = 0;
		var shortestLength = distance(restaurants[0].latitude, restaurants[0].longitude, latitude, longitude, "M");
		
		//loop through the array, if a new nearest restaurant is found, adjust values as needed
		if (restaurants.length >= 1){
			for (var i=1; i < restaurants.length; i++){
				var distanceToPoint = distance(restaurants[i].latitude, restaurants[i].longitude, latitude, longitude, "M");
				if (distanceToPoint < shortestLength){
					shortestLength = distanceToPoint;
					currentNearest = i;
				}
			}
		}
		
		//round the distance
		var finalDistance = Math.round(shortestLength);
		
		//this block ensures the alert is worded correctly
		if (finalDistance == 1){
			showMessage("<strong>Great News!</strong> Your nearest restaurant is only "+finalDistance+" mile away in "+restaurants[currentNearest].restaurantName+".<br> <a href='#' class='alert-link'>Click here to find out more.</a>", "alert-success");
		}else if (finalDistance == 0){
			showMessage("<strong>Great News!</strong> Your nearest restaurant is "+finalDistance+" miles away in "+restaurants[currentNearest].restaurantName+".<br> <a href='#' class='alert-link'>Click here to find out more.</a>", "alert-success");
		}else if (finalDistance > 30){
			showMessage("It looks like our nearest restaurant is "+finalDistance+" miles away in "+restaurants[currentNearest].restaurantName+".<br> <a href='#' class='alert-link'>Click here to find out more.</a>", "alert-success");
		}else{
			showMessage("<strong>Great News!</strong> Your nearest restaurant is only "+finalDistance+" miles away in "+restaurants[currentNearest].restaurantName+".<br> <a href='#' class='alert-link'>Click here to find out more.</a>", "alert-success");
		}
		
	}
}

//this shows a message containing the given string. an alert type can be passes in, this defaults to alert-dark 
function showMessage(message, alertType){
	if (alertType == null){
		alertType = "alert-dark";
	}
	document.getElementById("location_alert_placeholder").innerHTML = '<div class="alert '+alertType+' alert-dismissible fade show"><button type="button" class="close" data-dismiss="alert">&times;</button>'+message+'</div>';
}

//gets the distance between two sets of coordinates, defaults to miles, K or N can be passed in for kilometers or nautical miles
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}