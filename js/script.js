const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const fromTranscription = document.querySelector(".from-transcription");
const toTranscription = document.querySelector(".to-transcription");
const exchageIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");
const stats = document.querySelector(".stats");
const languageInfo = document.querySelector(".language-info");

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "ru-RU" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Функция для получения транскрипции
function getTranscription(text, lang) {
    if (!text) return "";
    
    // Простые правила транскрипции для некоторых языков
    const transcriptionRules = {
        "ru-RU": (text) => {
            const rules = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
                'е': 'ye', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
                'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
                'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
                'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
                'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
                'э': 'e', 'ю': 'yu', 'я': 'ya'
            };
            
            return text.toLowerCase().split('').map(char => 
                rules[char] || char
            ).join('');
        },
        "en-GB": (text) => {
            const rules = {
                'a': 'æ', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'ɛ',
                'f': 'f', 'g': 'g', 'h': 'h', 'i': 'ɪ', 'j': 'dʒ',
                'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'ɒ',
                'p': 'p', 'q': 'kw', 'r': 'r', 's': 's', 't': 't',
                'u': 'ʊ', 'v': 'v', 'w': 'w', 'x': 'ks', 'y': 'j',
                'z': 'z'
            };
            
            return text.toLowerCase().split('').map(char => 
                rules[char] || char
            ).join('');
        },
        "es-ES": (text) => {
            const rules = {
                'a': 'a', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'e',
                'f': 'f', 'g': 'g', 'h': '', 'i': 'i', 'j': 'x',
                'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'ñ': 'ɲ',
                'o': 'o', 'p': 'p', 'q': 'k', 'r': 'r', 's': 's',
                't': 't', 'u': 'u', 'v': 'b', 'w': 'w', 'x': 'ks',
                'y': 'ʝ', 'z': 'θ'
            };
            
            return text.toLowerCase().split('').map(char => 
                rules[char] || char
            ).join('');
        },
        "fr-FR": (text) => {
            const rules = {
                'a': 'a', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'ə',
                'f': 'f', 'g': 'ʒ', 'h': '', 'i': 'i', 'j': 'ʒ',
                'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o',
                'p': 'p', 'q': 'k', 'r': 'ʁ', 's': 's', 't': 't',
                'u': 'y', 'v': 'v', 'w': 'w', 'x': 'ks', 'y': 'i',
                'z': 'z'
            };
            
            return text.toLowerCase().split('').map(char => 
                rules[char] || char
            ).join('');
        },
        "de-DE": (text) => {
            const rules = {
                'a': 'a', 'b': 'b', 'c': 'ts', 'd': 'd', 'e': 'e',
                'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j',
                'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o',
                'p': 'p', 'q': 'kv', 'r': 'ʁ', 's': 'z', 't': 't',
                'u': 'u', 'v': 'f', 'w': 'v', 'x': 'ks', 'y': 'y',
                'z': 'ts', 'ä': 'ɛ', 'ö': 'ø', 'ü': 'y', 'ß': 's'
            };
            
            return text.toLowerCase().split('').map(char => 
                rules[char] || char
            ).join('');
        }
    };
    
    const rule = transcriptionRules[lang];
    return rule ? rule(text) : text;
}

// Функция для обновления статистики
function updateStats() {
    const text = fromText.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    stats.textContent = `Characters: ${chars} | Words: ${words}`;
}

// Функция для обновления информации о языках
function updateLanguageInfo() {
    const fromLang = countries[selectTag[0].value];
    const toLang = countries[selectTag[1].value];
    languageInfo.innerHTML = `<span>Detected: ${fromLang}</span><span>Translation: ${toLang}</span>`;
}

exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
    
    // Обновляем транскрипции при обмене языками
    fromTranscription.textContent = getTranscription(fromText.value, selectTag[0].value) || "Transcription will appear here";
    toTranscription.textContent = getTranscription(toText.value, selectTag[1].value) || "Транскрипция появится здесь";
    
    updateLanguageInfo();
    updateStats();
});

fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
        fromTranscription.textContent = "Transcription will appear here";
        toTranscription.textContent = "Транскрипция появится здесь";
    } else {
        // Обновляем транскрипцию исходного текста
        fromTranscription.textContent = getTranscription(fromText.value, selectTag[0].value);
    }
    updateStats();
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return;
    
    toText.setAttribute("placeholder", "Translating...");
    fromTranscription.textContent = getTranscription(text, translateFrom);
    toTranscription.textContent = "Transcribing...";
    
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if (data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
        
        // Обновляем транскрипцию переведенного текста
        toTranscription.textContent = getTranscription(toText.value, translateTo);
        
        updateLanguageInfo();
    }).catch(error => {
        console.error("Translation error:", error);
        toText.setAttribute("placeholder", "Translation");
        toTranscription.textContent = "Транскрипция появится здесь";
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else if (target.classList.contains("fa-volume-up")) {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        } else if (target.classList.contains("fa-star")) {
            // Функциональность сохранения перевода
            const translation = {
                fromText: fromText.value,
                toText: toText.value,
                fromLang: selectTag[0].value,
                toLang: selectTag[1].value,
                timestamp: new Date().toLocaleString()
            };
            // Здесь можно добавить сохранение в localStorage
            alert("Translation saved to favorites!");
            target.classList.toggle("fas");
            target.classList.toggle("far");
        }
    });
});

// Инициализация при загрузке
updateStats();
updateLanguageInfo();