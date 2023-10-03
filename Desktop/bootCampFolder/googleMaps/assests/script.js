let map;
let geocoder;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 8
  });
  geocoder = new google.maps.Geocoder();
}

function updateMap() {
  const zipcode = document.getElementById('zipcode').value;
  const radius = parseFloat(document.getElementById('radius').value);

  geocoder.geocode({ address: zipcode }, function (results, status) {
    if (status === 'OK') {
      const location = results[0].geometry.location;
      map.setCenter(location);
      map.setZoom(12);
    } else {
      alert('Geocode was not successful: ' + status);
    }
  });
}

  