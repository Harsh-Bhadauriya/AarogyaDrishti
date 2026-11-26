document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const pageLoader = document.getElementById("pageLoader");

    const navbar = document.getElementById("navbar");

    const themeToggle = document.getElementById("themeToggle");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");

    const mobileNav = document.getElementById("mobileNav");

    const predictionForm = document.getElementById("predictionForm");

    const mriImage = document.getElementById("mriImage");

    const uploadZone = document.getElementById("uploadZone");

    const browseBtn = document.getElementById("browseBtn");

    const uploadDefault = document.getElementById("uploadDefault");

    const uploadPreview = document.getElementById("uploadPreview");

    const previewImage = document.getElementById("previewImage");

    const previewFileName = document.getElementById("previewFileName");

    const previewFileSize = document.getElementById("previewFileSize");

    const removeImage = document.getElementById("removeImage");

    const analyzeBtn = document.getElementById("analyzeBtn");

    const toast = document.getElementById("predictToast");

    const toastTitle = document.getElementById("toastTitle");

    const toastMessage = document.getElementById("toastMessage");

    const toastClose = document.getElementById("toastClose");

    const aiCoreCard = document.querySelector(".ai-core-card");


    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const ALLOWED_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    let selectedFile = null;

    let toastTimer = null;


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (pageLoader) {
                pageLoader.classList.add("hidden");
            }

        }, 450);

    });


    /* =====================================================
       NAVBAR SCROLL
    ===================================================== */

    function handleNavbarScroll() {

        if (!navbar) return;

        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        handleNavbarScroll,
        { passive: true }
    );

    handleNavbarScroll();


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenuBtn && mobileNav) {

        mobileMenuBtn.addEventListener("click", () => {

            mobileNav.classList.toggle("open");

        });


        const mobileLinks =
            mobileNav.querySelectorAll(".mobile-nav-link");

        mobileLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mobileNav.classList.remove("open");

            });

        });


        document.addEventListener("click", (event) => {

            const clickedInsideMenu =
                mobileNav.contains(event.target);

            const clickedButton =
                mobileMenuBtn.contains(event.target);

            if (
                !clickedInsideMenu &&
                !clickedButton
            ) {

                mobileNav.classList.remove("open");

            }

        });

    }


    /* =====================================================
       THEME SYSTEM
    ===================================================== */

    function applyTheme(theme) {

        if (theme === "light") {

            document.body.classList.add("light-theme");

        } else {

            document.body.classList.remove("light-theme");

        }

    }


    function getSavedTheme() {

        const savedTheme =
            localStorage.getItem("aarogyadrishti-theme");

        if (savedTheme === "light" || savedTheme === "dark") {

            return savedTheme;

        }


        if (
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: light)"
            ).matches
        ) {

            return "light";

        }

        return "dark";

    }


    let currentTheme = getSavedTheme();

    applyTheme(currentTheme);


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            currentTheme =
                document.body.classList.contains("light-theme")
                    ? "dark"
                    : "light";


            applyTheme(currentTheme);

            localStorage.setItem(
                "aarogyadrishti-theme",
                currentTheme
            );

        });

    }


    /* =====================================================
       TOAST SYSTEM
    ===================================================== */

    function showToast(
        title,
        message,
        type = "warning"
    ) {

        if (
            !toast ||
            !toastTitle ||
            !toastMessage
        ) {
            return;
        }


        toastTitle.textContent = title;

        toastMessage.textContent = message;


        toast.classList.remove(
            "toast-success",
            "toast-error",
            "toast-warning"
        );


        toast.classList.add(
            `toast-${type}`
        );


        toast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 4500);

    }


    if (toastClose) {

        toastClose.addEventListener("click", () => {

            toast.classList.remove("show");

            clearTimeout(toastTimer);

        });

    }


    /* =====================================================
       FORMAT FILE SIZE
    ===================================================== */

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 KB";
        }


        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];


        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );


        const size =
            bytes /
            Math.pow(1024, index);


        return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;

    }


    /* =====================================================
       VALIDATE FILE
    ===================================================== */

    function validateFile(file) {

        if (!file) {

            showToast(
                "No image selected",
                "Please select a brain MRI image.",
                "warning"
            );

            return false;

        }


        if (!ALLOWED_TYPES.includes(file.type)) {

            showToast(
                "Unsupported format",
                "Please upload JPG, JPEG, PNG or WEBP.",
                "error"
            );

            return false;

        }


        if (file.size > MAX_FILE_SIZE) {

            showToast(
                "File too large",
                "Maximum allowed image size is 10 MB.",
                "error"
            );

            return false;

        }


        if (file.size === 0) {

            showToast(
                "Invalid image",
                "The selected file appears to be empty.",
                "error"
            );

            return false;

        }


        return true;

    }


    /* =====================================================
       IMAGE PREVIEW
    ===================================================== */

    function showImagePreview(file) {

        if (!validateFile(file)) {

            resetUpload();

            return;

        }


        selectedFile = file;


        const reader = new FileReader();


        reader.onload = (event) => {

            if (previewImage) {

                previewImage.src =
                    event.target.result;

            }


            if (previewFileName) {

                previewFileName.textContent =
                    file.name;

            }


            if (previewFileSize) {

                previewFileSize.textContent =
                    formatFileSize(file.size);

            }


            if (uploadDefault) {

                uploadDefault.style.display =
                    "none";

            }


            if (uploadPreview) {

                uploadPreview.classList.add(
                    "active"
                );

            }


            if (uploadZone) {

                uploadZone.classList.add(
                    "has-image"
                );

            }


            showToast(
                "MRI image ready",
                "The image is ready for AI analysis.",
                "success"
            );

        };


        reader.onerror = () => {

            showToast(
                "Preview error",
                "Unable to preview this image.",
                "error"
            );

            resetUpload();

        };


        reader.readAsDataURL(file);

    }


    /* =====================================================
       FILE INPUT
    ===================================================== */

    if (mriImage) {

        mriImage.addEventListener(
            "change",
            (event) => {

                const file =
                    event.target.files?.[0];

                if (file) {

                    showImagePreview(file);

                }

            }
        );

    }


    /* =====================================================
       BROWSE BUTTON
    ===================================================== */

    if (browseBtn && mriImage) {

        browseBtn.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                mriImage.click();

            }
        );

    }


    /* =====================================================
       UPLOAD ZONE CLICK
    ===================================================== */

    if (uploadZone && mriImage) {

        uploadZone.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === browseBtn ||
                    event.target === removeImage
                ) {
                    return;
                }


                if (
                    uploadPreview &&
                    uploadPreview.classList.contains("active")
                ) {
                    return;
                }


                mriImage.click();

            }
        );

    }


    /* =====================================================
       DRAG & DROP
    ===================================================== */

    if (uploadZone) {

        [
            "dragenter",
            "dragover"
        ].forEach((eventName) => {

            uploadZone.addEventListener(
                eventName,
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    uploadZone.classList.add(
                        "drag-over"
                    );

                }
            );

        });


        [
            "dragleave",
            "dragend",
            "drop"
        ].forEach((eventName) => {

            uploadZone.addEventListener(
                eventName,
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    uploadZone.classList.remove(
                        "drag-over"
                    );

                }
            );

        });


        uploadZone.addEventListener(
            "drop",
            (event) => {

                const files =
                    event.dataTransfer.files;

                if (!files || files.length === 0) {
                    return;
                }


                const file = files[0];


                if (!validateFile(file)) {
                    return;
                }


                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(file);

                    mriImage.files =
                        dataTransfer.files;

                } catch (error) {

                    console.warn(
                        "Could not assign dropped file:",
                        error
                    );

                }


                showImagePreview(file);

            }
        );

    }


    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    function resetUpload() {

        selectedFile = null;


        if (mriImage) {

            mriImage.value = "";

        }


        if (previewImage) {

            previewImage.src = "";

        }


        if (previewFileName) {

            previewFileName.textContent =
                "MRI Image";

        }


        if (previewFileSize) {

            previewFileSize.textContent =
                "0 KB";

        }


        if (uploadPreview) {

            uploadPreview.classList.remove(
                "active"
            );

        }


        if (uploadDefault) {

            uploadDefault.style.display =
                "";

        }


        if (uploadZone) {

            uploadZone.classList.remove(
                "has-image"
            );

        }

    }


    if (removeImage) {

        removeImage.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                resetUpload();

                showToast(
                    "Image removed",
                    "Select another MRI image to continue.",
                    "warning"
                );

            }
        );

    }


    /* =====================================================
       FORM VALIDATION
    ===================================================== */

    if (predictionForm) {

        predictionForm.addEventListener(
            "submit",
            (event) => {

                const file =
                    mriImage?.files?.[0];


                if (!file) {

                    event.preventDefault();

                    showToast(
                        "MRI image required",
                        "Please upload a brain MRI image before analysis.",
                        "warning"
                    );

                    if (uploadZone) {

                        uploadZone.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                    return;

                }


                if (!validateFile(file)) {

                    event.preventDefault();

                    return;

                }


                const name =
                    document.getElementById(
                        "patient_name"
                    )?.value.trim();


                const age =
                    document.getElementById(
                        "patient_age"
                    )?.value;


                const gender =
                    document.getElementById(
                        "patient_gender"
                    )?.value;


                if (!name) {

                    event.preventDefault();

                    showToast(
                        "Patient name required",
                        "Please enter the patient's full name.",
                        "warning"
                    );

                    document
                        .getElementById("patient_name")
                        ?.focus();

                    return;

                }


                if (age) {

                    const numericAge =
                        Number(age);


                    if (
                        numericAge < 1 ||
                        numericAge > 120
                    ) {

                        event.preventDefault();

                        showToast(
                            "Invalid age",
                            "Please enter an age between 1 and 120.",
                            "warning"
                        );

                        document
                            .getElementById(
                                "patient_age"
                            )
                            ?.focus();

                        return;

                    }

                }


                if (!gender) {

                    event.preventDefault();

                    showToast(
                        "Gender not selected",
                        "Please select the patient's gender.",
                        "warning"
                    );

                    document
                        .getElementById(
                            "patient_gender"
                        )
                        ?.focus();

                    return;

                }


                /* -----------------------------------------
                   START ANALYSIS UI
                ----------------------------------------- */

                if (analyzeBtn) {

                    analyzeBtn.classList.add(
                        "loading"
                    );

                    analyzeBtn.disabled = true;

                    analyzeBtn.setAttribute(
                        "aria-busy",
                        "true"
                    );

                }


                showToast(
                    "AI analysis started",
                    "AarogyaDrishti is processing the MRI image.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       PREVENT DOUBLE SUBMISSION
    ===================================================== */

    if (predictionForm) {

        let submitted = false;


        predictionForm.addEventListener(
            "submit",
            () => {

                if (submitted) {

                    return;

                }

                submitted = true;

            }
        );

    }


    /* =====================================================
       AI CORE 3D PARALLAX
    ===================================================== */

    if (
        aiCoreCard &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        aiCoreCard.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    aiCoreCard.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((y - centerY) /
                        centerY) *
                    -2.5;


                const rotateY =
                    ((x - centerX) /
                        centerX) *
                    2.5;


                const coreVisual =
                    aiCoreCard.querySelector(
                        ".core-visual"
                    );


                if (coreVisual) {

                    coreVisual.style.transform =
                        `perspective(800px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)`;

                }

            }
        );


        aiCoreCard.addEventListener(
            "mouseleave",
            () => {

                const coreVisual =
                    aiCoreCard.querySelector(
                        ".core-visual"
                    );


                if (coreVisual) {

                    coreVisual.style.transform =
                        "perspective(800px) rotateX(0deg) rotateY(0deg)";

                }

            }
        );

    }


    /* =====================================================
       UPLOAD ZONE 3D TILT
    ===================================================== */

    if (
        uploadZone &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        uploadZone.addEventListener(
            "mousemove",
            (event) => {

                if (
                    uploadPreview &&
                    uploadPreview.classList.contains("active")
                ) {
                    return;
                }


                const rect =
                    uploadZone.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const rotateX =
                    ((y - rect.height / 2) /
                        rect.height) *
                    -2;


                const rotateY =
                    ((x - rect.width / 2) /
                        rect.width) *
                    2;


                uploadZone.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-2px)`;

            }
        );


        uploadZone.addEventListener(
            "mouseleave",
            () => {

                uploadZone.style.transform = "";

            }
        );

    }


    /* =====================================================
       CARD MOUSE GLOW
    ===================================================== */

    const glassCards =
        document.querySelectorAll(
            ".glass-card"
        );


    glassCards.forEach((card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                if (
                    !window.matchMedia(
                        "(pointer: fine)"
                    ).matches
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                card.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );


                card.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

            }
        );

    });


    /* =====================================================
       INPUT FOCUS EFFECTS
    ===================================================== */

    const inputs =
        document.querySelectorAll(
            ".input-wrapper input, .input-wrapper select"
        );


    inputs.forEach((input) => {

        input.addEventListener(
            "focus",
            () => {

                const wrapper =
                    input.closest(
                        ".input-wrapper"
                    );


                if (wrapper) {

                    wrapper.classList.add(
                        "focused"
                    );

                }

            }
        );


        input.addEventListener(
            "blur",
            () => {

                const wrapper =
                    input.closest(
                        ".input-wrapper"
                    );


                if (wrapper) {

                    wrapper.classList.remove(
                        "focused"
                    );

                }

            }
        );

    });


    /* =====================================================
       IMAGE KEYBOARD ACCESS
    ===================================================== */

    if (uploadZone) {

        uploadZone.setAttribute(
            "tabindex",
            "0"
        );


        uploadZone.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    if (mriImage) {

                        mriImage.click();

                    }

                }

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                mobileNav?.classList.remove(
                    "open"
                );

                toast?.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       PREVENT DRAGGING IMAGES OUTSIDE PREVIEW
    ===================================================== */

    document
        .querySelectorAll("img")
        .forEach((img) => {

            img.addEventListener(
                "dragstart",
                (event) => {

                    event.preventDefault();

                }
            );

        });


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    resetUpload();


    console.log(
        "%c AarogyaDrishti ",
        "background: #18d89b; color: #03120e; font-weight: 800; padding: 5px 10px; border-radius: 5px;"
    );

    console.log(
        "%c AI Brain MRI Prediction System ",
        "color: #4dddf4; font-weight: 700;"
    );

});