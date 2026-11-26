/* =========================================================
   AAROGYADRISHTI
   HISTORY PAGE JAVASCRIPT
   Premium Medical AI Screening Timeline
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const navbar =
        document.getElementById("navbar");

    const themeToggle =
        document.getElementById("themeToggle");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.querySelector(".nav-links");

    const historySearch =
        document.getElementById("historySearch");

    const filterButton =
        document.getElementById("filterButton");

    const filterMenu =
        document.getElementById("filterMenu");

    const filterOptions =
        document.querySelectorAll(
            ".filter-option"
        );

    const historyTimeline =
        document.getElementById(
            "historyTimeline"
        );

    const historyEmpty =
        document.getElementById(
            "historyEmpty"
        );

    const clearHistorySearch =
        document.getElementById(
            "clearHistorySearch"
        );

    const totalScans =
        document.getElementById(
            "totalScans"
        );

    const tumorousCount =
        document.getElementById(
            "tumorousCount"
        );

    const nonTumorousCount =
        document.getElementById(
            "nonTumorousCount"
        );

    const latestScan =
        document.getElementById(
            "latestScan"
        );

    const imageModal =
        document.getElementById(
            "imageModal"
        );

    const modalImage =
        document.getElementById(
            "modalImage"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalBackdrop =
        document.querySelector(
            ".modal-backdrop"
        );


    /* =====================================================
       STATE
    ===================================================== */

    let activeFilter =
        "all";

    let searchTerm =
        "";

    let currentModalImage =
        null;


    /* =====================================================
       HELPERS
    ===================================================== */

    function getRecords() {

        return Array.from(
            document.querySelectorAll(
                ".history-record"
            )
        );

    }


    function normalizeText(
        value
    ) {

        return String(
            value || ""
        )
            .trim()
            .toLowerCase();

    }


    function showToast(
        title,
        message,
        type = "info"
    ) {

        const toast =
            document.getElementById(
                "reportToast"
            );

        if (!toast) {

            console.log(
                `${title}: ${message}`
            );

            return;

        }


        const toastTitle =
            document.getElementById(
                "toastTitle"
            );

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if (toastTitle) {

            toastTitle.textContent =
                title;

        }


        if (toastMessage) {

            toastMessage.textContent =
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
            3200
        );

    }


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    function handleNavbarScroll() {

        if (!navbar) {

            return;

        }


        if (
            window.scrollY > 25
        ) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        handleNavbarScroll,
        {
            passive: true
        }
    );


    handleNavbarScroll();


    /* =====================================================
       THEME SYSTEM
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "aarogya-theme"
        );


    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light-theme"
        );

    }


    function updateThemeIcon() {

        if (!themeToggle) {

            return;

        }


        const sun =
            themeToggle.querySelector(
                ".fa-sun"
            );

        const moon =
            themeToggle.querySelector(
                ".fa-moon"
            );


        const light =
            document.body.classList.contains(
                "light-theme"
            );


        if (sun) {

            sun.style.display =
                light
                    ? "block"
                    : "none";

        }


        if (moon) {

            moon.style.display =
                light
                    ? "none"
                    : "block";

        }

    }


    updateThemeIcon();


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-theme"
                );


                const theme =
                    document.body.classList.contains(
                        "light-theme"
                    )
                        ? "light"
                        : "dark";


                localStorage.setItem(
                    "aarogya-theme",
                    theme
                );


                updateThemeIcon();

            }
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (
        mobileMenuBtn &&
        navLinks
    ) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "mobile-open"
                );


                const icon =
                    mobileMenuBtn.querySelector(
                        "i"
                    );


                if (
                    navLinks.classList.contains(
                        "mobile-open"
                    )
                ) {

                    if (icon) {

                        icon.className =
                            "fa-solid fa-xmark";

                    }

                } else {

                    if (icon) {

                        icon.className =
                            "fa-solid fa-bars";

                    }

                }

            }
        );


        navLinks
            .querySelectorAll("a")
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        () => {

                            navLinks.classList.remove(
                                "mobile-open"
                            );


                            const icon =
                                mobileMenuBtn.querySelector(
                                    "i"
                                );


                            if (icon) {

                                icon.className =
                                    "fa-solid fa-bars";

                            }

                        }
                    );

                }
            );

    }


    /* =====================================================
       FILTER DROPDOWN
    ===================================================== */

    if (filterButton) {

        filterButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (filterMenu) {

                    filterMenu.classList.toggle(
                        "show"
                    );

                }

            }
        );

    }


    document.addEventListener(
        "click",
        event => {

            if (
                filterMenu &&
                filterButton &&
                !filterMenu.contains(
                    event.target
                ) &&
                !filterButton.contains(
                    event.target
                )
            ) {

                filterMenu.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       FILTER SELECTION
    ===================================================== */

    filterOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    activeFilter =
                        option.dataset.filter ||
                        "all";


                    filterOptions.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    if (filterMenu) {

                        filterMenu.classList.remove(
                            "show"
                        );

                    }


                    applyFilters();


                    const label =
                        option.textContent
                            .trim();


                    showToast(
                        "Filter Applied",
                        `${label} records are now displayed.`,
                        "info"
                    );

                }
            );

        }
    );


    /* =====================================================
       SEARCH
    ===================================================== */

    if (historySearch) {

        historySearch.addEventListener(
            "input",
            event => {

                searchTerm =
                    normalizeText(
                        event.target.value
                    );


                applyFilters();

            }
        );

    }


    /* =====================================================
       FILTER LOGIC
    ===================================================== */

    function recordMatchesSearch(
        record
    ) {

        if (!searchTerm) {

            return true;

        }


        const searchableText =
            normalizeText(
                record.textContent
            );


        return searchableText
            .includes(
                searchTerm
            );

    }


    function recordMatchesFilter(
        record
    ) {

        if (
            activeFilter ===
            "all"
        ) {

            return true;

        }


        const result =
            normalizeText(
                record.dataset.result
            );


        return (
            result ===
            activeFilter
        );

    }


    function applyFilters() {

        const records =
            getRecords();


        let visibleCount =
            0;


        records.forEach(
            record => {

                const matchesSearch =
                    recordMatchesSearch(
                        record
                    );


                const matchesFilter =
                    recordMatchesFilter(
                        record
                    );


                const visible =
                    matchesSearch &&
                    matchesFilter;


                if (visible) {

                    visibleCount++;


                    record.classList.remove(
                        "record-hidden"
                    );


                    record.style.display =
                        "";


                    requestAnimationFrame(
                        () => {

                            record.classList.add(
                                "record-visible"
                            );

                        }
                    );

                } else {

                    record.classList.remove(
                        "record-visible"
                    );


                    record.classList.add(
                        "record-hidden"
                    );


                    setTimeout(
                        () => {

                            if (
                                record.classList.contains(
                                    "record-hidden"
                                )
                            ) {

                                record.style.display =
                                    "none";

                            }

                        },
                        250
                    );

                }

            }
        );


        updateEmptyState(
            visibleCount === 0
        );

    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    function updateEmptyState(
        show
    ) {

        if (!historyEmpty) {

            return;

        }


        historyEmpty.hidden =
            !show;


        historyEmpty.classList.toggle(
            "show",
            show
        );

    }


    if (clearHistorySearch) {

        clearHistorySearch.addEventListener(
            "click",
            () => {

                if (historySearch) {

                    historySearch.value =
                        "";

                }


                searchTerm =
                    "";


                activeFilter =
                    "all";


                filterOptions.forEach(
                    option => {

                        option.classList.toggle(
                            "active",
                            option.dataset.filter ===
                            "all"
                        );

                    }
                );


                applyFilters();


                showToast(
                    "Search Cleared",
                    "All screening records are visible again.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       SUMMARY STATISTICS
    ===================================================== */

    function updateSummary() {

        const records =
            getRecords();


        const total =
            records.length;


        let tumorous =
            0;


        let nonTumorous =
            0;


        records.forEach(
            record => {

                const result =
                    normalizeText(
                        record.dataset.result
                    );


                if (
                    result ===
                    "tumorous"
                ) {

                    tumorous++;

                }


                if (
                    result ===
                    "non-tumorous"
                ) {

                    nonTumorous++;

                }

            }
        );


        if (totalScans) {

            totalScans.textContent =
                String(
                    total
                ).padStart(
                    2,
                    "0"
                );

        }


        if (tumorousCount) {

            tumorousCount.textContent =
                String(
                    tumorous
                ).padStart(
                    2,
                    "0"
                );

        }


        if (nonTumorousCount) {

            nonTumorousCount.textContent =
                String(
                    nonTumorous
                ).padStart(
                    2,
                    "0"
                );

        }


        updateLatestScan(
            records
        );

    }


    /* =====================================================
       LATEST SCAN
    ===================================================== */

    function updateLatestScan(
        records
    ) {

        if (
            !latestScan ||
            !records.length
        ) {

            return;

        }


        const dates =
            records
                .map(
                    record =>
                        record.dataset.date
                )
                .filter(Boolean)
                .sort(
                    (a, b) =>
                        new Date(b) -
                        new Date(a)
                );


        if (!dates.length) {

            return;

        }


        const latestDate =
            new Date(
                dates[0]
            );


        const today =
            new Date();


        const sameDay =
            latestDate.toDateString() ===
            today.toDateString();


        if (sameDay) {

            latestScan.textContent =
                "TODAY";

            return;

        }


        const diff =
            Math.floor(
                (
                    today -
                    latestDate
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (
            diff === 1
        ) {

            latestScan.textContent =
                "1 DAY AGO";

        } else {

            latestScan.textContent =
                `${diff} DAYS AGO`;

        }

    }


    updateSummary();


    /* =====================================================
       IMAGE PREVIEW MODAL
    ===================================================== */

    function openImageModal(
        imageSource,
        altText = "MRI Scan"
    ) {

        if (
            !imageModal ||
            !modalImage
        ) {

            return;

        }


        currentModalImage =
            imageSource;


        modalImage.src =
            imageSource;


        modalImage.alt =
            altText;


        imageModal.classList.add(
            "show"
        );


        imageModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );


        requestAnimationFrame(
            () => {

                imageModal.classList.add(
                    "visible"
                );

            }
        );

    }


    function closeImageModal() {

        if (!imageModal) {

            return;

        }


        imageModal.classList.remove(
            "visible"
        );


        setTimeout(
            () => {

                imageModal.classList.remove(
                    "show"
                );


                imageModal.setAttribute(
                    "aria-hidden",
                    "true"
                );


                if (modalImage) {

                    modalImage.src =
                        "";

                }


                currentModalImage =
                    null;


                document.body.classList.remove(
                    "modal-open"
                );

            },
            250
        );

    }


    /* =====================================================
       IMAGE CLICK EVENTS
    ===================================================== */

    function bindImagePreview() {

        const imageWrappers =
            document.querySelectorAll(
                ".scan-image-wrapper"
            );


        imageWrappers.forEach(
            wrapper => {

                if (
                    wrapper.dataset.bound ===
                    "true"
                ) {

                    return;

                }


                wrapper.dataset.bound =
                    "true";


                wrapper.addEventListener(
                    "click",
                    () => {

                        const image =
                            wrapper.querySelector(
                                ".scan-image"
                            );


                        if (!image) {

                            return;

                        }


                        openImageModal(
                            image.src,
                            image.alt
                        );

                    }
                );

            }
        );

    }


    bindImagePreview();


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeImageModal
        );

    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeImageModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape" &&
                imageModal?.classList.contains(
                    "show"
                )
            ) {

                closeImageModal();

            }

        }
    );


    /* =====================================================
       RECORD DELETE
    ===================================================== */

    function deleteRecord(
        record
    ) {

        if (!record) {

            return;

        }


        const title =
            record.querySelector(
                ".record-details h3"
            )?.textContent
                ?.trim() ||
            "this screening";


        const confirmed =
            window.confirm(
                `Delete "${title}" from your screening history?`
            );


        if (!confirmed) {

            return;

        }


        record.classList.add(
            "record-deleting"
        );


        setTimeout(
            () => {

                record.remove();


                updateSummary();

                applyFilters();


                showToast(
                    "Record Deleted",
                    "The screening record has been removed from this view.",
                    "success"
                );

            },
            450
        );

    }


    /* =====================================================
       RECORD ACTIONS
    ===================================================== */

    function bindRecordActions() {

        const records =
            getRecords();


        records.forEach(
            record => {

                /* -----------------------------------------
                   DELETE
                ------------------------------------------ */

                const deleteButton =
                    record.querySelector(
                        ".record-action.danger"
                    );


                if (
                    deleteButton &&
                    deleteButton.dataset.bound !==
                    "true"
                ) {

                    deleteButton.dataset.bound =
                        "true";


                    deleteButton.addEventListener(
                        "click",
                        () => {

                            deleteRecord(
                                record
                            );

                        }
                    );

                }


                /* -----------------------------------------
                   DR VOICE
                ------------------------------------------ */

                const voiceButton =
                    Array.from(
                        record.querySelectorAll(
                            ".record-action"
                        )
                    )
                    .find(
                        button =>
                            normalizeText(
                                button.textContent
                            )
                            .includes(
                                "dr. voice"
                            )
                    );


                if (
                    voiceButton &&
                    voiceButton.dataset.bound !==
                    "true"
                ) {

                    voiceButton.dataset.bound =
                        "true";


                    voiceButton.addEventListener(
                        "click",
                        () => {

                            showToast(
                                "Dr. Voice",
                                "Open the complete report to use the AI voice explanation.",
                                "info"
                            );

                        }
                    );

                }


                /* -----------------------------------------
                   VIEW REPORT
                ------------------------------------------ */

                const reportButton =
                    record.querySelector(
                        ".record-action.primary"
                    );


                if (
                    reportButton &&
                    reportButton.dataset.bound !==
                    "true"
                ) {

                    reportButton.dataset.bound =
                        "true";


                    reportButton.addEventListener(
                        "click",
                        event => {

                            /*
                             * Currently frontend-only.
                             * Flask report route will be
                             * connected here later.
                             */

                            const href =
                                reportButton.getAttribute(
                                    "href"
                                );


                            if (
                                !href ||
                                href === "#"
                            ) {

                                event.preventDefault();


                                showToast(
                                    "Report",
                                    "Report details will open here after Flask integration.",
                                    "info"
                                );

                            }

                        }
                    );

                }

            }
        );

    }


    bindRecordActions();


    /* =====================================================
       RECORD HOVER EFFECT
    ===================================================== */

    function addRecordHoverEffect() {

        const records =
            getRecords();


        records.forEach(
            record => {

                const card =
                    record.querySelector(
                        ".record-card"
                    );


                if (!card) {

                    return;

                }


                card.addEventListener(
                    "mousemove",
                    event => {

                        if (
                            window.innerWidth <
                            900
                        ) {

                            return;

                        }


                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width;


                        const y =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height;


                        const rotateX =
                            (
                                0.5 -
                                y
                            ) * 2;


                        const rotateY =
                            (
                                x -
                                0.5
                            ) * 2;


                        card.style.transform =
                            `
                            perspective(1000px)
                            rotateX(${rotateX}deg)
                            rotateY(${rotateY}deg)
                            translateY(-3px)
                            `;

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                    }
                );

            }
        );

    }


    addRecordHoverEffect();


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    function setupScrollReveal() {

        const elements =
            document.querySelectorAll(
                ".summary-card, .history-record, .history-info-card"
            );


        if (
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                element => {

                    element.classList.add(
                        "history-visible"
                    );

                }
            );


            return;

        }


        const observer =
            new IntersectionObserver(
                (
                    entries,
                    observerInstance
                ) => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "history-visible"
                                );


                                observerInstance.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        elements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    }


    setupScrollReveal();


    /* =====================================================
       STAT NUMBER ANIMATION
    ===================================================== */

    function animateNumber(
        element
    ) {

        if (!element) {

            return;

        }


        const target =
            parseInt(
                element.textContent
                    .replace(
                        /\D/g,
                        ""
                    ),
                10
            );


        if (
            Number.isNaN(target)
        ) {

            return;

        }


        const duration =
            900;


        const startTime =
            performance.now();


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
                Math.round(
                    target *
                    eased
                );


            element.textContent =
                String(
                    current
                ).padStart(
                    2,
                    "0"
                );


            if (
                progress <
                1
            ) {

                requestAnimationFrame(
                    update
                );

            }

        }


        requestAnimationFrame(
            update
        );

    }


    setTimeout(
        () => {

            animateNumber(
                totalScans
            );

            animateNumber(
                tumorousCount
            );

            animateNumber(
                nonTumorousCount
            );

        },
        400
    );


    /* =====================================================
       RECORD COUNT BADGE
    ===================================================== */

    function updateVisibleCount() {

        const visibleRecords =
            getRecords()
                .filter(
                    record =>
                        record.style.display !==
                        "none"
                );


        const toolbarTitle =
            document.querySelector(
                ".toolbar-title span"
            );


        if (!toolbarTitle) {

            return;

        }


        toolbarTitle.textContent =
            `SCREENING RECORDS • ${visibleRecords.length}`;

    }


    /* =====================================================
       RUN FILTER + COUNT
    ===================================================== */

    const originalApplyFilters =
        applyFilters;


    /*
     * Small wrapper to keep the
     * visible counter updated.
     */

    function refreshHistoryUI() {

        originalApplyFilters();

        setTimeout(
            updateVisibleCount,
            300
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    refreshHistoryUI();


    /* =====================================================
       PUBLIC HISTORY API
       Future Flask / Database Integration
    ===================================================== */

    window.AarogyaHistory = {

        getRecords:
            getRecords,

        applyFilters:
            applyFilters,

        refresh:
            refreshHistoryUI,

        getActiveFilter:
            () => activeFilter,

        getSearch:
            () => searchTerm,

        updateSummary:
            updateSummary,

        openImage:
            openImageModal,

        closeImage:
            closeImageModal

    };


    /* =====================================================
       FUTURE DATABASE HOOK
    ===================================================== */

    /*
     * Later Flask can return:
     *
     * [
     *     {
     *         id: 1,
     *         date: "09 August 2026",
     *         time: "10:42 AM",
     *         prediction: "tumorous",
     *         confidence: 91.4,
     *         image: "/uploads/scan.jpg",
     *         report: "/report/1"
     *     }
     * ]
     *
     * Then this function can render
     * records dynamically.
     */

    window.AarogyaHistory.loadFromDatabase =
        function (records) {

            console.info(
                "Database history hook received:",
                records
            );

            /*
             * Database rendering will be
             * implemented after backend
             * integration.
             */

        };


    /* =====================================================
       READY
    ===================================================== */

    console.log(
        "%cAarogyaDrishti History",
        "font-size:20px;font-weight:800;color:#18d89b;"
    );


    console.log(
        "%cHistory system initialized successfully.",
        "color:#25d9f3;font-weight:600;"
    );

});