/* =========================================================
   AAROGYADRISHTI
   DR. VOICE ENGINE
   English + Hindi Medical AI Voice Assistant
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       GLOBAL VOICE OBJECT
    ===================================================== */

    window.AarogyaVoice =
        window.AarogyaVoice || {};


    /* =====================================================
       STATE
    ===================================================== */

    let selectedLanguage = "en";

    let speaking = false;

    let paused = false;

    let cancelled = false;

    let speechQueue = [];

    let currentIndex = 0;

    let availableVoices = [];

    let initialized = false;


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    let playButton = null;

    let stopButton = null;

    let englishButton = null;

    let hindiButton = null;

    let statusContainer = null;

    let statusText = null;


    /* =====================================================
       BROWSER SUPPORT
    ===================================================== */

    const speechSupported =
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window;


    /* =====================================================
       GET REPORT DATA
    ===================================================== */

    function getReportData() {

        const globalData =
            window.AAROGYA_REPORT || {};


        const predictionElement =
            document.getElementById(
                "predictionClass"
            );


        const confidenceElement =
            document.getElementById(
                "confidenceValue"
            );


        let prediction =
            globalData.prediction;


        let confidence =
            Number(
                globalData.confidence
            );


        if (!prediction && predictionElement) {

            prediction =
                predictionElement
                    .textContent
                    .trim()
                    .toLowerCase();

        }


        if (
            Number.isNaN(confidence) &&
            confidenceElement
        ) {

            confidence =
                parseFloat(
                    confidenceElement
                        .textContent
                        .replace("%", "")
                );

        }


        if (!prediction) {

            prediction =
                "non-tumorous";

        }


        if (Number.isNaN(confidence)) {

            confidence = 90;

        }


        return {

            prediction:
                prediction
                    .toString()
                    .trim()
                    .toLowerCase(),

            confidence:
                Math.max(
                    0,
                    Math.min(
                        100,
                        confidence
                    )
                ),

            patientName:
                globalData.patientName ||
                "Patient"

        };

    }


    /* =====================================================
       RESULT TYPE
    ===================================================== */

    function isTumorous() {

        const data =
            getReportData();


        return (

            data.prediction ===
                "tumorous" ||

            data.prediction ===
                "tumor" ||

            data.prediction ===
                "tumour" ||

            data.prediction ===
                "yes" ||

            data.prediction ===
                "positive"

        );

    }


    /* =====================================================
       LOAD VOICES
    ===================================================== */

    function loadVoices() {

        if (!speechSupported) {

            return [];

        }


        availableVoices =
            window.speechSynthesis
                .getVoices();


        return availableVoices;

    }


    if (speechSupported) {

        loadVoices();


        window.speechSynthesis
            .addEventListener(
                "voiceschanged",
                loadVoices
            );

    }


    /* =====================================================
       FIND BEST VOICE
    ===================================================== */

    function findBestVoice(
        language
    ) {

        const voices =
            availableVoices.length
                ? availableVoices
                : loadVoices();


        if (!voices.length) {

            return null;

        }


        const preferredLanguages =
            language === "hi"

                ? [
                    "hi-IN",
                    "hi",
                    "en-IN"
                ]

                : [
                    "en-IN",
                    "en-US",
                    "en-GB",
                    "en"
                ];


        for (
            const preferred
            of preferredLanguages
        ) {

            const voice =
                voices.find(
                    item => {

                        const lang =
                            (
                                item.lang ||
                                ""
                            )
                            .toLowerCase();


                        return lang
                            .startsWith(
                                preferred
                                    .toLowerCase()
                            );

                    }
                );


            if (voice) {

                return voice;

            }

        }


        return voices[0] || null;

    }


    /* =====================================================
       ENGLISH CONTENT
    ===================================================== */

    function getEnglishContent() {

        const data =
            getReportData();


        const confidence =
            data.confidence
                .toFixed(1);


        if (isTumorous()) {

            return [

                "Hello. I am Dr. Voice from AarogyaDrishti.",

                "Your brain MRI image has been analyzed by the AarogyaDrishti artificial intelligence system.",

                `The AI model indicates a tumorous class with a model confidence of ${confidence} percent.`,

                "Please remember that this is an AI assisted screening result and not a confirmed medical diagnosis.",

                "You should consult a qualified medical professional for clinical evaluation and appropriate further investigation.",

                "For general wellness, maintain a balanced diet containing vegetables, fruits, whole grains and other nutritious foods.",

                "Stay adequately hydrated and limit excessive consumption of highly processed foods.",

                "Maintain a regular sleep schedule and give your body enough rest.",

                "Gentle physical activity may be appropriate depending on your condition, but strenuous exercise should only be performed according to medical advice.",

                "Follow the treatment and medical recommendations provided by your healthcare professional.",

                "If you experience concerning, severe or worsening symptoms, seek appropriate medical attention.",

                "Thank you for using AarogyaDrishti. Please take care and consult your doctor for the next steps."

            ];

        }


        return [

            "Hello. I am Dr. Voice from AarogyaDrishti.",

            "Your brain MRI image has been analyzed by the AarogyaDrishti artificial intelligence system.",

            `The AI model indicates a non tumorous class with a model confidence of ${confidence} percent.`,

            "This result does not guarantee the complete absence of disease and should not replace professional medical evaluation.",

            "For maintaining good overall health, follow a balanced and nutritious diet containing vegetables, fruits, whole grains and other healthy foods.",

            "Stay adequately hydrated and limit excessive consumption of highly processed foods.",

            "Regular physical activity can support overall health when appropriate for your condition.",

            "Maintain a consistent sleep schedule and manage daily stress.",

            "Continue routine healthcare and discuss persistent or concerning symptoms with a qualified medical professional.",

            "Thank you for using AarogyaDrishti. Stay healthy and take care."

        ];

    }


    /* =====================================================
       HINDI CONTENT
    ===================================================== */

    function getHindiContent() {

        const data =
            getReportData();


        const confidence =
            data.confidence
                .toFixed(1);


        if (isTumorous()) {

            return [

                "नमस्ते। मैं आरोग्य दृष्टि का डॉक्टर वॉइस हूँ।",

                "आपकी ब्रेन एम आर आई इमेज का आरोग्य दृष्टि आर्टिफिशियल इंटेलिजेंस सिस्टम द्वारा विश्लेषण किया गया है।",

                `ए आई मॉडल के अनुसार इस इमेज में ट्यूमरस क्लास की संभावना दिखाई गई है और मॉडल का कॉन्फिडेंस ${confidence} प्रतिशत है।`,

                "कृपया ध्यान रखें कि यह केवल ए आई आधारित स्क्रीनिंग रिजल्ट है और इसे निश्चित मेडिकल डायग्नोसिस नहीं माना जाना चाहिए।",

                "आपको उचित क्लिनिकल जांच और आगे की प्रक्रिया के लिए किसी योग्य डॉक्टर या मेडिकल प्रोफेशनल से परामर्श जरूर करना चाहिए।",

                "अपने सामान्य स्वास्थ्य के लिए संतुलित और पौष्टिक भोजन लें जिसमें सब्जियां, फल, साबुत अनाज और अन्य पौष्टिक खाद्य पदार्थ शामिल हों।",

                "पर्याप्त पानी पिएं और बहुत अधिक प्रोसेस्ड भोजन के सेवन को कम करने की कोशिश करें।",

                "नियमित नींद लें और शरीर को पर्याप्त आराम दें।",

                "हल्की शारीरिक गतिविधि आपकी स्थिति के अनुसार की जा सकती है, लेकिन ज्यादा मेहनत वाली एक्सरसाइज डॉक्टर की सलाह के अनुसार ही करें।",

                "अपने डॉक्टर द्वारा दिए गए उपचार और मेडिकल निर्देशों का पालन करें।",

                "अगर कोई गंभीर या लगातार बढ़ने वाले लक्षण दिखाई दें तो उचित मेडिकल सहायता लें।",

                "आरोग्य दृष्टि का उपयोग करने के लिए धन्यवाद। अपना ध्यान रखें और आगे की प्रक्रिया के लिए डॉक्टर से सलाह जरूर लें।"

            ];

        }


        return [

            "नमस्ते। मैं आरोग्य दृष्टि का डॉक्टर वॉइस हूँ।",

            "आपकी ब्रेन एम आर आई इमेज का आरोग्य दृष्टि आर्टिफिशियल इंटेलिजेंस सिस्टम द्वारा विश्लेषण किया गया है।",

            `ए आई मॉडल के अनुसार इस इमेज में नॉन ट्यूमरस क्लास की संभावना दिखाई गई है और मॉडल का कॉन्फिडेंस ${confidence} प्रतिशत है।`,

            "ध्यान रखें कि यह रिजल्ट बीमारी की पूर्ण अनुपस्थिति की गारंटी नहीं देता और इसे प्रोफेशनल मेडिकल जांच का विकल्प नहीं माना जाना चाहिए।",

            "अपने स्वास्थ्य को बेहतर बनाए रखने के लिए संतुलित और पौष्टिक भोजन लें जिसमें सब्जियां, फल, साबुत अनाज और अन्य पौष्टिक खाद्य पदार्थ शामिल हों।",

            "पर्याप्त पानी पिएं और बहुत ज्यादा प्रोसेस्ड भोजन का सेवन कम करें।",

            "अपनी स्थिति के अनुसार नियमित शारीरिक गतिविधि करना सामान्य स्वास्थ्य के लिए उपयोगी हो सकता है।",

            "पर्याप्त नींद लें और रोजमर्रा के तनाव को नियंत्रित रखने की कोशिश करें।",

            "नियमित स्वास्थ्य जांच जारी रखें और अगर कोई लगातार या चिंताजनक लक्षण दिखाई दें तो योग्य डॉक्टर से सलाह लें।",

            "आरोग्य दृष्टि का उपयोग करने के लिए धन्यवाद। स्वस्थ रहें और अपना ध्यान रखें।"

        ];

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function setStatus(
        message,
        active = false
    ) {

        if (statusText) {

            statusText.textContent =
                message;

        }


        if (statusContainer) {

            statusContainer.classList.toggle(
                "speaking",
                active
            );

        }

    }


    /* =====================================================
       BUTTON STATE
    ===================================================== */

    function updatePlayButton(
        active
    ) {

        if (!playButton) {

            return;

        }


        const icon =
            playButton.querySelector(
                "i"
            );


        const text =
            playButton.querySelector(
                "span"
            );


        if (active) {

            if (icon) {

                icon.className =
                    "fa-solid fa-pause";

            }


            if (text) {

                text.textContent =
                    "Pause Voice";

            }

        } else {

            if (icon) {

                icon.className =
                    "fa-solid fa-play";

            }


            if (text) {

                text.textContent =
                    "Listen to Report";

            }

        }

    }


    /* =====================================================
       SPEAK SENTENCE
    ===================================================== */

    function speakCurrentSentence() {

        if (!speechSupported) {

            setStatus(
                "Speech is not supported in this browser."
            );

            return;

        }


        if (
            cancelled ||
            currentIndex >=
            speechQueue.length
        ) {

            finish();

            return;

        }


        const sentence =
            speechQueue[
                currentIndex
            ];


        const utterance =
            new SpeechSynthesisUtterance(
                sentence
            );


        const voice =
            findBestVoice(
                selectedLanguage
            );


        if (voice) {

            utterance.voice =
                voice;

        }


        utterance.lang =
            selectedLanguage === "hi"
                ? "hi-IN"
                : "en-IN";


        utterance.rate =
            selectedLanguage === "hi"
                ? 0.86
                : 0.90;


        utterance.pitch =
            1;


        utterance.volume =
            1;


        utterance.onstart =
            () => {

                speaking = true;

                paused = false;

                updatePlayButton(
                    true
                );

                setStatus(
                    selectedLanguage === "hi"
                        ? "हिंदी में रिपोर्ट समझाई जा रही है..."
                        : "Explaining your report...",
                    true
                );

            };


        utterance.onend =
            () => {

                if (cancelled) {

                    return;

                }


                currentIndex++;


                setTimeout(
                    () => {

                        speakCurrentSentence();

                    },
                    120
                );

            };


        utterance.onerror =
            (event) => {

                console.warn(
                    "Speech error:",
                    event
                );


                if (
                    event.error ===
                    "canceled"
                ) {

                    return;

                }


                finish();

            };


        window.speechSynthesis
            .speak(
                utterance
            );

    }


    /* =====================================================
       START
    ===================================================== */

    function start() {

        if (!speechSupported) {

            setStatus(
                "Voice is not supported by this browser."
            );


            showVoiceToast(
                "Voice Unavailable",
                "Please use Chrome or Microsoft Edge.",
                "error"
            );


            return;

        }


        /*
         * If currently paused,
         * resume instead of restarting.
         */

        if (
            speaking &&
            paused
        ) {

            resume();

            return;

        }


        /*
         * If already speaking,
         * do nothing.
         */

        if (speaking) {

            return;

        }


        window.speechSynthesis
            .cancel();


        cancelled =
            false;


        paused =
            false;


        currentIndex =
            0;


        speechQueue =
            selectedLanguage === "hi"
                ? getHindiContent()
                : getEnglishContent();


        if (!speechQueue.length) {

            return;

        }


        speakCurrentSentence();

    }


    /* =====================================================
       PAUSE
    ===================================================== */

    function pause() {

        if (
            !speechSupported ||
            !speaking
        ) {

            return;

        }


        window.speechSynthesis
            .pause();


        paused =
            true;


        if (playButton) {

            const icon =
                playButton.querySelector(
                    "i"
                );


            const text =
                playButton.querySelector(
                    "span"
                );


            if (icon) {

                icon.className =
                    "fa-solid fa-play";

            }


            if (text) {

                text.textContent =
                    "Resume Voice";

            }

        }


        setStatus(
            selectedLanguage === "hi"
                ? "आवाज़ रोक दी गई है।"
                : "Voice paused.",
            false
        );

    }


    /* =====================================================
       RESUME
    ===================================================== */

    function resume() {

        if (
            !speechSupported ||
            !speaking
        ) {

            start();

            return;

        }


        window.speechSynthesis
            .resume();


        paused =
            false;


        updatePlayButton(
            true
        );


        setStatus(
            selectedLanguage === "hi"
                ? "हिंदी में रिपोर्ट जारी है..."
                : "Report explanation resumed...",
            true
        );

    }


    /* =====================================================
       STOP
    ===================================================== */

    function stop() {

        cancelled =
            true;


        speaking =
            false;


        paused =
            false;


        speechQueue =
            [];


        currentIndex =
            0;


        if (speechSupported) {

            window.speechSynthesis
                .cancel();

        }


        updatePlayButton(
            false
        );


        setStatus(
            selectedLanguage === "hi"
                ? "बोलने के लिए तैयार"
                : "Ready to speak.",
            false
        );

    }


    /* =====================================================
       FINISH
    ===================================================== */

    function finish() {

        speaking =
            false;


        paused =
            false;


        cancelled =
            false;


        updatePlayButton(
            false
        );


        setStatus(
            selectedLanguage === "hi"
                ? "हिंदी रिपोर्ट पूरी हो गई।"
                : "Report explanation completed.",
            false
        );


        showVoiceToast(
            "Dr. Voice",
            selectedLanguage === "hi"
                ? "रिपोर्ट की हिंदी व्याख्या पूरी हो गई।"
                : "Your report explanation is complete.",
            "success"
        );

    }


    /* =====================================================
       LANGUAGE
    ===================================================== */

    function selectLanguage(
        language
    ) {

        if (
            language !== "en" &&
            language !== "hi"
        ) {

            return;

        }


        const wasSpeaking =
            speaking;


        stop();


        selectedLanguage =
            language;


        if (englishButton) {

            englishButton.classList.toggle(
                "active",
                language === "en"
            );

        }


        if (hindiButton) {

            hindiButton.classList.toggle(
                "active",
                language === "hi"
            );

        }


        setStatus(
            language === "hi"
                ? "हिंदी में बोलने के लिए तैयार"
                : "Ready to speak in English.",
            false
        );


        /*
         * If user changes language
         * while voice was playing,
         * automatically continue in
         * the newly selected language.
         */

        if (wasSpeaking) {

            setTimeout(
                start,
                250
            );

        }

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showVoiceToast(
        title,
        message,
        type = "info"
    ) {

        const toast =
            document.getElementById(
                "reportToast"
            );


        if (!toast) {

            return;

        }


        const titleElement =
            document.getElementById(
                "toastTitle"
            );


        const messageElement =
            document.getElementById(
                "toastMessage"
            );


        if (titleElement) {

            titleElement.textContent =
                title;

        }


        if (messageElement) {

            messageElement.textContent =
                message;

        }


        const icon =
            toast.querySelector(
                ".toast-icon i"
            );


        if (icon) {

            icon.className =
                "fa-solid " +
                (
                    type === "success"
                        ? "fa-circle-check"
                        : type === "error"
                            ? "fa-circle-exclamation"
                            : "fa-circle-info"
                );

        }


        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

    }


    /* =====================================================
       INITIALIZE ELEMENTS
    ===================================================== */

    function initialize() {

        /*
         * Prevent duplicate initialization.
         *
         * This is useful because report.js
         * already contains a voice system.
         */

        if (
            window.AarogyaReport &&
            typeof window.AarogyaReport.startVoice ===
                "function"
        ) {

            console.info(
                "AarogyaDrishti: Report voice engine already initialized."
            );

            return false;

        }


        playButton =
            document.getElementById(
                "voicePlayBtn"
            );


        stopButton =
            document.getElementById(
                "voiceStopBtn"
            );


        englishButton =
            document.getElementById(
                "voiceEnglish"
            );


        hindiButton =
            document.getElementById(
                "voiceHindi"
            );


        statusContainer =
            document.getElementById(
                "voiceStatus"
            );


        statusText =
            document.getElementById(
                "voiceStatusText"
            );


        if (!playButton) {

            console.info(
                "AarogyaDrishti: Dr. Voice controls not found on this page."
            );

            return false;

        }


        initialized =
            true;


        /* ---------------------------------------------
           PLAY / PAUSE
        --------------------------------------------- */

        playButton.addEventListener(
            "click",
            () => {

                if (!speechSupported) {

                    start();

                    return;

                }


                if (
                    speaking &&
                    !paused
                ) {

                    pause();

                } else {

                    start();

                }

            }
        );


        /* ---------------------------------------------
           STOP
        --------------------------------------------- */

        if (stopButton) {

            stopButton.addEventListener(
                "click",
                stop
            );

        }


        /* ---------------------------------------------
           ENGLISH
        --------------------------------------------- */

        if (englishButton) {

            englishButton.addEventListener(
                "click",
                () => {

                    selectLanguage(
                        "en"
                    );

                }
            );

        }


        /* ---------------------------------------------
           HINDI
        --------------------------------------------- */

        if (hindiButton) {

            hindiButton.addEventListener(
                "click",
                () => {

                    selectLanguage(
                        "hi"
                    );

                }
            );

        }


        /* ---------------------------------------------
           DEFAULT LANGUAGE
        --------------------------------------------- */

        selectLanguage(
            "en"
        );


        /* ---------------------------------------------
           KEYBOARD
        --------------------------------------------- */

        document.addEventListener(
            "keydown",
            (event) => {

                /*
                 * Spacebar
                 */

                if (
                    event.code === "Space" &&
                    ![
                        "INPUT",
                        "TEXTAREA",
                        "SELECT"
                    ].includes(
                        document.activeElement?.tagName
                    )
                ) {

                    event.preventDefault();


                    if (
                        speaking &&
                        !paused
                    ) {

                        pause();

                    } else {

                        start();

                    }

                }


                /*
                 * Escape
                 */

                if (
                    event.key === "Escape"
                ) {

                    stop();

                }

            }
        );


        /* ---------------------------------------------
           PAGE EXIT
        --------------------------------------------- */

        window.addEventListener(
            "beforeunload",
            stop
        );


        setStatus(
            "Ready to speak.",
            false
        );


        return true;

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.AarogyaVoice.start =
        start;


    window.AarogyaVoice.pause =
        pause;


    window.AarogyaVoice.resume =
        resume;


    window.AarogyaVoice.stop =
        stop;


    window.AarogyaVoice.selectLanguage =
        selectLanguage;


    window.AarogyaVoice.isSpeaking =
        () => speaking;


    window.AarogyaVoice.getLanguage =
        () => selectedLanguage;


    window.AarogyaVoice.supported =
        speechSupported;


    window.AarogyaVoice.initialize =
        initialize;


    /* =====================================================
       AUTO INITIALIZATION
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();

    }


})();