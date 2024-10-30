import { useEffect, useState } from 'react';

export const Results = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('https://6622071827fcd16fa6c8818c.mockapi.io/api/v1/blogs')
      .then((response) => response.json())
      .then((results) => setLocations(results));
  }, []);

  return (
    <main>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Reseña</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>{location.name}</td>
              <td>{location.location}</td>
              <td>{location.review}</td>
              <td>{location.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Results;
