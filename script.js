let map; // Reference to Google Map
let markers = []; // Array to store map markers

// Initialize the map
async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.255203, lng: -79.843826 },
    zoom: 11,
  });

  const opportunities = await fetchOpportunities();
  updatePins(opportunities);
}

// Fetch opportunities from the JSON file
async function fetchOpportunities() {
  const response = await fetch("opportunities.json");
  const data = await response.json();
  return data;
}

// Add markers to the map
function updatePins(data) {
  // Clear old markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  const geocoder = new google.maps.Geocoder();
  data.forEach(opportunity => {
    geocoder.geocode({ address: opportunity.location }, (results, status) => {
      if (status === "OK") {
        const marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: opportunity.title,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<h3>${opportunity.title}</h3><p>${opportunity.location}</p>`,
        });

        marker.addListener("click", () => {infoWindow.open(map, marker); document.getElementById("data").innerHTML=opportunity.opportunityname+opportunity.link});
        markers.push(marker);
      }
    });
  });
}

// Filter and display opportunities based on user input
async function searchOpportunities() {
  const query = document.getElementById("search-input").value.toLowerCase();
  console.log("Query: "+query);
  const allOpportunities = await fetchOpportunities();
  const filtered = allOpportunities.filter(opportunity =>
    opportunity.category.includes(query)
  );
  updatePins(filtered);
}
