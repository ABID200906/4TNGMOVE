// Fungsi untuk menampilkan section dan memberi efek aktif pada tombol
function showSection(sectionId) {
  // Tampilkan section yang dipilih
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("visible");
  });
  document.getElementById(sectionId).classList.add("visible");

  // Tandai tombol aktif
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`.nav-item[onclick="showSection('${sectionId}')"]`).classList.add("active");

  // Generate QRIS saat membuka menu pembayaran
  if (sectionId === "payment") {
    generateQRIS();
  }

  // Tampilkan rute saat membuka menu rute
  if (sectionId === "route") {
    displayBusRoutes();
  }
}
// Fungsi untuk menampilkan halte terdekat
function displayNearbyStops() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const map = new google.maps.Map(document.createElement("div"), {
          center: userLocation,
          zoom: 15,
        });

        const service = new google.maps.places.PlacesService(map);
        const request = {
          location: userLocation,
          radius: 1000, // Dalam meter
          type: ["bus_station"],
        };

        service.nearbySearch(request, (results, status) => {
          const stopsContainer = document.getElementById("stops-container");
          stopsContainer.innerHTML = ""; // Bersihkan kontainer

          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
              const stopElement = document.createElement("div");
              stopElement.className = "stop";

              const stopName = document.createElement("h4");
              stopName.textContent = place.name;

              const stopAddress = document.createElement("p");
              stopAddress.textContent = place.vicinity;

              stopElement.appendChild(stopName);
              stopElement.appendChild(stopAddress);
              stopsContainer.appendChild(stopElement);
            });
          } else {
            stopsContainer.innerHTML = "<p>Tidak ditemukan halte terdekat.</p>";
          }
        });
      },
      (error) => {
        console.error("Error mendapatkan lokasi pengguna:", error);
        document.getElementById("stops-container").innerHTML = "<p>Gagal mendapatkan lokasi Anda.</p>";
      }
    );
  } else {
    document.getElementById("stops-container").innerHTML = "<p>Geolokasi tidak didukung oleh browser Anda.</p>";
  }
}

// Fungsi generate QRIS
function generateQRIS() {
  const paymentUrl = "https://qr.dana.id/v1/281012092025011470771860"; // Ganti dengan URL sistem QRIS Anda
  const qrContainer = document.getElementById("qris-container");

  // Hapus QR sebelumnya jika ada
  qrContainer.innerHTML = "";

  // Generate QR menggunakan library QRCode.js
  QRCode.toCanvas(qrContainer, paymentUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: "#005BAC",
      light: "#FFFFFF",
    },
  });
}

// Initialize Google Maps
function initMap() {
  const mapOptions = {
    center: { lat: -6.084962745140102, lng: 106.42387725195255}, // Example: Jakarta
    zoom: 18,
  };

  new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
}

// Fungsi untuk menampilkan rute bus
function displayBusRoutes() {
  const routes = [
      {
          name: "Rute A",
          stops: ["Halte 1", "Halte 2", "Halte 3"],
      },
      {
          name: "Rute B",
          stops: ["Halte 4", "Halte 5", "Halte 6"],
      },
  ];

  const routeContainer = document.getElementById("route-container");
  routeContainer.innerHTML = ""; // Bersihkan kontainer sebelum menambahkan data baru

  routes.forEach(route => {
      const routeElement = document.createElement("div");
      routeElement.className = "route";

      const routeName = document.createElement("h3");
      routeName.textContent = route.name;

      const routeStops = document.createElement("ul");
      route.stops.forEach(stop => {
          const stopElement = document.createElement("li");
          stopElement.textContent = stop;
          routeStops.appendChild(stopElement);
      });

      routeElement.appendChild(routeName);
      routeElement.appendChild(routeStops);
      routeContainer.appendChild(routeElement);
  });
}

// Initialize the app
window.onload = () => {
  initMap();
};
