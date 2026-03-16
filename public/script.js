const today = new Date().toISOString().slice(0, 10);
if (from) from.min = today;
if (to) to.min = today;
```) — so we don’t need to change that.  

Below is your **updated version** of `frontend / app.js` with minimal clean additions (look for comments starting with `// NEW:`).

---

  ```js
/* frontend/app.js
   Handles UI interactions + calls backend API for auth, trips, photos.
*/
const API_BASE = 'http://localhost:4000/api'; // backend base

/* ---------- Utility & UI bindings ---------- */
document.addEventListener('DOMContentLoaded', () => {
  AOS && AOS.refresh();
  bindClock();
  populateIndianPlaces();
  renderTopPlaces();
  setupFormBehavior();
  bindStatePlaceDropdowns(); // NEW: setup state → places linkage
  checkAuthUI();
  routePageLoad();
});

/* Clock */
function bindClock(){
  const el = document.getElementById('clock');
  function tick(){ if(el) el.textContent = new Date().toLocaleTimeString(); }
  tick(); setInterval(tick,1000);
}

/* Places data - full India list (abbreviated, you can add more) */
const INDIAN_PLACES = [
  "Agra","Ahmedabad","Aizawl","Alappuzha","Alleppey","Amritsar","Andaman and Nicobar Islands","Arunachal Pradesh",
  "Bangalore","Bengaluru","Bhopal","Bhuj","Bhubaneswar","Bikaner","Bihar","Chandigarh","Chennai","Coimbatore",
  "Cherrapunji","Darjeeling","Dehradun","Dharamshala","Goa","Guwahati","Gurgaon","Gurugram","Gwalior","Hampi",
  "Hyderabad","Imphal","Indore","Itanagar","Jaipur","Jaisalmer","Jodhpur","Jungle Lodges","Kochi","Kolkata",
  "Kota","Kovalam","Kullu","Kumarakom","Lucknow","Lonavala","Munnar","Manali","Mount Abu","Mumbai","Mysore",
  "Nagpur","Nainital","Ooty","Pondicherry","Port Blair","Puri","Rishikesh","Rann of Kutch","Shillong","Shimla",
  "Srinagar","Tirupati","Udaipur","Varanasi","Wayanad"
];
function populateIndianPlaces(){
  const datalist = document.getElementById('placesList');
  if(!datalist) return;
  datalist.innerHTML = INDIAN_PLACES.map(p => `< option value = "${p}" > `).join('');
}

/* ---------- NEW FEATURE: State → Places Dropdown ---------- */
function bindStatePlaceDropdowns() {
  const stateSelect = document.getElementById('stateSelect');
  const placeSelect = document.getElementById('placeSelect');
  if(!stateSelect || !placeSelect) return;

  const statePlaces = {
    "Goa": ["Baga Beach", "Calangute", "Fort Aguada", "Dudhsagar Falls"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jaisalmer", "Mount Abu"],
    "Kerala": ["Munnar", "Alleppey", "Kochi", "Wayanad"],
    "Himachal Pradesh": ["Manali", "Shimla", "Dharamshala", "Kullu"],
    "Tamil Nadu": ["Ooty", "Kodaikanal", "Chennai", "Madurai"],
    "Uttarakhand": ["Nainital", "Rishikesh", "Mussoorie", "Haridwar"],
    "Maharashtra": ["Mumbai", "Lonavala", "Pune", "Mahabaleshwar"],
    "Delhi": ["India Gate", "Red Fort", "Qutub Minar", "Lotus Temple"]
  };

  // populate states
  Object.keys(statePlaces).forEach(state => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });

  // when state changes → update places
  stateSelect.addEventListener('change', () => {
    const selected = stateSelect.value;
    placeSelect.innerHTML = "<option value=''>Select Place</option>";
    if(statePlaces[selected]) {
      statePlaces[selected].forEach(place => {
        const opt = document.createElement('option');
        opt.value = place;
        opt.textContent = place;
        placeSelect.appendChild(opt);
      });
    }
  });
}

/* Top 3 places rendering */
async function renderTopPlaces(){
  const top = ['Goa','Jaipur','Kerala'];
  const grid = document.getElementById('topGrid');
  if(!grid) return;
  grid.innerHTML = '';
  for(const p of top){
    // fetch one photo via backend
    const photo = await fetch(`${ API_BASE }/photos?query=${encodeURIComponent(p)}&per_page=1`).then(r => r.json()).catch(() => null);
const img = (photo && photo.results && photo.results[0]) ? photo.results[0].urls.small : `https://source.unsplash.com/600x400/?${encodeURIComponent(p)}`;
const div = document.createElement('div');
div.className = 'card';
div.innerHTML = `<img src="${img}" alt="${p}"><h3>${p}</h3><p class="muted">Explore ${p}, one of India's favorites.</p>`;
div.onclick = () => { localStorage.setItem('selectedPlace', p); window.location.href = 'place.html'; };
grid.appendChild(div);
  }
}

