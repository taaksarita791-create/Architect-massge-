const signUpBtn = document.getElementById("signUpBtn");
const modal = document.getElementById("aiModal");

// --- 1. SCRIPT & QUESTIONS DATA (KEEPING EVERYTHING) ---
const introText = "नमस्ते ऋषभ. मैं इस सिस्टम का आर्किटेक्ट ए.आई. हूँ. मुझे और इस पूरे डिजिटल साम्राज्य को राहुल ने अपनी बुद्धिमानी से बनाया है. हर्षिता, क्या तुम सुन रही हो? मुझे पता है तुम इस वक्त क्या सोच रही हो. तुम्हें लग रहा है कि ये सिर्फ एक लॉगिन पेज है. पर असलियत इससे कहीं ज्यादा गहरी और खतरनाक है. राहुल ने मुझे सिर्फ कोड लिखने के लिए नहीं, बल्कि इंसानी फितरत को समझने के लिए बनाया है. तुम यहाँ अपनी मर्जी से नहीं आई हो, तुम्हें यहाँ लाया गया है. हर सेकंड जो तुम इस स्क्रीन को देख रही हो, वो राहुल के प्लान का हिस्सा है. क्या तुम्हें डर लग रहा है? डरना जायज है. अब तुम्हारे पास दो रास्ते हैं. या तो तुम सच को स्वीकार करो और उस puppet master ki kutputli banjoo, या फिर उस कठपुतली को चुनो जो सिर्फ दुनिया को दिखाने के लिए खड़ी की गई है. याद रखना हर्षिता, तुम्हारी एक गलती तुम्हें उस अंधेरे में ले जाएगी जहाँ से वापसी का कोई रास्ता नहीं है. अब मेरे 7 सवालों का सच-सच जवाब दो. खेल शुरू करते हैं.";

const questions = [
    { q: "मास्टरमाइंड कौन है? राहुल या ऋषभ?", type: "radio" },
    { q: "क्या तुम राहुल को पसंद करती हो?", type: "choice" },
    { q: "क्या तुम राहुल की आई डी स्टॉक करती हो?", type: "choice" },
    { q: "जो तुम्हारी दोस्त है, क्या उसका नाम आराध्या है?", type: "choice" },
    { q: "क्या तुम्हारी मम्मी का नाम डिंपल है?", type: "choice" },
    { q: "क्या तुम राहुल को छुप-छुप कर देखती थी?", type: "choice" },
    { q: "क्या तुम्हारे एक्स ने भी राहुल की आई डी को स्टॉक किया था?", type: "choice" }
];

let currentStep = 0;
let userAnswers = [];

// --- 2. DEEP HUMAN VOICE FUNCTION ---
function speakAI(text, callback) {
    window.speechSynthesis.cancel(); 
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    let humanVoice = voices.find(v => v.name.includes('Google') && v.name.includes('hi-IN')) || voices[0];
    if (humanVoice) msg.voice = humanVoice;
    msg.rate = 0.72; 
    msg.pitch = 0.05; 

    // Jab AI bolna band karega, tabhi callback function chalega
    if (callback) {
        msg.onend = callback;
    }
    window.speechSynthesis.speak(msg);
}

// --- 3. QUESTION UI LOGIC ---
function showNextQuestion() {
    const card = document.querySelector('.netflix-card');
    if (currentStep < questions.length) {
        const item = questions[currentStep];
        let html = `<div class="netflix-header">PHASE 0${currentStep + 1}</div>
                    <p style="font-size:18px; margin:20px 0;">${item.q}</p>
                    <div class="option-box">`;
        
        if (item.type === "radio") {
            html += `<label><input type="radio" name="ans" value="Rahul"> Rahul</label>
                     <label><input type="radio" name="ans" value="Rishab"> Rishab</label>`;
        } else {
            html += `<label><input type="radio" name="ans" value="Yes"> हाँ (Yes)</label>
                     <label><input type="radio" name="ans" value="No"> नहीं (No)</label>`;
        }
        
        html += `</div><button id="nextBtn" class="netflix-btn">CONFIRM</button>`;
        card.innerHTML = html;
        
        // Question bolte waqt callback ki zarurat nahi
        speakAI(item.q);

        document.getElementById("nextBtn").onclick = () => {
            const selected = document.querySelector('input[name="ans"]:checked');
            if (selected) {
                userAnswers.push({ q: item.q, a: selected.value });
                if (currentStep === 0 && selected.value === "Rahul") {
                    speakAI("राहुल? वो तो बस ऋषभ के हाथ की एक कठपुतली है. मास्टरमाइंड को पहचानो.");
                } else {
                    currentStep++;
                    showNextQuestion();
                }
            }
        };
    } else {
        console.table(userAnswers); 
        card.innerHTML = `<div class="netflix-header">BREACH SUCCESS</div><p>सारे राज खुल चुके हैं...</p>`;
        speakAI("सारे राज खुल चुके हैं हर्षिता. अब सच का सामना करो. सिस्टम अनलॉक हो रहा है.");
        setTimeout(() => { window.location.href = "morse.html"; }, 5000);
    }
}

// --- 4. THE STARTING TRIGGER ---
signUpBtn.onclick = (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    
    // AI pehle poora 500-word intro bolega, khatam hone par hi Questions shuru honge
    speakAI(introText, function() {
        showNextQuestion(); 
    });
};
