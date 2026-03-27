const voiceSelect = document.querySelector('#voiceSelect');
const cardItems = document.querySelectorAll('.card-item');
let voices = [];
let audioAtivado = false; // Trava de segurança do iOS

function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    const ptVoices = voices.filter(voice => voice.lang.includes('pt'));

    if (ptVoices.length > 0) {
        voiceSelect.innerHTML = ptVoices
            .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
            .join('');
    }
}

// Garante o carregamento das vozes
window.speechSynthesis.onvoiceschanged = populateVoiceList;
populateVoiceList();

// FUNÇÃO DE DESBLOQUEIO (O SEGREDO DO IPHONE)
function desbloquearAudio() {
    if (!audioAtivado) {
        // Cria uma fala muda de 1 milissegundo para "pedir licença" ao iOS
        const mudo = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(mudo);
        audioAtivado = true;
        console.log("Áudio desbloqueado para iOS");
    }
}

function falar(texto) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    const selectedVoiceName = voiceSelect.value;
    const selectedVoice = voices.find(v => v.name === selectedVoiceName);
    
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    
    window.speechSynthesis.speak(utterance);
}

// INTERAÇÃO DO USUÁRIO
voiceSelect.addEventListener('change', () => {
    desbloquearAudio(); // Desbloqueia quando o usuário escolhe a voz
});

cardItems.forEach(item => {
    // No iPhone, usamos 'click' ou 'touchend' para garantir o desbloqueio
    item.addEventListener('click', () => {
        desbloquearAudio(); 
        const text = item.innerText.trim().replace(/\n/g, '. ');
        falar(text);
    });

    // Mantém o suporte para quem usa mouse
    item.addEventListener('mouseenter', () => {
        if(audioAtivado) {
            const text = item.innerText.trim().replace(/\n/g, '. ');
            falar(text);
        }
    });
});