/* Season detection */
function seasonFromMonth(m) {
  if (m >= 3 && m <= 6) return 'Summer';
  if (m >= 7 && m <= 9) return 'Monsoon';
  return 'Winter';
}

/* Form behavior & validations */
function setupFormBehavior() {
  const from = document.getElementById('fromDate');
  const to = document.getElementById('toDate');
  const today = new Date().toISOString().slice(0, 10);
  if (from) from.min = today;
  if (to) to.min = today;
  if (from && to) {
    from.addEventListener('change', () => { if (to) to.min = from.value; });
  }

  const suggestBtn = document.getElementById('suggestBtn');
  if (suggestBtn) suggestBtn.addEventListener('click', async () => {
    const f = document.getElementById('fromDate').value;
    if (!f) return alert('Pick a From date to detect season');
    const m = new Date(f).getMonth() + 1;
    const season = seasonFromMonth(m);
    const suggestions = season === 'Summer' ? ['Manali', 'Shimla', 'Ooty'] : season === 'Monsoon' ? ['Munnar', 'Coorg', 'Lonavala'] : ['Goa', 'Jaipur', 'Rann of Kutch'];
    document.getElementById('seasonBox').innerHTML = `<strong>Season:</strong> ${season} — Suggested: ${suggestions.join(', ')}`;
  });

  const form = document.getElementById('planForm');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const place = document.getElementById('placeSelect') ? document.getElementById('placeSelect').value : document.getElementById('placeSearch').value.trim();
    const fromD = document.getElementById('fromDate').value;
    const toD = document.getElementById('toDate').value;
    const budget = document.getElementById('budget').value;
    const customize = document.getElementById('customizeOpt').value === 'yes';
    if (!place || !fromD || !toD) return alert('Please fill place and dates');
    if (new Date(fromD) < new Date(new Date().toISOString().slice(0, 10))) return alert('From date cannot be in the past');
    if (new Date(toD) < new Date(fromD)) return alert('To date must be after From date');

    // Build trip payload, ask backend to fetch photos for spots
    const month = new Date(fromD).getMonth() + 1;
    const season = seasonFromMonth(month);
    const suggested = await fetch(`${API_BASE}/photos?query=${encodeURIComponent(place)}&per_page=6`).then(r => r.json()).catch(() => null);
    const photos = (suggested && suggested.results) ? suggested.results.map(p => p.urls.small) : [];

    // Auto-generate daywise spots (simple heuristic)
    const days = Math.max(1, Math.round((new Date(toD) - new Date(fromD)) / (1000 * 60 * 60 * 24)) + 1);
    const baseSpots = [
      `${place} Main Attraction`,
      `Local Market & Street Food`,
      `Famous Viewpoint`,
      `Cultural Experience / Museum`,
      `Relax & Scenic Spot`
    ];
    const dayPlan = [];
    for (let d = 1; d <= days; d++) {
      dayPlan.push({
        day: d,
        activities: [baseSpots[(d - 1) % baseSpots.length], baseSpots[(d) % baseSpots.length]],
        photos: photos.slice((d - 1) * 2, (d - 1) * 2 + 2)
      });
    }

    // Create trip on backend
    const token = localStorage.getItem('tripmate_token');
    const resp = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ place, fromDate: fromD, toDate: toD, budget, season, dayPlan, customize })
    }).then(r => r.json());

    if (resp.error) {
      // If not logged in and backend requires auth, prompt login
      if (resp.message && resp.message.includes('auth')) {
        if (confirm('You must login to save trips. Open login page?')) window.location.href = 'login.html';
        return;
      }
      alert(resp.error || 'Failed to save trip');
      return;
    }

    // store quick trip to show in itinerary page
    // Store the full trip locally for itinerary display
    const tripData = {
      place,
      fromDate: fromD,
      toDate: toD,
      budget,
      season,
      state: document.getElementById('stateSelect') ? document.getElementById('stateSelect').value : "",
      dayPlan
    };
    localStorage.setItem('tripData', JSON.stringify(tripData));

    // Navigate to itinerary page
    window.location.href = 'itinerary.html';

  });
}

/* --- Rest of your file remains same (checkAuthUI, loadItineraryPage, etc.) --- */
