const tempText = document.querySelector(".today-panel .temp");
const detailedText = document.querySelector(".today-panel .detailed");
const descText = document.querySelector(".today-panel .desc");
const dayText = document.querySelector(".today-panel .title");
const icon = document.querySelector(".today-panel img");


function getLoc() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPos);
	} else {
		console.log("geolocation is not supported; please upgrade to a newer browser");
	}
}

function Panel(temp, title, desc) {
	this.temp = temp;
	this.title = title;
	this.desc = desc;

	this.panel = document.createElement("div");
	this.panel.className = "panel";
	document.querySelector(".panels").appendChild(this.panel);
	this.titleText = document.createElement("h4");
	this.titleText.innerHTML = this.title;
	this.titleText.className = "title";
	this.panel.appendChild(this.titleText)
	this.tempText = document.createElement("h1");
	this.tempText.innerHTML = this.temp;
	this.tempText.className = "temp";
	this.panel.appendChild(this.tempText)
	this.descText = document.createElement("h5");
	this.descText.innerHTML = this.desc;
	this.descText.className = "desc";
	this.panel.appendChild(this.descText);
}


let panels = [];

function showPos(pos) {
	let request = new XMLHttpRequest();
	request.open('GET', `https://api.weather.gov/points/${pos.coords.latitude},${pos.coords.longitude}`, true);
	request.addEventListener("load", () => {
		const data = JSON.parse(request.responseText).properties;
		let forecastRequest = new XMLHttpRequest();
		forecastRequest.open('GET', data.forecast, true);
		forecastRequest.addEventListener("load", () => {
			let forecastData = JSON.parse(forecastRequest.responseText);
			let elevation = forecastData.properties.elevation.value;
			console.log(forecastData.properties);
			let periods = forecastData.properties.periods;
			for (let i = 0; i < periods.length; i++) {
				let day = periods[i].name;
				let temp = periods[i].temperature;
				let detailed = periods[i].detailedForecast;
				let forecastDesc = periods[i].shortForecast;
				console.log(`${day}\n elevation: ${elevation}\n temperature: ${temp}${periods[i].temperatureUnit}\n description: ${detailed}\n description: ${forecastDesc}`);
				dayText.innerHTML = periods[0].name;

				let C = Math.round((periods[0].temperature - 32) * 5/9);

				tempText.innerHTML = periods[0].temperature + "° " + periods[0].temperatureUnit + "<br> " + C + "° C";
				detailedText.innerHTML = periods[0].detailedForecast;
				descText.innerHTML = periods[0].shortForecast;
				icon.src = periods[0].icon;
			}
			for (let i = 1; i < periods.length; i++) {
				panels[i] = new Panel(periods[i].temperature, periods[i].name, periods[1].shortForecast);
			}
		});
		forecastRequest.send();
	});
	request.send();
}

getLoc();