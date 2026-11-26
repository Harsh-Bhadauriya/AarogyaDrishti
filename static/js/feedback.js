/* ============================================================
   AAROGYADRISHTI - FEEDBACK PAGE JAVASCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================================
       FEEDBACK FORM
       ======================================================== */

    const feedbackForm = document.getElementById("feedbackForm");

    if (!feedbackForm) {
        return;
    }


    /* ========================================================
       STAR RATING
       ======================================================== */

    const ratingInputs = document.querySelectorAll(
        '.rating input[type="radio"]'
    );

    const ratingLabels = document.querySelectorAll(
        ".rating label"
    );


    ratingInputs.forEach(function (input) {

        input.addEventListener("change", function () {

            updateStars();

        });

    });


    function updateStars() {

        let selectedRating = 0;

        ratingInputs.forEach(function (input) {

            if (input.checked) {
                selectedRating = parseInt(input.value);
            }

        });


        ratingLabels.forEach(function (label) {

            const targetId = label.getAttribute("for");

            const targetInput = document.getElementById(
                targetId
            );

            if (!targetInput) {
                return;
            }

            const starNumber = parseInt(
                targetInput.value
            );


            if (starNumber <= selectedRating) {

                label.classList.add(
                    "selected"
                );

            } else {

                label.classList.remove(
                    "selected"
                );

            }

        });

    }


    /* ========================================================
       STAR HOVER EFFECT
       ======================================================== */

    ratingLabels.forEach(function (label) {

        label.addEventListener(
            "mouseenter",
            function () {

                const targetId =
                    label.getAttribute("for");

                const targetInput =
                    document.getElementById(targetId);

                if (!targetInput) {
                    return;
                }

                const hoverRating =
                    parseInt(targetInput.value);


                ratingLabels.forEach(
                    function (hoverLabel) {

                        const hoverId =
                            hoverLabel.getAttribute("for");

                        const hoverInput =
                            document.getElementById(
                                hoverId
                            );

                        if (!hoverInput) {
                            return;
                        }

                        const starNumber =
                            parseInt(
                                hoverInput.value
                            );


                        if (
                            starNumber <= hoverRating
                        ) {

                            hoverLabel.style.color =
                                "#fbbf24";

                        } else {

                            hoverLabel.style.color =
                                "";

                        }

                    }
                );

            }
        );


        label.addEventListener(
            "mouseleave",
            function () {

                updateStars();

                ratingLabels.forEach(
                    function (resetLabel) {

                        resetLabel.style.color =
                            "";

                    }
                );

            }
        );

    });


    /* ========================================================
       FORM VALIDATION
       ======================================================== */

    feedbackForm.addEventListener(
        "submit",
        function (event) {

            const name =
                document.getElementById("name");

            const email =
                document.getElementById("email");

            const rating =
                document.querySelector(
                    '.rating input[name="rating"]:checked'
                );

            const category =
                document.getElementById("category");

            const feedback =
                document.getElementById("feedback");

            const recommendation =
                document.querySelector(
                    'input[name="recommendation"]:checked'
                );


            /* -----------------------------------------------
               NAME
            ------------------------------------------------ */

            if (
                !name ||
                name.value.trim() === ""
            ) {

                event.preventDefault();

                showFormMessage(
                    "Please enter your name.",
                    "error"
                );

                if (name) {
                    name.focus();
                }

                return;

            }


            /* -----------------------------------------------
               EMAIL
            ------------------------------------------------ */

            if (
                !email ||
                email.value.trim() === ""
            ) {

                event.preventDefault();

                showFormMessage(
                    "Please enter your email.",
                    "error"
                );

                if (email) {
                    email.focus();
                }

                return;

            }


            /* -----------------------------------------------
               EMAIL FORMAT
            ------------------------------------------------ */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                event.preventDefault();

                showFormMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                email.focus();

                return;

            }


            /* -----------------------------------------------
               STAR RATING
            ------------------------------------------------ */

            if (!rating) {

                event.preventDefault();

                showFormMessage(
                    "Please select your overall experience rating.",
                    "error"
                );

                return;

            }


            /* -----------------------------------------------
               CATEGORY
            ------------------------------------------------ */

            if (
                !category ||
                category.value === ""
            ) {

                event.preventDefault();

                showFormMessage(
                    "Please select a feedback category.",
                    "error"
                );

                if (category) {
                    category.focus();
                }

                return;

            }


            /* -----------------------------------------------
               FEEDBACK
            ------------------------------------------------ */

            if (
                !feedback ||
                feedback.value.trim() === ""
            ) {

                event.preventDefault();

                showFormMessage(
                    "Please write your feedback.",
                    "error"
                );

                if (feedback) {
                    feedback.focus();
                }

                return;

            }


            /* -----------------------------------------------
               RECOMMENDATION
            ------------------------------------------------ */

            if (!recommendation) {

                event.preventDefault();

                showFormMessage(
                    "Please select whether you would recommend AarogyaDrishti.",
                    "error"
                );

                return;

            }


            /* -----------------------------------------------
               SUBMIT STATE
            ------------------------------------------------ */

            const submitButton =
                feedbackForm.querySelector(
                    ".submit-btn"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Submitting Feedback...";

                submitButton.style.opacity =
                    "0.75";

                submitButton.style.cursor =
                    "wait";

            }

        }
    );


    /* ========================================================
       FORM MESSAGE
       ======================================================== */

    function showFormMessage(
        message,
        type
    ) {

        const existingMessage =
            document.querySelector(
                ".js-feedback-message"
            );


        if (existingMessage) {
            existingMessage.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className =
            "js-feedback-message " +
            (
                type === "error"
                    ? "error-message"
                    : "success-message"
            );


        messageBox.textContent =
            message;


        feedbackForm.parentNode.insertBefore(
            messageBox,
            feedbackForm
        );


        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        setTimeout(
            function () {

                if (messageBox) {
                    messageBox.remove();
                }

            },
            5000
        );

    }


    /* ========================================================
       TEXTAREA AUTO GROW
       ======================================================== */

    const textareas =
        feedbackForm.querySelectorAll(
            "textarea"
        );


    textareas.forEach(function (textarea) {

        textarea.addEventListener(
            "input",
            function () {

                this.style.height =
                    "auto";

                this.style.height =
                    this.scrollHeight + "px";

            }
        );

    });


    /* ========================================================
       PHONE NUMBER - BASIC CLEANING
       ======================================================== */

    const phone =
        document.getElementById("phone");


    if (phone) {

        phone.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^0-9+\-\s()]/g,
                        ""
                    );

            }
        );

    }


    /* ========================================================
       INITIAL STAR STATE
       ======================================================== */

    updateStars();

});