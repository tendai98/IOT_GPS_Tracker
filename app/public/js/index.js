
let selectedLocation = null
let map = null
let marker = null
let currentPosition = null
let locationTrace = null

function getCurrentLocationFix(){
    $.getJSON(`http://${window.location.host}/location`, (response) => {
        
        let lat =  parseFloat(response.message.latitude)
        let lng =  parseFloat(response.message.longitude)

        if(!currentPosition){
            currentPosition = new google.maps.Marker({
                position: {lat:lat, lng:lng},
                map,
                title:"Current Location",
            })
        }else{
            const newLocationUpdate = new google.maps.LatLng(lat, lng)
            currentPosition.setPosition(newLocationUpdate)
        }
    })
}

function setDestinationLocation(){
    if(selectedLocation){
        $.get(`http://${window.location.host}/set-destination?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}`)
    }else{
        alert("Select Destination")
    }
}

function getDestinationLocation(){
    $.getJSON(`http://${window.location.host}/get-destination`, (response) => {
        if(response.message){

            if(marker){
                marker.setMap(null)

                marker = new google.maps.Marker({
                    map:map,
                    animation: google.maps.Animation.DROP,
                })

                let lat = parseFloat(response.message.latitude)
                let lng = parseFloat(response.message.longitude)

                marker.setPosition({lat: lat, lng: lng})
                marker.setMap(map)
            }
        }else{
            alert("NO Destination Set")   
        }
    })
}

function userLogout(){
    window.location.href="/index.html"
}

function showLocationTrace(){
    $.getJSON(`http://${window.location.host}/log`, (response) => {
        let geoPoints = []

        if(response.message){
            if(locationTrace){
                locationTrace.setMap(null)
            }

            for( let pointIndex in response.message){
                let lat = parseFloat(response.message[pointIndex].latitude)
                let lng = parseFloat(response.message[pointIndex].longitude)
                geoPoints.push({lat: lat, lng:lng})
            }

            locationTrace = new google.maps.Polyline({
                path: geoPoints,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,            
            })

            locationTrace.setMap(map)
        }

    })
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
        lat: -17.397,
        lng: 30.172
        },
        zoom: 9
    });

    marker = new google.maps.Marker({
        map:map,
        animation: google.maps.Animation.DROP,
    })

    map.addListener('click', (event) => {
        console.log(event.latLng)
        marker.setPosition(event.latLng)
        marker.setMap(map)
        selectedLocation = {lat:event.latLng.lat(),  lng:event.latLng.lng()}
    })
    
}

setInterval(getCurrentLocationFix, 2000)