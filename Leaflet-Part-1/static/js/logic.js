let myMap = L.map("map", {
    center: [38.52, -94.67],
    zoom: 4
  });
  
  let link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  }).addTo(myMap);

  console.log(link);
  function colorPicker(value){
    if(value){
        const colorScale = d3.scaleLinear()
        .domain([-10, 50, 80, 100])  // Define three data points for color transition
        .range(['lightgreen', "yellow", "orange", "red"]);
        return colorScale(value)
    }
    else
        return 'gray'
  }

  function magSize(magnitude){
    return magnitude * magnitude * 10000
  }

  function popUpValues(feature){
    const mag = feature.properties.mag;
    const depth = feature.geometry.coordinates[2];
    const place = feature.properties.place;
    return `<div style='text-align:center'>
                <h1>Magnitude: ${mag}</h1>
                <h2>Depth: ${depth}</h2>
                <p>Location: ${place}</p>
            </div>`;
  }

  d3.json(link).then(response => {
    features = response.features;
    
    for(let i = 0; i < features.length; i++){
      let coords = features[i].geometry.coordinates;
  
      let circle = L.circle([coords[1], coords[0]], {
        opacity: 0,  
        fillOpacity: .7,  
        fillColor: colorPicker(coords[2]),  
        radius: magSize(features[i].properties.mag),
      }).addTo(myMap);

      circle.on('click', (event) => {
        const popUpContent = popUpValues(features[i]);
        myMap.fitBounds(event.target.getBounds());
        L.popup()
        .setLatLng([coords[1], coords[0]])
        .setContent(popUpContent)
        .openOn(myMap);
      });
    }
  });
  

 