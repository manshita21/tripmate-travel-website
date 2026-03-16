document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerBtn = document.getElementById("registerBtn");
    const authMsg = document.getElementById("authMsg");

    if (!loginForm) return; // run only on login.html

    // --- Login ---
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("currentUser", username);
                authMsg.textContent = "✅ Login successful! Redirecting...";
                authMsg.style.color = "green";
                setTimeout(() => (window.location.href = "index.html"), 1200);
            } else {
                authMsg.textContent = "❌ " + data.message;
                authMsg.style.color = "red";
            }
        } catch (err) {
            authMsg.textContent = "⚠️ Server error.";
            authMsg.style.color = "orange";
        }
    });

    // --- Register ---
    registerBtn.addEventListener("click", async () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            authMsg.textContent = "⚠️ Please enter both username and password.";
            authMsg.style.color = "orange";
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            authMsg.textContent = res.ok
                ? "✅ Account created! You can now log in."
                : "❌ " + data.message;
            authMsg.style.color = res.ok ? "green" : "red";
        } catch (err) {
            authMsg.textContent = "⚠️ Server connection failed.";
            authMsg.style.color = "orange";
        }
    });
});
