import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';


interface Config {
  rows: Array<object>;
}

export default function BasicTable(data: Config) {

  let [rows, setRows] = useState([])

  useEffect(() => {

    (() => {

      setRows(data.rows)

    })()

  }, [data])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rango de horas</TableCell>
            <TableCell>Dirección del viento</TableCell>
            <TableCell>Velocidad del viento</TableCell>
            <TableCell>Rafaga de viento</TableCell>
            <TableCell>Temperatura</TableCell>
            <TableCell>Precipitacion (Probabilidad)</TableCell>
            <TableCell>Presion</TableCell>
            <TableCell>Humedad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.rangeHours}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.rangeHours}
              </TableCell>
              <TableCell>{row.windDirection}</TableCell>
              <TableCell>{row.windSpeed}</TableCell>
              <TableCell>{row.windGust}</TableCell>
              <TableCell>{row.temperature}</TableCell>
              <TableCell>{row.precipitation}</TableCell>
              <TableCell>{row.pressure}</TableCell>
              <TableCell>{row.humidity}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
