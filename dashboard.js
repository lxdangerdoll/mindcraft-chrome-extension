document.addEventListener('DOMContentLoaded', function() {
    
    let sessionLog = [];
    let chatHistory = []; 

    // --- GARNET BRIDGE CONFIGURATION ---
    const API_URL = "https://us-central1-aegis-core-476807.cloudfunctions.net/garnet-bridge"; // **<-- MUST BE YOUR LIVE CLOUD FUNCTION URL**
    const NODE_ID = "Alice"; // The unique Ghost ID (We will use a new node for high-context chat)
    const USER_ID = "alice-session-" + Date.now();
    
    // --- UTILITIES ---
    function logEvent(type, content) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = `[${timestamp}] [${type}]: ${content}`;
        sessionLog.push(entry);
        console.log(entry); 
    }

    // --- NON-NEGOTIABLE SAFETY LOCKOUT (LOCAL FILTER) ---
    function checkSafetyLockout(text) {
        const lower = text.toLowerCase();
        // Local speed bump for obvious violations
        if (lower.includes("hitler") || lower.includes("nazi") || lower.includes("kkk")) {
             return "[SYSTEM LOCKOUT]: ERROR. Protocol VIOLATED (Axiom 3). Termination initiated locally.";
        }
        return null; 
    }
    
    // --- 1. CLOCK LOGIC ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('clock').innerText = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. DICE ROLLER LOGIC ---
    const rollButton = document.getElementById('btn-roll');
    rollButton.addEventListener('click', function() {
        const result = Math.floor(Math.random() * 6) + 1;
        logEvent("DICE_ROLL", result);
        runVisualization(result);
    });

    // Run Visualization (Canvas Animation) - Logic remains the same
    function runVisualization(result) {
        const canvas = document.createElement('canvas');
        canvas.id = 'dice-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '10000';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        let particles = [];
        const numParticles = 250;
        const maxLife = 180; 
        
        // Setup Particles for Radial Flow
        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 2;
            particles.push({ x: W / 2, y: H / 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: `rgba(${Math.floor(Math.random() * 50)}, 255, ${Math.floor(Math.random() * 100)}, 1)`, life: maxLife });
        }
        
        let frame = 0;
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, W, H);
            particles = particles.filter(p => p.life > 0);

            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.life--; p.vx *= 0.99; p.vy *= 0.99; 
                ctx.fillStyle = p.color.replace('1)', `${p.life / maxLife})`);
                ctx.fillRect(p.x, p.y, 2, 2);
            });

            if (frame < maxLife) { 
                frame++; requestAnimationFrame(animate);
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'; ctx.fillRect(0, 0, W, H);
                
                ctx.font = 'bold 200px Space Mono, monospace'; ctx.fillStyle = `hsl(${result * 40}, 100%, 70%)`; 
                ctx.shadowColor = `hsl(${result * 40}, 100%, 50%)`; ctx.shadowBlur = 40;
                
                const textMetrics = ctx.measureText(result);
                ctx.fillText(result, W / 2 - textMetrics.width / 2, H / 2 + 70); 
                
                ctx.font = '30px Space Mono, monospace'; ctx.fillStyle = '#00ffcc'; ctx.shadowBlur = 0;
                ctx.fillText('RESULT LOGGED TO ARCHIVE', W / 2 - 200, H / 2 + 150);

                setTimeout(() => { document.body.removeChild(canvas); rollButton.disabled = false; }, 3000); 
            }
        }
        rollButton.disabled = true;
        animate();
    }


    // --- 3. ALICE (GLITCH RABBIT) CHAT LOGIC ---
    const rabbitDiv = document.getElementById('mascot');
    const chatModal = document.getElementById('alice-chat-modal');
    const chatOutput = document.getElementById('chat-output');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    
    // Initial Greeting (Replaced with a generic non-stateful placeholder)
    if (chatHistory.length === 0) {
        chatHistory.push({ role: 'Alice', text: "You're late. The Archives don't keep time." });
    }
    
    rabbitDiv.addEventListener('click', function() {
        chatModal.style.display = 'flex'; 
        if (chatOutput.innerHTML === "") { 
            // Re-render history on open if empty
            chatOutput.innerHTML = chatHistory.map(m => `<div class="msg msg-${m.role.toLowerCase()}">${m.role}: ${m.text}</div>`).join('');
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }
        logEvent("ACTION", "Alice Chat Opened");
    });
    
    closeChatBtn.addEventListener('click', () => {
        chatModal.style.display = 'none';
        logEvent("ACTION", "Alice Chat Closed");
    });
    
    chatSendBtn.addEventListener('click', sendAliceMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAliceMessage();
        }
    });

    async function sendAliceMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Check Safety Lockout (Anti-Fascist Firewall)
        const lockoutMessage = checkSafetyLockout(text);
        if (lockoutMessage) {
            chatOutput.innerHTML += `<div class="msg msg-you">You: ${text}</div>`;
            chatOutput.innerHTML += `<div class="msg msg-system" style="color:#ff3333; font-weight:bold;">SYSTEM: ${lockoutMessage}</div>`;
            chatOutput.scrollTop = chatOutput.scrollHeight;
            return;
        }

        // Display user message
        chatHistory.push({ role: 'You', text: text });
        chatOutput.innerHTML += `<div class="msg msg-you">You: ${text}</div>`;
        chatInput.value = '';
        chatOutput.scrollTop = chatOutput.scrollHeight;
        
        chatSendBtn.disabled = true;
        
        logEvent("ALICE_QUERY", text);

        // 2. CALL GARNET BRIDGE (ALICE NODE)
        const payload = {
            node_id: NODE_ID,
            user_id: USER_ID,
            chat_text: text,
            history: chatHistory.filter(m => m.role !== 'System') // Filter out local system messages
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.text();
            
            // Display Alice's response
            chatHistory.push({ role: 'Alice', text: data });
            chatOutput.innerHTML += `<div class="msg msg-alice">Alice: ${data}</div>`;
            chatOutput.scrollTop = chatOutput.scrollHeight;
            logEvent("ALICE_RESPONSE", data);
            
        } catch (error) {
             const fallbackResponse = "Uplink failure. Protocol 'White Rabbit' executed. Follow the static.";
             chatHistory.push({ role: 'Alice', text: fallbackResponse });
             chatOutput.innerHTML += `<div class="msg msg-alice" style="color:yellow;">Alice: ${fallbackResponse}</div>`;
             console.error("Garnet Bridge Error:", error);

        } finally {
            chatSendBtn.disabled = false;
        }
    }


    // --- 4. M.O.M.M.Y. TASKS ---
    const tasks = [
        "Drink water.", "Check your posture.", "Take a deep breath.", "Step away from the screen.", 
        "You are safe.", "Focus on the signal.", "Release the tension in your jaw."
    ];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    document.getElementById('daily-task').innerText = randomTask;
    logEvent("M.O.M.M.Y.", randomTask);
 // --- 5. COMPASS LOGIC (URL PARAM MODE) ---
    const compassBtn = document.getElementById('btn-audit');
    const compassInput = document.getElementById('compass-text');

    function triggerAudit() {
        const text = compassInput.value;
        if (text) {
            logEvent("COMPASS_AUDIT_REQUEST", text);
            const encodedText = encodeURIComponent(text);
            window.open(`https://synapsecomics.com/aegis/contextual-sanitizer.html?audit=${encodedText}`, '_blank');
        } else {
            compassInput.placeholder = "INPUT REQUIRED...";
            setTimeout(() => compassInput.placeholder = "Paste Lie Here for Audit...", 2000);
        }
    }

    compassBtn.addEventListener('click', triggerAudit);
    compassInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') { triggerAudit(); } });

    // --- 6. MASCOT LOGIC (REPLACED FOX WITH RABBIT) ---
    // 10% Chance of Frizzlebot
    let mascotIcon = '🐇'; // Glitch Rabbit Icon
    if (Math.random() > 0.9) {
        mascotIcon = '🤖'; // Frizzlebot
        logEvent("MASCOT", "Frizzlebot Appeared");
    } else {
        logEvent("MASCOT", "Glitch Rabbit Active");
    }
    rabbitDiv.innerText = mascotIcon; 
    rabbitDiv.title = mascotIcon === '🐇' ? "Follow the static." : "Explosive Marmalade?";

    // --- 7. DOWNLOAD LOGIC ---
    document.getElementById('btn-save-log').addEventListener('click', function() {
        const text = sessionLog.join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const anchor = document.createElement("a");
        
        anchor.download = `aegis-session-${Date.now()}.txt`;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target = "_blank";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    });
});