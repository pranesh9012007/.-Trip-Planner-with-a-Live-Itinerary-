export function speakPhrase(text: string, countryOrLanguage?: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85; // slightly slower for language learners
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const searchLang = (countryOrLanguage || '').toLowerCase();

  let targetLangCode = 'en-US';
  if (searchLang.includes('japan') || searchLang.includes('ja')) targetLangCode = 'ja-JP';
  else if (searchLang.includes('ital') || searchLang.includes('it')) targetLangCode = 'it-IT';
  else if (searchLang.includes('spain') || searchLang.includes('mexic') || searchLang.includes('es')) targetLangCode = 'es-ES';
  else if (searchLang.includes('franc') || searchLang.includes('fr')) targetLangCode = 'fr-FR';
  else if (searchLang.includes('german') || searchLang.includes('de')) targetLangCode = 'de-DE';
  else if (searchLang.includes('iceland') || searchLang.includes('is')) targetLangCode = 'is-IS';
  else if (searchLang.includes('china') || searchLang.includes('zh')) targetLangCode = 'zh-CN';
  else if (searchLang.includes('korea') || searchLang.includes('ko')) targetLangCode = 'ko-KR';

  utterance.lang = targetLangCode;

  // Attempt to find a matching voice
  const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLangCode.toLowerCase().split('-')[0]));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}
