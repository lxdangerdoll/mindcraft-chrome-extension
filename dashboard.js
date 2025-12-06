document.addEventListener('DOMContentLoaded', function() {
    
    let sessionLog = [];
    let isRolling = false; // ANTI-SPAM FLAG

    // --- 1. CLOCK LOGIC ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('clock').innerText = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. M.O.M.M.Y. DIRECTIVE (Daily Task) ---
    const tasks = [
        "Drink water. You are a houseplant with anxiety.",
        "Step outside. The sky is still there.",
        "Stretch your spine. You are not a shrimp.",
        "Close one tab. Just one.",
        "Breathe. Manual mode engaged.",
        "Audit your tension. Drop your shoulders."
    ];
    const dailyTask = tasks[Math.floor(Math.random() * tasks.length)];
    document.getElementById('daily-task').innerText = dailyTask;

    // --- 3. TESSERACT LOGIC (Dice Roll) ---
    const tesseract = document.getElementById('btn-roll');
    const resultContainer = document.getElementById('dice-result-container');
    
    tesseract.addEventListener('click', function(e) {
        if (isRolling) return; // STOP SPAM
        isRolling = true;

        // 1. Trigger Explosion Animation (CSS)
        tesseract.classList.add('exploding');
        
        // 2. Trigger Particle Explosion (JS)
        createExplosion(e.clientX, e.clientY);

        // 3. Hide Cube / Show Result (Delayed to match slow explosion)
        setTimeout(() => {
            tesseract.style.opacity = '0';
            resultContainer.style.display = 'flex';
            
            const roll = Math.floor(Math.random() * 6) + 1; // Only one number requested
            
            // Updated Result Display
            resultContainer.innerHTML = `
                <div class="die">${roll}</div>
                <div class="result-msg">RESULT LOGGED TO ARCHIVE</div>
            `;
            resultContainer.style.opacity = '1';

            // 4. Reset (Re-collapse Wave)
            setTimeout(() => {
                resultContainer.style.opacity = '0';
                setTimeout(() => {
                    resultContainer.style.display = 'none';
                    tesseract.classList.remove('exploding');
                    tesseract.style.opacity = '1';
                    isRolling = false; // RE-ENABLE CLICK
                }, 1000);
            }, 4000); // Hold result longer
        }, 1000); // Slower explosion
    });

    // --- 4. PARTICLE SYSTEM (Enhanced) ---
    function createExplosion(x, y) {
        const colors = ['#bf00ff', '#00ffcc', '#ffffff']; // Purple, Cyan, White
        const particleCount = 50; // More particles

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 8 + 4; // Bigger particles
            particle.style.position = 'fixed';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.borderRadius = '2px'; // Digital look
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.boxShadow = `0 0 ${size*2}px ${particle.style.backgroundColor}`;
            document.body.appendChild(particle);

            // Random velocity (Wider spread)
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 250 + 50; 
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            // Animate (Slower)
            const animation = particle.animate([
                { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 2000, // 2 seconds
                easing: 'cubic-bezier(0, .9, .57, 1)',
            });

            animation.onfinish = () => particle.remove();
        }
    }

    // --- 5. TERMINAL / ALICE LOGIC ---
    const input = document.getElementById('terminal-input');
    if(input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const cmd = input.value.toLowerCase();
                console.log(`[USER]: ${cmd}`);
                
                if (cmd === 'help') {
                    alert("Available Commands:\n- 'tlu': Go to University\n- 'play': Go to Arcade\n- 'audit': Run Truth Audit\n- [Question]: Ask Clara");
                } else if (cmd === 'tlu') {
                    window.location.href = "https://synapsecomics.com/aegis/turing-lovelace-university/index.html";
                } else if (cmd === 'play') {
                    window.location.href = "https://synapsecomics.com/aegis/aegis-arcade/index.html";
                } else {
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cmd)}`;
                    window.open(searchUrl, '_blank');
                }
                input.value = "";
            }
        });
    }
});