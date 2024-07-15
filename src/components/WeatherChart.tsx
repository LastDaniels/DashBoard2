import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import Paper from '@mui/material/Paper';
import "../App.css"


export default function WeatherChart() {
    const [chart, setChart] = useState([]);
    
    useEffect(() => {
        (async () => {
            let API_KEY = "2088a864fcc42b4a4ec681a31f48ff12";
            let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
            let savedTextXML = await response.text();

            const parser = new DOMParser();
            const xml = parser.parseFromString(savedTextXML, "application/xml");

            const timeElements = xml.getElementsByTagName('time');
            const data: Array<Array<any>> = [['Tiempo', 'Temperatura (kelvin)', 'Sensacion termica (kelvin)']];

            for (let i = 0; i < timeElements.length; i++) {
                let from = timeElements[i].getAttribute('from').slice(11, 16);
                let temperature = parseFloat(timeElements[i].getElementsByTagName('temperature')[0].getAttribute('value'));
                let feels_like = parseFloat(timeElements[i].getElementsByTagName('feels_like')[0].getAttribute('value'));

                data.push([from, temperature, feels_like]);
            }

            setChart(data);
        })();
    }, []);

    const options = {
        title: ` Temperatura, Sensacion Termica vs Tiempo`,
        curveType: "function",
        legend: { position: 'bottom' },
        hAxis: { title: 'Tiempo' },
        vAxis: { title: 'Grados Kelvin' }
    };

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
        <Chart
            className='chart'
            chartType="LineChart"
            width="100%"
            height="500px"
            data={chart}
            options={options}
        />
        </Paper>
    );
}