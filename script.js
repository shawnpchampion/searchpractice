let map = L.map('mymap').setView([19.40746666, -154.9114795], 16);

let ourData = [];



var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
  });


var satmap = document.getElementById('sat-map-btn'); 

satmap.onclick = function() {
map.addLayer(googleSat);
};

var streetmap = document.getElementById('street-map-btn'); 

streetmap.onclick = function() {
map.removeLayer(googleSat);
};

		

var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);



var positionn = [];

fetch("./assets/location-data.json")
    .then(response => response.json())
    .then(data => {
        ourData = data;
        for(let i=0;i<data.length;i++) {
            let option = document.createElement("option");
            option.value = i+1;
            option.text = data[i].title;
   //         document.querySelector(".select-dropdown").appendChild(option);

	let iconOption = {
    iconUrl: data[i].mark,
    iconSize: [30, 30]
};
let ourCustomIcon = L.icon(iconOption);		
            let marker = L.marker([data[i].latitude, data[i].longitude], {icon: ourCustomIcon} )
//	    .bindPopup(`<h3> ${data[i].title} </h3> <p> ${data[i].description} </p>`)
	    .on('click', () => {
                map.flyTo([data[i].latitude, data[i].longitude], data[i].zoomLevel, {
            animate: true,
            duration: 2 // in seconds
                });
  //              changeStory('story', `<h3> ${data[i].title} </h3> <p> ${data[i].description} </p>`); 
                
	     })
	    .addTo(map);
		
	     positionn.push([data[i].latitude, data[i].longitude]);
        }
    })
 //   .catch(error => alert(error))






// Javascript to create a storymap by Klas Karlsson 2014-05-29

function fadeOut(element) {
    var op = element.style.opacity;
    var timer = setInterval(function () {
        if (op <= 0){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op -= 0.05; // this row and the next sets the speed of the fade-out
    }, 4);
}
function fadeIn(element) {
    var op = 0;  // Start Opacity when fading in
    var timer = setInterval(function () {
        if (op >= storyOpacity){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op += 0.04; // this row and the next sets the speed of the fade-in
    }, 20);
}
function changeStory(positionn, id, content) {
	fadeOut(document.getElementById(id)), // Fade out function
		map.flyTo(positionn, 19, { // Pan map to new location
		animate:true,
		duration:2
	});
	setTimeout(function() { // Wait for a number of miliseconds and then fade in the new story.
		 
		document.getElementById(id).innerHTML = content
		fadeIn(document.getElementById(id))
	}, 650);
	
}
var positions = L.layerGroup([]); // This group layer holds dynamically created markers


document.getElementById('story').style.opacity = storyOpacity; // Opacity for the story element
document.getElementById('story').style.background = storyBackground;
document.getElementById('story').style.color = storyTextColor;
var storyTag = document.getElementById('story');
var links = storyTag.getElementsByTagName('a');
for (var i = 0; 1<links.length; i++) {
	links[i].style.color = storyTextColor;
};
document.getElementById('rewind').style.color = storyTextColor;
document.getElementById('forward').style.color = storyTextColor;


var num = -1;

window.onload = function() {
	changeStory(startCoordinate, 'story', startText);
	setTimeout(function() {
		map.setZoom(startZoom)
	}, 6);
//	alert(num); //	 Show start story when page has loaded
};

var rewind = document.getElementById('rewind'); // A separate function for stepping backwards in the story
rewind.onclick = function() {
    try {	
	num -= 1;
//	alert(num); 
	if(num < -1) throw "too high";    
	changeStory(positionn[num],'story', storyText[num]); // change the story (function)
    } catch(err) { // If it was the first story do the same, but show the start story again.
	num = -1,	
	changeStory(startCoordinate, 'story', startText);
	setTimeout(function() {
		map.setZoom(startZoom)
	}, 2 * 1000);    
    }
};



var forward = document.getElementById('forward'); 

forward.onclick = function() {
   try {
	num += 1;
//	alert(num);  
	if(num > 2) throw "too low";   
	changeStory(positionn[num], 'story', storyText[num]); // change the story (function)
   } catch(err) { // If this was the last story do the same, but show the start styry and start again.
	fadeOut(document.getElementById('story')),
	num = -1,
	changeStory(startCoordinate, 'story', startText);
	   	map.setZoom(startZoom);
//	   setTimeout(function() {
//		map.setZoom(startZoom)
//	}, 2 * 1000);
   }
};



