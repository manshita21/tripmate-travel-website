document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("itinerarySection");

    if (section) {
        // --- Itinerary logic ---
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state");
        const place = params.get("place");
        const fromDate = params.get("from");
        const toDate = params.get("to");
        const budget = params.get("budget");
        const season = params.get("season");

        let trip = null;

        if (state && place && fromDate && toDate && budget) {
            trip = { state, place, fromDate, toDate, budget, season };
        } else {
            trip = JSON.parse(localStorage.getItem("tripData"));
        }

        if (!trip) {
            section.innerHTML = `
            <h2>No itinerary found</h2>
            <p>Please go back and plan your journey first.</p>
            <a href="index.html" class="btn">Plan a Trip</a>`;
            return;
        }

        let html = `
          <h2>Trip to ${trip.place}</h2>
          <p><strong>State:</strong> ${trip.state}</p>
          <p><strong>From:</strong> ${trip.fromDate}</p>
          <p><strong>To:</strong> ${trip.toDate}</p>
          <p><strong>Budget:</strong> ${trip.budget}</p>
          <p><strong>Season:</strong> ${trip.season || "N/A"}</p>
          <hr>
          <h3>Suggested Tourist Spots in ${trip.place}</h3>`;

        const touristSpots = {
            "Goa": ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Anjuna Beach"],
            "Jaipur": ["Amber Fort", "Hawa Mahal", "City Palace", "Nahargarh Fort"],
            "Manali": ["Solang Valley", "Hidimba Temple", "Rohtang Pass", "Old Manali"],
            "Munnar": ["Tea Gardens", "Mattupetty Dam", "Eravikulam Park", "Top Station"],
            "Ooty": ["Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Rose Garden"],
            "Rishikesh": ["Laxman Jhula", "Triveni Ghat", "Ram Jhula", "Beatles Ashram"]
        };

        const spots = touristSpots[trip.place] || ["Local attractions will appear here soon."];
        html += `<ul>${spots.map(s => `<li>${s}</li>`).join('')}</ul>`;

        const from = new Date(trip.fromDate);
        const to = new Date(trip.toDate);
        const days = Math.round((to - from) / (1000 * 60 * 60 * 24)) + 1;

        html += `<hr><h3>Day-wise Plan (${days} Days)</h3><div class="day-plan">`;
        for (let i = 1; i <= days; i++) {
            html += `
            <div class="day-card">
                <h4>Day ${i}</h4>
                <p>Visit: ${spots[i - 1] || "Explore local culture & food"}</p>
            </div>`;
        }
        html += `</div>`;
        section.innerHTML = html;
    }

    // --- Sidebar login state (works for all pages) ---
    const userBadge = document.getElementById("userBadge");
    const loginLink = document.getElementById("nav-login");
    const logoutLink = document.getElementById("nav-logout");
    const currentUser = localStorage.getItem("currentUser");

    if (userBadge && loginLink && logoutLink) {
        if (currentUser) {
            userBadge.textContent = `Welcome, ${currentUser}! 👋`;
            loginLink.style.display = "none";
            logoutLink.style.display = "block";
        } else {
            userBadge.textContent = "Not signed in";
            loginLink.style.display = "block";
            logoutLink.style.display = "none";
        }

        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }
});
