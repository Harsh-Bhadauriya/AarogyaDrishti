/* =========================================================
   AAROGYADRISHTI
   REPORT PAGE JAVASCRIPT
   Premium Medical AI Interface
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       REPORT DATA
    ===================================================== */

    const reportData = window.AAROGYA_REPORT || {};


    const prediction =
        String(
            reportData.prediction ||
            document
                .getElementById("predictionClass")
                ?.textContent ||
            "non-tumorous"
        )
        .trim()
        .toLowerCase();


    let confidence =
        Number(
            reportData.confidence
        );


    if (Number.isNaN(confidence)) {

        const confidenceElement =
            document.getElementById(
                "confidenceValue"
            );

        confidence =
            parseFloat(
                confidenceElement
                    ?.textContent
                    ?.replace("%", "")
            );

    }


    if (
        Number.isNaN(confidence)
    ) {

        confidence = 90;

    }


    confidence =
        Math.max(
            0,
            Math.min(
                100,
                confidence
            )
        );


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const confidenceValue =
        document.getElementById(
            "confidenceValue"
        );


    const confidenceFill =
        document.getElementById(
            "confidenceFill"
        );


    const voicePlayBtn =
        document.getElementById(
            "voicePlayBtn"
        );


    const voiceStopBtn =
        document.getElementById(
            "voiceStopBtn"
        );


    const voiceEnglish =
        document.getElementById(
            "voiceEnglish"
        );


    const voiceHindi =
        document.getElementById(
            "voiceHindi"
        );


    const voiceStatus =
        document.getElementById(
            "voiceStatus"
        );


    const voiceStatusText =
        document.getElementById(
            "voiceStatusText"
        );


    const downloadReportBtn =
        document.getElementById(
            "downloadReportBtn"
        );


    const printReportBtn =
        document.getElementById(
            "printReportBtn"
        );


    const reportToast =
        document.getElementById(
            "reportToast"
        );


    const toastTitle =
        document.getElementById(
            "toastTitle"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    const toastClose =
        document.getElementById(
            "toastClose"
        );


    /* =====================================================
       HELPERS
    ===================================================== */

    function isTumorous() {

        return (
            prediction === "tumorous" ||
            prediction === "tumor" ||
            prediction === "yes" ||
            prediction === "positive"
        );

    }


    function getPredictionLabel() {

        return isTumorous()
            ? "Tumorous"
            : "Non-Tumorous";

    }


    function sleep(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );

    }


    /* =====================================================
       TOAST SYSTEM
    ===================================================== */

    let toastTimer = null;


    function showToast(
        title,
        message,
        type = "info",
        duration = 3500
    ) {

        if (!reportToast) return;


        if (toastTimer) {

            clearTimeout(
                toastTimer
            );

        }


        if (toastTitle) {

            toastTitle.textContent =
                title;

        }


        if (toastMessage) {

            toastMessage.textContent =
                message;

        }


        const toastIcon =
            reportToast.querySelector(
                ".toast-icon i"
            );


        if (toastIcon) {

            toastIcon.className =
                "fa-solid " +
                (
                    type === "success"
                        ? "fa-circle-check"
                        : type === "error"
                            ? "fa-circle-exclamation"
                            : "fa-circle-info"
                );

        }


        reportToast.classList.add(
            "show"
        );


        toastTimer =
            setTimeout(
                () => {

                    hideToast();

                },
                duration
            );

    }


    function hideToast() {

        if (!reportToast) return;

        reportToast.classList.remove(
            "show"
        );

    }


    if (toastClose) {

        toastClose.addEventListener(
            "click",
            hideToast
        );

    }


    /* =====================================================
       CONFIDENCE ANIMATION
    ===================================================== */

    function animateConfidence() {

        if (!confidenceValue) return;


        const target =
            confidence;


        const duration =
            1300;


        const startTime =
            performance.now();


        if (confidenceFill) {

            confidenceFill.style.width =
                "0%";

        }


        function update(
            currentTime
        ) {

            const progress =
                Math.min(
                    (
                        currentTime -
                        startTime
                    ) /
                    duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                target * eased;


            confidenceValue.textContent =
                `${current.toFixed(2)}%`;


            if (confidenceFill) {

                confidenceFill.style.width =
                    `${current}%`;

            }


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            } else {

                confidenceValue.textContent =
                    `${target.toFixed(2)}%`;

            }

        }


        requestAnimationFrame(
            update
        );

    }


    setTimeout(
        animateConfidence,
        500
    );


    /* =====================================================
       VOICE SYSTEM
    ===================================================== */

    let selectedLanguage =
        "en";


    let isSpeaking =
        false;


    let speechQueue = [];


    let currentSpeechIndex =
        0;


    let speechCancelled =
        false;


    const supportsSpeech =
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window;


    function setVoiceStatus(
        text,
        speaking = false
    ) {

        if (voiceStatusText) {

            voiceStatusText.textContent =
                text;

        }


        if (voiceStatus) {

            voiceStatus.classList.toggle(
                "speaking",
                speaking
            );

        }

    }


    function updateVoiceButton(
        speaking
    ) {

        if (!voicePlayBtn) return;


        const icon =
            voicePlayBtn.querySelector(
                "i"
            );


        const text =
            voicePlayBtn.querySelector(
                "span"
            );


        if (speaking) {

            if (icon) {

                icon.className =
                    "fa-solid fa-volume-high";

            }


            if (text) {

                text.textContent =
                    "Speaking...";

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
       VOICE TEXT — ENGLISH
    ===================================================== */

    function getEnglishSpeech() {

        const result =
            getPredictionLabel();


        const confidenceText =
            `${confidence.toFixed(1)} percent`;


        if (isTumorous()) {

            return [

                `Hello. I am Dr. Voice from AarogyaDrishti.`,

                `Your brain MRI image has been analyzed by our artificial intelligence system.`,

                `The AI prediction indicates a tumorous class with a model confidence of ${confidenceText}.`,

                `Please remember that this is an AI assisted screening result and not a confirmed medical diagnosis.`,

                `It is important to consult a qualified medical professional for proper clinical evaluation and further investigation.`,

                `For general wellness, maintain a balanced and nutritious diet with vegetables, fruits, whole grains and adequate hydration.`,

                `Avoid excessive consumption of highly processed foods.`,

                `Keep a regular sleep schedule and give your body adequate rest.`,

                `Gentle physical activity may be considered when appropriate, but strenuous activity should only be performed according to medical advice.`,

                `Most importantly, follow the advice and treatment plan provided by your healthcare professional.`,

                `If you experience concerning or worsening symptoms, seek appropriate medical attention.`,

                `Thank you for using AarogyaDrishti. Please take care and consult a healthcare professional for the next steps.`

            ];

        }


        return [

            `Hello. I am Dr. Voice from AarogyaDrishti.`,

            `Your brain MRI image has been analyzed by our artificial intelligence system.`,

            `The AI prediction indicates a non tumorous class with a model confidence of ${confidenceText}.`,

            `This result does not guarantee the absence of disease and should not replace professional medical evaluation.`,

            `For maintaining good overall health, follow a balanced diet containing vegetables, fruits, whole grains and nutritious foods.`,

            `Stay adequately hydrated and limit excessive consumption of highly processed foods.`,

            `Regular physical activity, adequate sleep and stress management can support overall wellbeing.`,

            `Continue routine healthcare and discuss any persistent or concerning symptoms with a qualified medical professional.`,

            `Thank you for using AarogyaDrishti. Stay healthy and take care.`

        ];

    }


    /* =====================================================
       VOICE TEXT — HINDI
    ===================================================== */

    function getHindiSpeech() {

        const confidenceText =
            `${confidence.toFixed(1)} प्रतिशत`;


        if (isTumorous()) {

            return [

                `नमस्ते। मैं आरोग्य दृष्टि का डॉक्टर वॉइस हूँ।`,

                `आपकी ब्रेन एम आर आई इमेज का हमारे आर्टिफिशियल इंटेलिजेंस सिस्टम द्वारा विश्लेषण किया गया है।`,

                `ए आई मॉडल के अनुसार इस इमेज में ट्यूमरस क्लास की संभावना दिखाई गई है और मॉडल का कॉन्फिडेंस ${confidenceText} है।`,

                `ध्यान रखें कि यह केवल ए आई आधारित स्क्रीनिंग रिजल्ट है और इसे निश्चित मेडिकल डायग्नोसिस नहीं माना जाना चाहिए।`,

                `कृपया इस रिपोर्ट को किसी योग्य डॉक्टर या मेडिकल प्रोफेशनल से जरूर दिखाएं ताकि उचित क्लिनिकल जांच और आगे की जांच की जा सके।`,

                `अपने सामान्य स्वास्थ्य के लिए संतुलित और पौष्टिक भोजन लें, जिसमें सब्जियां, फल, साबुत अनाज और पर्याप्त पानी शामिल हो।`,

                `बहुत ज्यादा प्रोसेस्ड और पोषण की दृष्टि से कम उपयोगी भोजन से बचने की कोशिश करें।`,

                `नियमित और पर्याप्त नींद लें तथा शरीर को पर्याप्त आराम दें।`,

                `हल्की शारीरिक गतिविधि अपनी स्थिति के अनुसार की जा सकती है, लेकिन ज्यादा मेहनत वाली एक्सरसाइज डॉक्टर की सलाह के अनुसार ही करें।`,

                `सबसे जरूरी बात यह है कि अपने डॉक्टर द्वारा दिए गए उपचार और सलाह का पालन करें।`,

                `अगर कोई गंभीर या लगातार बढ़ने वाले लक्षण दिखाई दें तो उचित मेडिकल सहायता लें।`,

                `आरोग्य दृष्टि का उपयोग करने के लिए धन्यवाद। अपना ध्यान रखें और आगे की प्रक्रिया के लिए डॉक्टर से परामर्श जरूर करें।`

            ];

        }


        return [

            `नमस्ते। मैं आरोग्य दृष्टि का डॉक्टर वॉइस हूँ।`,

            `आपकी ब्रेन एम आर आई इमेज का हमारे आर्टिफिशियल इंटेलिजेंस सिस्टम द्वारा विश्लेषण किया गया है।`,

            `ए आई मॉडल के अनुसार इस इमेज में नॉन ट्यूमरस क्लास की संभावना दिखाई गई है और मॉडल का कॉन्फिडेंस ${confidenceText} है।`,

            `ध्यान रखें कि यह रिजल्ट बीमारी की पूर्ण अनुपस्थिति की गारंटी नहीं देता और इसे प्रोफेशनल मेडिकल जांच का विकल्प नहीं माना जाना चाहिए।`,

            `अपने स्वास्थ्य को बेहतर बनाए रखने के लिए संतुलित भोजन लें, जिसमें सब्जियां, फल, साबुत अनाज और पौष्टिक खाद्य पदार्थ शामिल हों।`,

            `पर्याप्त पानी पिएं और बहुत ज्यादा प्रोसेस्ड भोजन का सेवन कम करें।`,

            `नियमित शारीरिक गतिविधि, पर्याप्त नींद और तनाव को नियंत्रित रखना आपके सामान्य स्वास्थ्य के लिए उपयोगी हो सकता है।`,

            `नियमित स्वास्थ्य जांच जारी रखें और अगर कोई लगातार या चिंताजनक लक्षण दिखाई दें तो योग्य डॉक्टर से सलाह लें।`,

            `आरोग्य दृष्टि का उपयोग करने के लिए धन्यवाद। स्वस्थ रहें और अपना ध्यान रखें।`

        ];

    }


    /* =====================================================
       GET AVAILABLE VOICE
    ===================================================== */

    function getBestVoice(
        language
    ) {

        if (!supportsSpeech) {
            return null;
        }


        const voices =
            window.speechSynthesis
                .getVoices();


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

            const exact =
                voices.find(
                    voice =>
                        voice.lang
                            ?.toLowerCase()
                            .startsWith(
                                preferred.toLowerCase()
                            )
                );


            if (exact) {

                return exact;

            }

        }


        return voices[0];

    }


    /* =====================================================
       SPEAK CURRENT SENTENCE
    ===================================================== */

    function speakNext() {

        if (!supportsSpeech) {

            setVoiceStatus(
                "Speech is not supported in this browser."
            );


            showToast(
                "Voice unavailable",
                "Your browser does not support speech synthesis.",
                "error"
            );


            return;

        }


        if (
            speechCancelled ||
            currentSpeechIndex >=
            speechQueue.length
        ) {

            finishSpeaking();

            return;

        }


        const text =
            speechQueue[
                currentSpeechIndex
            ];


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        const voice =
            getBestVoice(
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
                ? 0.88
                : 0.92;


        utterance.pitch =
            1;


        utterance.volume =
            1;


        utterance.onstart =
            () => {

                isSpeaking =
                    true;


                setVoiceStatus(
                    selectedLanguage === "hi"
                        ? "हिंदी में रिपोर्ट समझाई जा रही है..."
                        : "Explaining your report...",
                    true
                );


                updateVoiceButton(
                    true
                );

            };


        utterance.onend =
            async () => {

                if (
                    speechCancelled
                ) {

                    return;

                }


                currentSpeechIndex++;


                await sleep(
                    120
                );


                speakNext();

            };


        utterance.onerror =
            (event) => {

                if (
                    event.error ===
                    "canceled"
                ) {

                    return;

                }


                console.error(
                    "Speech synthesis error:",
                    event
                );


                finishSpeaking();


                showToast(
                    "Voice Error",
                    "Unable to continue voice playback.",
                    "error"
                );

            };


        window.speechSynthesis
            .speak(
                utterance
            );

    }


    /* =====================================================
       START SPEAKING
    ===================================================== */

    function startSpeaking() {

        if (!supportsSpeech) {

            showToast(
                "Browser not supported",
                "Please use a modern browser such as Chrome or Edge.",
                "error"
            );

            return;

        }


        window.speechSynthesis.cancel();


        speechCancelled =
            false;


        currentSpeechIndex =
            0;


        speechQueue =
            selectedLanguage === "hi"
                ? getHindiSpeech()
                : getEnglishSpeech();


        if (!speechQueue.length) {

            return;

        }


        setVoiceStatus(
            selectedLanguage === "hi"
                ? "हिंदी रिपोर्ट तैयार की जा रही है..."
                : "Preparing your report...",
            true
        );


        updateVoiceButton(
            true
        );


        speakNext();

    }


    /* =====================================================
       STOP SPEAKING
    ===================================================== */

    function stopSpeaking() {

        speechCancelled =
            true;


        if (
            supportsSpeech
        ) {

            window.speechSynthesis.cancel();

        }


        isSpeaking =
            false;


        speechQueue =
            [];


        currentSpeechIndex =
            0;


        updateVoiceButton(
            false
        );


        setVoiceStatus(
            "Ready to speak",
            false
        );

    }


    /* =====================================================
       FINISH SPEAKING
    ===================================================== */

    function finishSpeaking() {

        isSpeaking =
            false;


        speechCancelled =
            false;


        updateVoiceButton(
            false
        );


        setVoiceStatus(
            selectedLanguage === "hi"
                ? "हिंदी रिपोर्ट पूरी हो गई।"
                : "Report explanation completed.",
            false
        );


        showToast(
            "Voice Report Complete",
            selectedLanguage === "hi"
                ? "रिपोर्ट की हिंदी व्याख्या पूरी हो गई।"
                : "The report explanation has finished.",
            "success"
        );

    }


    /* =====================================================
       LANGUAGE SELECTION
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


        selectedLanguage =
            language;


        if (voiceEnglish) {

            voiceEnglish.classList.toggle(
                "active",
                language === "en"
            );

        }


        if (voiceHindi) {

            voiceHindi.classList.toggle(
                "active",
                language === "hi"
            );

        }


        if (isSpeaking) {

            stopSpeaking();

        }


        setVoiceStatus(
            language === "hi"
                ? "हिंदी में बोलने के लिए तैयार"
                : "Ready to speak in English",
            false
        );

    }


    if (voiceEnglish) {

        voiceEnglish.addEventListener(
            "click",
            () => {

                selectLanguage(
                    "en"
                );

            }
        );

    }


    if (voiceHindi) {

        voiceHindi.addEventListener(
            "click",
            () => {

                selectLanguage(
                    "hi"
                );

            }
        );

    }


    /* =====================================================
       PLAY BUTTON
    ===================================================== */

    if (voicePlayBtn) {

        voicePlayBtn.addEventListener(
            "click",
            () => {

                if (isSpeaking) {

                    stopSpeaking();

                } else {

                    startSpeaking();

                }

            }
        );

    }


    /* =====================================================
       STOP BUTTON
    ===================================================== */

    if (voiceStopBtn) {

        voiceStopBtn.addEventListener(
            "click",
            () => {

                stopSpeaking();

            }
        );

    }


    /* =====================================================
       LOAD VOICES
    ===================================================== */

    if (
        supportsSpeech &&
        window.speechSynthesis
    ) {

        window.speechSynthesis
            .getVoices();


        window.speechSynthesis
            .onvoiceschanged =
            () => {

                window.speechSynthesis
                    .getVoices();

            };

    }


    /* =====================================================
       STOP SPEECH WHEN PAGE IS LEFT
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (
                supportsSpeech
            ) {

                window.speechSynthesis
                    .cancel();

            }

        }
    );


    /* =====================================================
       REPORT GENERATION
    ===================================================== */

    async function generateReport() {

        if (!downloadReportBtn) {
            return;
        }


        const originalHTML =
            downloadReportBtn.innerHTML;


        downloadReportBtn.disabled =
            true;


        downloadReportBtn.innerHTML = `

            <div class="report-button-loader"></div>

            <div>

                <strong>
                    Preparing Report...
                </strong>

                <span>
                    Please wait
                </span>

            </div>

        `;


        try {

            showToast(
                "Preparing Report",
                "Your professional report is being prepared...",
                "info",
                5000
            );


            await sleep(
                700
            );


            /*
             * If a Flask PDF endpoint is added later,
             * this is where we can connect it.
             *
             * Example:
             *
             * const response =
             *     await fetch("/generate-report", {
             *         method: "POST"
             *     });
             */


            window.print();


            showToast(
                "Report Ready",
                "Use 'Save as PDF' in the print dialog to save your report.",
                "success",
                5000
            );


        } catch (error) {

            console.error(
                "Report generation error:",
                error
            );


            showToast(
                "Report Error",
                "Unable to prepare the report.",
                "error"
            );

        } finally {

            downloadReportBtn.disabled =
                false;


            downloadReportBtn.innerHTML =
                originalHTML;

        }

    }


    if (downloadReportBtn) {

        downloadReportBtn.addEventListener(
            "click",
            generateReport
        );

    }


    /* =====================================================
       PRINT REPORT
    ===================================================== */

    function printReport() {

        showToast(
            "Opening Print",
            "Preparing your report for printing...",
            "info"
        );


        setTimeout(
            () => {

                window.print();

            },
            400
        );

    }


    if (printReportBtn) {

        printReportBtn.addEventListener(
            "click",
            printReport
        );

    }


    /* =====================================================
       PRINT EVENTS
    ===================================================== */

    window.addEventListener(
        "beforeprint",
        () => {

            stopSpeaking();

            document.body.classList.add(
                "printing-report"
            );

        }
    );


    window.addEventListener(
        "afterprint",
        () => {

            document.body.classList.remove(
                "printing-report"
            );

        }
    );


    /* =====================================================
       MRI IMAGE
    ===================================================== */

    const mriImage =
        document.getElementById(
            "mriReportImage"
        );


    if (mriImage) {

        mriImage.addEventListener(
            "load",
            () => {

                mriImage.classList.add(
                    "image-loaded"
                );

            }
        );


        mriImage.addEventListener(
            "error",
            () => {

                console.warn(
                    "MRI image could not be loaded."
                );


                showToast(
                    "Image Error",
                    "The uploaded MRI image could not be displayed.",
                    "error"
                );

            }
        );

    }


    /* =====================================================
       RESULT SECURITY / UI
    ===================================================== */

    function updateResultUI() {

        const resultCard =
            document.querySelector(
                ".result-card"
            );


        if (!resultCard) return;


        resultCard.classList.remove(
            "result-positive",
            "result-negative"
        );


        if (isTumorous()) {

            resultCard.classList.add(
                "result-positive"
            );

        } else {

            resultCard.classList.add(
                "result-negative"
            );

        }

    }


    updateResultUI();


    /* =====================================================
       KEYBOARD SHORTCUTS
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Space = play/stop voice
             */

            if (
                event.code === "Space" &&
                !["INPUT", "TEXTAREA", "BUTTON"]
                    .includes(
                        document.activeElement?.tagName
                    )
            ) {

                event.preventDefault();


                if (isSpeaking) {

                    stopSpeaking();

                } else {

                    startSpeaking();

                }

            }


            /*
             * Escape = stop voice
             */

            if (
                event.key === "Escape"
            ) {

                stopSpeaking();

            }

        }
    );


    /* =====================================================
       REPORT VISIBILITY ANIMATION
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".report-card, .recommendation-card, .action-card"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const animationObserver =
            new IntersectionObserver(
                (
                    entries,
                    observer
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "report-visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -30px 0px"
                }
            );


        animatedElements.forEach(
            element => {

                animationObserver.observe(
                    element
                );

            }
        );

    } else {

        animatedElements.forEach(
            element => {

                element.classList.add(
                    "report-visible"
                );

            }
        );

    }


    /* =====================================================
       DYNAMIC REPORT DATE / TIME
    ===================================================== */

    function updateReportDateTime() {

        const dateElement =
            document.getElementById(
                "reportDate"
            );


        const timeElement =
            document.getElementById(
                "reportTime"
            );


        const now =
            new Date();


        if (
            dateElement &&
            (
                !reportData.reportDate ||
                reportData.reportDate ===
                "Today"
            )
        ) {

            dateElement.textContent =
                now.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        if (
            timeElement &&
            (
                !reportData.reportTime ||
                reportData.reportTime ===
                "--:--"
            )
        ) {

            timeElement.textContent =
                now.toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }

    }


    updateReportDateTime();


    /* =====================================================
       REPORT ID GENERATOR
    ===================================================== */

    const reportIDElement =
        document.querySelector(
            ".report-id"
        );


    if (
        reportIDElement &&
        (
            !reportData.reportId ||
            reportData.reportId ===
            "AD-000001"
        )
    ) {

        const timestamp =
            Date.now()
                .toString()
                .slice(-8);


        reportIDElement.textContent =
            `AD-${timestamp}`;

    }


    /* =====================================================
       ACCESSIBILITY
    ===================================================== */

    if (voicePlayBtn) {

        voicePlayBtn.setAttribute(
            "aria-label",
            "Play or stop AI voice explanation"
        );

    }


    if (voiceStopBtn) {

        voiceStopBtn.setAttribute(
            "aria-label",
            "Stop AI voice explanation"
        );

    }


    if (voiceEnglish) {

        voiceEnglish.setAttribute(
            "aria-label",
            "Select English voice"
        );

    }


    if (voiceHindi) {

        voiceHindi.setAttribute(
            "aria-label",
            "Select Hindi voice"
        );

    }


    /* =====================================================
       INITIAL STATUS
    ===================================================== */

    setVoiceStatus(
        "Ready to speak",
        false
    );


    updateVoiceButton(
        false
    );


    /* =====================================================
       GLOBAL REPORT OBJECT
    ===================================================== */

    window.AarogyaReport = {

        getPrediction:
            () => getPredictionLabel(),

        getConfidence:
            () => confidence,

        getLanguage:
            () => selectedLanguage,

        startVoice:
            startSpeaking,

        stopVoice:
            stopSpeaking,

        generate:
            generateReport,

        print:
            printReport

    };


    /* =====================================================
       READY MESSAGE
    ===================================================== */

    console.log(
        "%cAarogyaDrishti Report",
        "font-size:20px;font-weight:800;color:#18d89b;"
    );


    console.log(
        "%cPrediction:",
        "font-weight:700;color:#25d9f3;",
        getPredictionLabel()
    );


    console.log(
        "%cConfidence:",
        "font-weight:700;color:#25d9f3;",
        `${confidence.toFixed(2)}%`
    );


});