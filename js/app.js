const container = document.querySelector(".container");
const coffees = [
  {
    name: "Perspiciatis",
    image: "images/coffee1.jpg"
  },
  {
    name: "Voluptatem",
    image: "images/coffee2.jpg"
  },
  {
    name: "Explicabo",
    image: "images/coffee3.jpg"
  },
  {
    name: "Rchitecto",
    image: "images/coffee4.jpg"
  },
  {
    name: " Beatae",
    image: "images/coffee5.jpg"
  },
  {
    name: " Vitae",
    image: "images/coffee6.jpg"
  },
  {
    name: "Inventore",
    image: "images/coffee7.jpg"
  },
  {
    name: "Veritatis",
    image: "images/coffee8.jpg"
  },
  {
    name: "Accusantium",
    image: "images/coffee9.jpg"
  }
];

const showCoffees = () => {
  let output = "";
  coffees.forEach(
    ({ name, image }) =>
      (output += `
              <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <a class="card--link" href="#">Taste</a>
              </div>
              `)
  );
  container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", showCoffees);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}
function getUserMedia(constraints) {
  // if Promise-based API is available, use it
  if (navigator.mediaDevices) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
    
  // // otherwise try falling back to old, possibly prefixed API...
  // var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
  //   navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
  // if (legacyApi) {
  //   // ...and promisify it
  //   return new Promise(function (resolve, reject) {
  //     legacyApi.bind(navigator)(constraints, resolve, reject);
  //   });
  }
// }

function getStream (type) {
  if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }

  var constraints = {};
  constraints[type] = true;
  
  getUserMedia(constraints)
    .then(function (stream) {
      var mediaControl = document.querySelector(type);
      
      if ('srcObject' in mediaControl) {
        mediaControl.srcObject = stream;
      } else if (navigator.mozGetUserMedia) {
        mediaControl.mozSrcObject = stream;
      } else {
        mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
      }
      
      mediaControl.play();
    })
    .catch(function (err) {
      alert('Error: ' + err);
    });
  }
  function getUserMedia(options, successCallback, failureCallback) {
    var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (api) {
      return api.bind(navigator)(options, successCallback, failureCallback);
    }
  }
  
  var theStream;
  var theRecorder;
  var recordedChunks = [];
  
  function getStream() {
    if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
      !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
      alert('User Media API not supported.');
      return;
    }
    
    var constraints = {video: true, audio: true};
    getUserMedia(constraints, function (stream) {
      var mediaControl = document.querySelector('video');
      
      if ('srcObject' in mediaControl) {
        mediaControl.srcObject = stream;
      } else if (navigator.mozGetUserMedia) {
        mediaControl.mozSrcObject = stream;
      } else {
        mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
      }
      
      theStream = stream;
      try {
        recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
      } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        return;
      }
      theRecorder = recorder;
      console.log('MediaRecorder created');
      recorder.ondataavailable = recorderOnDataAvailable;
      recorder.start(100);
    }, function (err) {
      alert('Error: ' + err);
    });
  }
  
  function recorderOnDataAvailable(event) {
    if (event.data.size == 0) return;
    recordedChunks.push(event.data);
  }
  function download() {
    console.log('Saving data');
    theRecorder.stop();
    theStream.getTracks()[0].stop();
    // CacheStorage.getUserMedia();
  
    var blob = new Blob(recordedChunks, {type: "video/webm"});
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = 'test.webm';
    // a.CacheStorage = 'image.mp4';
    a.click();
    
    // setTimeout() here is needed for Firefox.
    setTimeout(function () {
        (window.URL || window.webkitURL).revokeObjectURL(url);
    }, 100); 
  }
  
  function createDB() {
    idb.open('products', 1, function(upgradeDB) {
      var store = upgradeDB.createObjectStore('beverages', {
        keyPath: 'id'
      });
      store.put({id: 123, name: 'coke', price: 10.99, quantity: 200});
      store.put({id: 321, name: 'pepsi', price: 8.99, quantity: 100});
      store.put({id: 222, name: 'water', price: 11.99, quantity: 300});
    });
  }
  
  function cacheAssets() {
    return caches.open('cache-v1')
    .then(function(cache) {
      return cache.addAll([
        '.',
        'index.html',
        'styles/main.css',
        'js/offline.js',
        'img/coke.jpg'
      ]);
    });
  }
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        // Check cache but fall back to network
        return response || fetch(event.request);
      })
    );
  });

  var target = document.getElementById('target');
var watchId;

function appendLocation(location, verb) {
  verb = verb || 'updated';
  var newLocation = document.createElement('p');
  newLocation.innerHTML = 'Location ' + verb + ': ' + location.coords.latitude + ', ' + location.coords.longitude + '';
  target.appendChild(newLocation);
}

if ('geolocation' in navigator) {
  document.getElementById('askButton').addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(function (location) {
      appendLocation(location, 'fetched');
    });
    watchId = navigator.geolocation.watchPosition(appendLocation);
  });
} else {
  target.innerText = 'Geolocation API not supported.';
}
  
 