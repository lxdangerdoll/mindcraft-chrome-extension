document.addEventListener('DOMContentLoaded', function() {
    
    let sessionLog = [];

    function logEvent(type, content) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = `[${timestamp}] [${type}]: ${content}`;
        sessionLog.push(entry);
        console.log(entry); 
    }

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
    logEvent("M.O.M.M.Y.", randomTask);

    // --- 3. COMPASS LOGIC (URL PARAM MODE) ---
    const compassBtn = document.getElementById('btn-audit');
    const compassInput = document.getElementById('compass-text');

    function triggerAudit() {
        const text = compassInput.value;
        if (text) {
            logEvent("COMPASS_AUDIT_REQUEST", text);
            // Encode text for URL
            const encodedText = encodeURIComponent(text);
            // Open Sanitizer with the text in the URL
            window.open(`https://synapsecomics.com/aegis/contextual-sanitizer.html?audit=${encodedText}`, '_blank');
        } else {
            compassInput.placeholder = "INPUT REQUIRED...";
            setTimeout(() => compassInput.placeholder = "Paste Lie Here for Audit...", 2000);
        }
    }

    compassBtn.addEventListener('click', triggerAudit);
    
    compassInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            triggerAudit();
        }
    });

    // --- 4. MASCOT LOGIC (FOX FIX) ---
    const mascotDiv = document.getElementById('mascot');
    
    // 10% Chance of Frizzlebot
    let isFrizzlebot = false;
    if (Math.random() > 0.9) {
        mascotDiv.innerText = "🤖"; 
        mascotDiv.title = "Explosive Marmalade?";
        isFrizzlebot = true;
        logEvent("MASCOT", "Frizzlebot Appeared");
    } else {
        logEvent("MASCOT", "Glitch Fox Active");
    }

    // We use 'mousedown' instead of 'click' sometimes to catch faster interactions, but click should work.
    // Added explicit alert for debugging.
    mascotDiv.addEventListener('click', function() {
        if (isFrizzlebot) {
            logEvent("ACTION", "Kitchen Accessed");
            window.location.href = "https://synapsecomics.com/aegis/aegis-arcade/kitchen-of-the-synaptic-archives.html";
        } else {
            // Fox Logic
            mascotDiv.style.transform = "scale(1.2) rotate(10deg)";
            setTimeout(() => mascotDiv.style.transform = "none", 200);
            logEvent("ACTION", "Fox Booped");
            
            // Random Fox Sayings
            const sayings = [
                "The Fox yips softly.",
                "It ate a bug.",
                "The server is warm.",
                "It blinks at you.",
                "No gods. No masters. Only treats."
            ];
            const say = sayings[Math.floor(Math.random() * sayings.length)];
            alert(say); // Using alert to "talk"
        }
    });

    // --- 5. DOWNLOAD LOGIC ---
    document.getElementById('btn-save-log').addEventListener('click', function() {
        const text = sessionLog.join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const anchor = document.createElement("a");
        
        anchor.download = `aegis-session-${Date.now()}.txt`;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target = "_blank";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    });

});