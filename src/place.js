$(document).ready(() => {
  let token = localStorage.getItem('token')
  if (!token) {
      window.location = './index.html'
  }
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });

  getLocationUser()
})

let locationUser = {
  lat: '',
  lng: ''
}
// let pickedPlace = 'park'

function getLocationUser () {
  if (navigator.geolocation) {
      var location_timeout = setTimeout("geolocFail()", 10000);
  
      navigator.geolocation.getCurrentPosition(function(position) {
          clearTimeout(location_timeout);
  
          locationUser.lat = position.coords.latitude;
          locationUser.lng = position.coords.longitude;
          loadNearby()
          // console.log(locationUser)
      }, function(error) {
          clearTimeout(location_timeout);
          console.log('failed to get location')
      });
  } else {
      console.log('failed to get location')
  }
}

function loadNearby (query) {
  let pickedPlace = 'mall'
  if (query) {
      pickedPlace = query
  }
  $('#cardsPlaces').empty()
  $.ajax({
      url:`http://localhost:3000/place/${pickedPlace}/${locationUser.lat}/${locationUser.lng}`,
      method: 'get',
      headers: {
          token: localStorage.getItem('token')
        }
  })
    .done(response => {
      let data = response.data.results
      data.forEach(place => {
          if (!place.photos) {
              place.photos = [{
                  photo_reference : null
              }]
          }
          if (place.rating >= 4.5) {
              $('#cardsPlaces').append(`
                  <div class="ui card">
                  <div class="content">
                  <a class="ui red small right ribbon label">Top Rated</a>
                          <div class="header">${place.name}</div>
                          <div class="meta">
                          <a>${place.types[0]}</a>
                          </div>
                          <div class="description">
                          <p>${place.formatted_address}</p>
                          </div>
                      </div>
                      <div class="extra content">
                          <span class="left floated like">
                          <i class="star active icon"></i>
                          ${place.rating} Rating
                          </span>
                          <button class="ui right floated button" onclick="modalPlace('${place.name}','${place.formatted_address}','${place.rating}','${place.photos[0].photo_reference}')">
                              More
                          </button>
                      </div>
                  </div>
              `)
          } else {
              $('#cardsPlaces').append(`
                  <div class="ui card">
                      <div class="content">
                          <div class="header">${place.name}</div>
                          <div class="meta">
                          <a>${place.types[0]}</a>
                          </div>
                          <div class="description">
                          <p>${place.formatted_address}</p>
                          </div>
                      </div>
                      <div class="extra content">
                          <span class="left floated like">
                          <i class="star icon"></i>
                          ${place.rating} Rating
                          </span>
                          <button class="ui right floated button" onclick="modalPlace('${place.name}','${place.formatted_address}','${place.rating}','${place.photos[0].photo_reference}')">
                              More
                          </button>
                      </div>
                  </div>
              `)
          }
      })
      // console.log(response.data.results)
    })
    .fail(err => {
      console.log(err)
    })
}

function modalPlace (name, address, rating, photo) {
  
  $('#photoPlace').attr('src',`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo}&key=AIzaSyAZC_XFMZJz1VspkvYWRe2DIBYfSqwSsuM`)
  $('#placeModalName').empty()
  $('#placeModalName').append(name)
  $('#placeModalAddress').empty()
  $('#placeModalAddress').append(address)
  $('#placeModalAddress').append(`
      <br>
      <br>
      <button class="ui button" onclick="matrixDistance('${name}')">get my distance</button>
  `)
  // $('#placeModalDescription').val(rating)
  $('.ui.modal.places').modal('show')
}

function matrixDistance(name) {
  console.log('masuk matrix distance')
  $.ajax({
    url: `http://localhost:3000/matrix/distance`,
    method:'post',
    headers: {
      token: localStorage.getItem('token')
    },
    data: {
      address: name,
      lat: locationUser.lat,
      lng: locationUser.lng
    }
  })
    .done(data => {
      console.log('SUccess MATRIX POST', data)
      if(data.status === 'ZERO_RESULTS') {
        $('#placeModalAddress').append(`
            <h3>Status: ${data.status}</h3>
          `)
      } else {
          $('#placeModalAddress').append(`
            <h3>Origin: ${data.data.routes[0].legs[0].start_address}</h3> 
            <h3>Destination: ${data.data.routes[0].legs[0].end_address}</h3> 
            <h3>Distance: ${data.data.routes[0].legs[0].distance.text}</h3> 
            <h3>Duration: ${data.data.routes[0].legs[0].duration.text}</h3> 
          `)
      }
    })
    .fail(err => {
      console.log(err)
    })
}