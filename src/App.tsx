import './App.css';
import Grid from '@mui/material/Unstable_Grid2';
import Indicator from './components/Indicator';
import BasicTable from './components/BasicTable';
import WeatherChart from './components/WeatherChart';
import WeatherChart2 from './components/WeatherChart2';
import ControlPanel from './components/ControlPanel';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

export function App() {
	{ /* Variable de estado y función de actualización */ }

	let [indicators, setIndicators] = useState([]);
	let [selectedVariable, setSelectedVariable] = useState("");
	let [rowsTable, setRowsTable] = useState([]);


	useEffect(() => {
		(async () => {


			{ /* Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime */ }

			let savedTextXML = localStorage.getItem("openWeatherMap");
			let expiringTime = localStorage.getItem("expiringTime");

			{ /* Estampa de tiempo actual */ }

			let nowTime = (new Date()).getTime();

			{ /* Realiza la petición asicrónica cuando:
             (1) La estampa de tiempo de expiración (expiringTime) es nula, o
             (2) La estampa de tiempo actual es mayor al tiempo de expiración */
			}

			if (expiringTime === null || nowTime > parseInt(expiringTime)) {

				{ /* Request */ }

				let API_KEY = "2088a864fcc42b4a4ec681a31f48ff12";
				let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
				savedTextXML = await response.text();


				{ /* Diferencia de tiempo */ }

				let hours = 1;
				let delay = hours * 3600000;


				{ /* En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración */ }

				localStorage.setItem("openWeatherMap", savedTextXML);
				localStorage.setItem("expiringTime", (nowTime + delay).toString());
			}


			{ /* XML Parser */ }

			const parser = new DOMParser();
			const xml = parser.parseFromString(savedTextXML, "application/xml");

			{ /* Arreglo para agregar los resultados */ }

			let dataToIndicators = new Array();

			{ /*
            Análisis, extracción y almacenamiento del contenido del XML
            en el arreglo de resultados
        */
			}
			let cityName = xml.getElementsByTagName("name")[0].innerHTML;
			dataToIndicators.push(["City", "Name", cityName]);

			let location = xml.getElementsByTagName("location")[1];

			let geobaseid = location.getAttribute("geobaseid");
			dataToIndicators.push(["Location", "geobaseid", geobaseid]);

			let latitude = location.getAttribute("latitude");
			dataToIndicators.push(["Location", "Latitude", latitude]);

			let longitude = location.getAttribute("longitude");
			dataToIndicators.push(["Location", "Longitude", longitude]);

			console.log(dataToIndicators);
			{ /* Renderice el arreglo de resultados en un arreglo de elementos Indicator */ }

			let indicatorsElements = Array.from(dataToIndicators).map(
				(element) => <Indicator title={element[0]} subtitle={element[1]} value={element[2]} />
			);

			{ /* Modificación de la variable de estado mediante la función de actualización */ }

			setIndicators(indicatorsElements);

			let arrayObjects = Array.from(xml.getElementsByTagName("time")).map((timeElement) => {

				let rangeHours = timeElement.getAttribute("from").split("T")[1] + " - " + timeElement.getAttribute("to").split("T")[1];

				let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " " + timeElement.getElementsByTagName("windDirection")[0].getAttribute("code");
				let windSpeed = timeElement.getElementsByTagName("windSpeed")[0].getAttribute("mps") + " " + timeElement.getElementsByTagName("windSpeed")[0].getAttribute("unit");
				let windGust = timeElement.getElementsByTagName("windGust")[0].getAttribute("gust") + " " + timeElement.getElementsByTagName("windGust")[0].getAttribute("unit");
				let temperature = timeElement.getElementsByTagName("temperature")[0].getAttribute("value") + " " + timeElement.getElementsByTagName("temperature")[0].getAttribute("unit");
				let precipitation = timeElement.getElementsByTagName("precipitation")[0].getAttribute("probability");
				let pressure = timeElement.getElementsByTagName("pressure")[0].getAttribute("value") + " " + timeElement.getElementsByTagName("pressure")[0].getAttribute("unit");
				let humidity = timeElement.getElementsByTagName("humidity")[0].getAttribute("value") + " " + timeElement.getElementsByTagName("pressure")[0].getAttribute("unit");


				return {
					"rangeHours": rangeHours, "windDirection": windDirection, "windSpeed": windSpeed, "windGust": windGust, "temperature": temperature, "precipitation": precipitation, "pressure": pressure,
					"humidity": humidity
				};

			});

			arrayObjects = arrayObjects.slice(0, 8);

			{ /* 3. Actualice de la variable de estado mediante la función de actualización */ }

			setRowsTable(arrayObjects);

		})();
	}, []);

	return (



		<Grid container spacing={6}>
			<Grid xs={12}>
				<div className="weather-banner">
					<Typography variant="h3" className="weather-header">
						Weather Dashboard
					</Typography>
				</div>
			</Grid>
			<Grid alignItems={"center"} xs={12} lg={12}>
				<h1>Indicadores</h1>
			</Grid>

			<Grid xs={6} lg={6}>
				{indicators[0]}

			</Grid>
			<Grid xs={6} lg={6}>
				{indicators[1]}

			</Grid>
			<Grid xs={6} lg={6}>
				{indicators[2]}

			</Grid>
			<Grid xs={6} lg={6}>
				{indicators[3]}

			</Grid>

			<Grid xs={12} lg={12}>
				<ControlPanel setSelectedVariable={setSelectedVariable} />
			</Grid>
			<Grid alignItems={"center"} xs={12} lg={12}>
				<h1>Predicciones</h1>
			</Grid>
			<Grid xs={12} lg={12}>

				{/* 4. Envíe la variable de estado (dataTable) como prop (input) del componente (BasicTable) */}

				<BasicTable rows={rowsTable}></BasicTable>

			</Grid>
			<Grid alignItems={"center"} xs={12} lg={12}>
				<h1>Graficos</h1>
			</Grid>
			<Grid xs={6} lg={6}>
				<WeatherChart></WeatherChart>
			</Grid>
			<Grid xs={6} lg={6}>
				<WeatherChart2></WeatherChart2>
			</Grid>




		</Grid>
	);
}
