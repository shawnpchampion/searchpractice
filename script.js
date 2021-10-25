let map = L.map('mymap').setView([19.40746666, -154.9114795], 16);
let ourData = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 20,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

let iconOption = {
    iconUrl: './assets/location-marker.svg',
    iconSize: [30, 30]
};
let ourCustomIcon = L.icon(iconOption);

fetch("./assets/location-data.json")
    .then(response => response.json())
    .then(data => {
        ourData = data;
        for(let i=0;i<data.length;i++) {
            let option = document.createElement("option");
            option.value = i+1;
            option.text = data[i].title;
            document.querySelector(".select-dropdown").appendChild(option);

            let marker = L.marker([data[i].latitude, data[i].longitude], {icon: ourCustomIcon}).bindPopup(`<h3> ${data[i].title} </h3> <p> ${data[i].description} </p>`).on('click', () => {
                map.flyTo([data[i].latitude, data[i].longitude], data[i].zoomLevel, {
            animate: true,
            duration: 2 // in seconds
                }
                         );
            }).addTo(map);
        }
    })
    .catch(error => alert(error))

document.querySelector(".map-zoom-out-btn").addEventListener('click', () => {
    map.flyTo([19.40746666,	-154.9114795], 15);
});

document.querySelector(".search-btn").addEventListener('click', () => {
    let select = document.querySelector(".select-dropdown");
    let value = select.options[select.selectedIndex].value;
    map.flyTo([ourData[value-1].latitude, ourData[value-1].longitude], ourData[value-1].zoomLevel, {
            animate: true,
            duration: 2 // in seconds
                }
             
             );
});


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
function changeStory(id, content) {
	fadeOut(document.getElementById(id)), // Fade out function
//	map.panTo(position, { // Pan map to new location
//        map.flyTo(position, 18, { // Pan map to new location
//		animate:true,
//		duration:panTime
//	}),
	setTimeout(function() { // Wait for a number of miliseconds and then fade in the new story.
		document.getElementById(id).innerHTML = content
		fadeIn(document.getElementById(id))
	}, 650);
	
}


document.getElementById('story').style.opacity = storyOpacity; // Opacity for the story element
document.getElementById('story').style.background = storyBackground;
document.getElementById('story').style.color = storyTextColor;
document.getElementById('story').style.background = storyBackground;
var storyTag = document.getElementById('story');
var links = storyTag.getElementsByTagName('a');
for (var i = 0; 1<links.length; i++) {
	links[i].style.color = storyTextColor;
};
document.getElementById('rewind').style.color = storyTextColor;


var num = -1;

window.onload = function() {
	changeStory('story', startText); //	 Show start story when page has loaded
};

var rewind = document.getElementById('rewind'); // A separate function for stepping backwards in the story
rewind.onclick = function() {
    try {	
	num -= 1;
//	positions.clearLayers(); // Remove any markers
//	if (useMarker) {
//	if (showPopUp) { // Add new marker and pop-up visible or not
//		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]).openPopup();
//	} else {
//		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]);
//	};
//	};
	changeStory('story', storyText[num]); // change the story (function)
    } catch(err) { // If it was the first story do the same, but show the start story again.
	num = -1,
//	positions.clearLayers(),
	changeStory('story', startText),
	setTimeout(function() {
		map.setZoom(16)
	}, 2 * 1000);
    }
};

map.on('click', function() { // Function to forward the story when clicking in the map
   try {
	num += 1;
//	positions.clearLayers(); // Remove any markers
//	if (useMarker) {
//	if (showPopUp) { // Add new marker and pop-up visible or not
//		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]).openPopup();
//	} else {
//		L.marker(position[num]).addTo(positions).bindPopup(bubbleText[num]);
//	};
//	};
	changeStory('story', storyText[num]); // change the story (function)
   } catch(err) { // If this was the last story do the same, but show the start styry and start again.
	fadeOut(document.getElementById('story')),
	num = -1,
//	positions.clearLayers(),
	changeStory('story', startText),
	setTimeout(function() {
		map.setZoom(16)
	}, 2 * 1000);
   }
});



