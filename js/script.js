const voiceSelect = document.querySelector('#voiceSelect');
const cardItems = document.querySelectorAll('.card-item');
let voices = [];

function populateVoiceList() {
    // Pega as vozes disponíveis no sistema (iOS, Android, Windows, etc.)
    voices = window.speechSynthesis.getVoices();
    
    // Se a lista estiver vazia (comum no início do carregamento no Chrome/Safari)
    if (voices.length === 0) {
        return;
    }

    // Filtra vozes em Português (Brasil e Portugal)
    const ptVoices = voices.filter(voice => voice.lang.includes('pt'));

    // Limpa o seletor e adiciona as vozes encontradas
    voiceSelect.innerHTML = ptVoices
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');

    // Se encontrar a voz "Luciana" ou "Siri", tenta selecionar por padrão no iPhone
    const defaultVoice = ptVoices.find(v => v.name.includes('Luciana') || v.name.includes('Siri'));
    if (defaultVoice) {
        voiceSelect.value = defaultVoice.name;
    }
}

// O iOS e alguns navegadores carregam as vozes de forma assíncrona
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}
// Chama uma vez para garantir em navegadores que não disparam o evento acima
populateVoiceList();

function falar(texto) {
    // No iOS, é CRUCIAL cancelar a fala anterior antes de começar a nova
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    
    // Define a voz escolhida no seletor
    const selectedVoiceName = voiceSelect.value;
    const selectedVoice = voices.find(v => v.name === selectedVoiceName);
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.lang = 'pt-BR';
    utterance.rate = 1.0; // Velocidade 1.0 é a ideal para o iPhone
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
}

// Eventos de toque para mobile
cardItems.forEach(item => {
    const triggerSpeech = (e) => {
        // Pega o texto e limpa espaços extras para a Siri ler direitinho
        const text = item.innerText.trim().replace(/\n/g, '. ');
        falar(text);
    };

    // 'touchstart' é o segredo para funcionar instantaneamente no iPhone
    item.addEventListener('touchstart', triggerSpeech, { passive: true });
    item.addEventListener('mouseenter', triggerSpeech);
});