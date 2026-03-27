const voiceSelect = document.querySelector('#voiceSelect');
const cardItems = document.querySelectorAll('.card-item');
let voices = [];

// Função para preencher a lista de vozes
function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    
    // Filtra vozes apenas em Português
    const ptVoices = voices.filter(voice => voice.lang.includes('pt'));

    voiceSelect.innerHTML = ptVoices
        .map((voice, index) => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

// Inicializa a lista de vozes
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function falar(texto) {
    window.speechSynthesis.cancel(); // Para a fala atual

    const utterance = new SpeechSynthesisUtterance(texto);
    
    // Aplica a voz selecionada pelo usuário
    const selectedVoiceName = voiceSelect.value;
    utterance.voice = voices.find(voice => voice.name === selectedVoiceName);
    
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}

// Adiciona os eventos em cada card
cardItems.forEach(item => {
    // Evento para Mouse e Touch
    const triggerSpeech = () => {
        const text = item.innerText.replace(/\n/g, '. ');
        falar(text);
    };

    item.addEventListener('mouseenter', triggerSpeech);
    item.addEventListener('touchstart', (e) => {
        // e.preventDefault(); // Opcional: evita comportamentos padrão do browser no toque
        triggerSpeech();
    });
});