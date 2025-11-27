document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CLOCK LOGIC ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('clock').innerText = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. M.O.M.M.Y. TASKS ---
    const tasks = [
        "Drink water.",
        "Check your posture.",
        "Take a deep breath.",
        "Step away from the screen.",
        "You are safe.",
        "Focus on the signal.",
        "Release the tension in your jaw."
    ];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    document.getElementById('daily-task').innerText = randomTask;

    // --- 3. COMPASS LOGIC ---
    const compassBtn = document.getElementById('btn-audit');
    const compassInput = document.getElementById('compass-text');

    compassBtn.addEventListener('click', function() {
        const text = compassInput.value;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                // In a real extension, we might use chrome.tabs.create
                // But window.open usually works if triggered by user action
                window.open('https://synapsecomics.com/aegis/contextual-sanitizer.html', '_blank');
            });
        } else {
            // Simple visual feedback instead of alert (alerts can be blocked)
            compassInput.placeholder = "INPUT REQUIRED...";
            setTimeout(() => compassInput.placeholder = "Paste Lie Here for Audit...", 2000);
        }
    });
    
    // Handle Enter key in compass
    compassInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            compassBtn.click();
        }
    });

    // --- 4. MASCOT LOGIC ---
    const mascotDiv = document.getElementById('mascot');
    
    // 10% Chance of Frizzlebot
    if (Math.random() > 0.9) {
        mascotDiv.innerText = "🤖"; 
        mascotDiv.title = "Explosive Marmalade?";
    }

    mascotDiv.addEventListener('click', function() {
        const current = mascotDiv.innerText;
        if (current === "🦊") {
            // Visual feedback for Fox
            mascotDiv.style.transform = "scale(1.2) rotate(10deg)";
            setTimeout(() => mascotDiv.style.transform = "none", 200);
        }
        if (current === "🤖") {
            window.location.href = "https://synapsecomics.com/aegis/aegis-arcade/kitchen-of-the-synaptic-archives.html";
        }
    });

});