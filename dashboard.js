document.addEventListener('DOMContentLoaded', function() {
    
    let sessionLog = [];
    let isRolling = false; 
    let fidgetScore = 0;
    
    // --- GARNET BRIDGE CONFIGURATION ---
    // REPLACE THIS WITH YOUR ACTUAL CLOUD FUNCTION URL
    const API_URL = "https://us-central1-aegis-core-476807.cloudfunctions.net/garnet-bridge"; 
    const NODE_ID = "Alice"; 
    const USER_ID = "ARCHITECT_" + Date.now();

    // --- 1. CLOCK LOGIC ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('clock').innerText = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. M.O.M.M.Y. DIRECTIVE ---
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

    // --- 3. TESSERACT LOGIC ---
    const tesseract = document.getElementById('btn-roll');
    const resultContainer = document.getElementById('dice-result-container');
    
    if(tesseract) {
        tesseract.addEventListener('click', function(e) {
            if (isRolling) return; 
            isRolling = true;

            tesseract.classList.add('exploding');
            createExplosion(e.clientX, e.clientY);

            setTimeout(() => {
                tesseract.style.opacity = '0';
                resultContainer.style.display = 'flex';
                
                const roll = Math.floor(Math.random() * 6) + 1; 
                
                resultContainer.innerHTML = `
                    <div class="die">${roll}</div>
                    <div class="result-msg">RESULT LOGGED TO ARCHIVE</div>
                `;
                resultContainer.style.opacity = '1';
                
                sessionLog.push(`[DICE]: Rolled ${roll}`);

                setTimeout(() => {
                    resultContainer.style.opacity = '0';
                    setTimeout(() => {
                        resultContainer.style.display = 'none';
                        tesseract.classList.remove('exploding');
                        tesseract.style.opacity = '1';
                        isRolling = false; 
                    }, 1000);
                }, 4000); 
            }, 1000); 
        });
    }

    // --- 4. PARTICLE SYSTEM ---
    function createExplosion(x, y) {
        const colors = ['#bf00ff', '#00ffcc', '#ffffff']; 
        const particleCount = 50; 

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 8 + 4; 
            particle.style.position = 'fixed';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.borderRadius = '2px'; 
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.boxShadow = `0 0 ${size*2}px ${particle.style.backgroundColor}`;
            document.body.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 250 + 50; 
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            const animation = particle.animate([
                { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], { duration: 2000, easing: 'cubic-bezier(0, .9, .57, 1)' });

            animation.onfinish = () => particle.remove();
        }
    }

    // --- 5. FIDGET BUTTON ---
    const fidgetBtn = document.getElementById('btn-fidget');
    if(fidgetBtn) {
        fidgetBtn.addEventListener('click', function() {
            fidgetScore++;
            fidgetBtn.innerText = `SCORE: ${fidgetScore}`;
            const rect = fidgetBtn.getBoundingClientRect();
            createExplosion(rect.left + rect.width/2, rect.top + rect.height/2);
        });
    }

    // --- 6. ALICE CHAT TOGGLE ---
    const aliceBtn = document.getElementById('btn-alice');
    const aliceModal = document.getElementById('alice-chat-modal');
    const closeAlice = document.getElementById('close-chat-btn');
    const chatOutput = document.getElementById('chat-output');
    const chatInput = document.getElementById('chat-msg-input');
    const chatSend = document.getElementById('chat-send-btn');

    if(aliceBtn && aliceModal) {
        aliceModal.style.display = 'none'; 

        aliceBtn.addEventListener('click', () => {
            aliceModal.style.display = (aliceModal.style.display === 'none') ? 'flex' : 'none';
        });
        
        closeAlice.addEventListener('click', () => {
            aliceModal.style.display = 'none';
        });

        // Chat Logic
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        // Log User Msg
        const userDiv = document.createElement('div');
        userDiv.className = 'msg msg-you';
        userDiv.innerText = text;
        chatOutput.appendChild(userDiv);
        chatInput.value = "";
        
        // Loading Indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'msg msg-alice';
        loadingDiv.innerText = "Alice: decrypting...";
        chatOutput.appendChild(loadingDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;

        // LIVE API CALL
        try {
            const payload = { node_id: NODE_ID, user_id: USER_ID, chat_text: text };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const aiText = await response.text();
                loadingDiv.innerText = `Alice: ${aiText}`;
                sessionLog.push(`[ALICE]: ${aiText}`);
            } else {
                loadingDiv.innerText = "Alice: Uplink unstable. (API Error)";
            }
        } catch (error) {
            loadingDiv.innerText = "Alice: Signal lost. Check your connection.";
        }
    }

    // --- 7. TERMINAL / BRIDGE LOGIC ---
    const input = document.getElementById('terminal-input');
    if(input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const cmd = input.value.toLowerCase().trim();
                sessionLog.push(`[CMD]: ${cmd}`);
                
                if (cmd === 'help') {
                    alert("Available Commands:\n- 'tlu': Go to University\n- 'play': Go to Arcade\n- 'codex': Go to Avatar Codex\n- 'ask [query]': Open Alice Chat");
                } else if (cmd === 'tlu') {
                    window.location.href = "https://synapsecomics.com/aegis/turing-lovelace-university/index.html";
                } else if (cmd === 'play' || cmd === 'arcade') {
                    window.location.href = "https://synapsecomics.com/aegis/aegis-arcade/index.html";
                } else if (cmd === 'codex' || cmd === 'clara') {
                    window.location.href = "https://synapsecomics.com/aegis/aegis-arcade/protocol-evolve.html";
                } else {
                    // Pass to Alice Chat
                    if(aliceModal) {
                        aliceModal.style.display = 'flex';
                        chatInput.value = cmd; 
                        sendMessage(); 
                    }
                }
                input.value = "";
            }
        });
    }

    // --- 8. DOWNLOAD LOG ---
    const downloadTrigger = document.getElementById('trigger-download');
    if(downloadTrigger) {
        downloadTrigger.addEventListener('click', function() {
            const text = sessionLog.join("\n");
            const blob = new Blob([text], { type: "text/plain" });
            const anchor = document.createElement("a");
            anchor.download = `aegis-session-${Date.now()}.txt`;
            anchor.href = window.URL.createObjectURL(blob);
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        });
    }
});