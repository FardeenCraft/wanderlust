mapboxgl.accessToken = mapToken;

if (
  listingData.geometry &&
  Array.isArray(listingData.geometry.coordinates) &&
  listingData.geometry.coordinates.length === 2
) {
  const coordinates = listingData.geometry.coordinates;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 9
  });

  new mapboxgl.Marker({color: '#FF0000'})
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listingData.location}</h4>
            <p>Exact Location provided after booking</p>`)
    )
    .addTo(map);
}
