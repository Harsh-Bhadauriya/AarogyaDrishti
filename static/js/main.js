/* =========================================================
   AAROGYADRISHTI
   PREMIUM MEDICAL AI MOTION ENGINE
   MAIN.JS — GLOBAL VERSION
   =========================================================

   FEATURES
   01. Tiny falling tech particles
   02. 3D rotating brain rings
   03. Cyan / Emerald / Violet floating orbs
   04. Random glowing particles
   05. Neural-network connecting lines
   06. Floating stars / tech symbols
   07. Orbital particles
   08. Mouse parallax
   09. 3D card tilt
   10. Scroll reveal
   11. Page entrance
   12. Page transition
   13. Magnetic buttons
   14. Animated background
   15. Scanner effects
   16. Hover particle burst
   17. Floating bubbles
   18. Animated counters
   19. Enhanced loader + theme transition

   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL CONFIG
   ========================================================= */

const AAROGYA_CONFIG = {

    themeKey: "aarogya-theme",

    particleCount: 42,
    starCount: 28,
    orbCount: 6,
    bubbleCount: 14,
    glowParticleCount: 22,

    cardTilt: 7,
    magneticStrength: 0.12,
    parallaxStrength: 18,

    transitionTime: 420,

    colors: [
        "#00F5A0",
        "#00D9FF",
        "#7C5CFF",
        "#A855F7",
        "#FF4ECD"
    ]

};


/* =========================================================
   IMPORTANT
   DO NOT DISABLE MOTION
   ========================================================= */

const REDUCED_MOTION = false;

const IS_MOBILE =
    window.matchMedia(
        "(max-width: 768px)"
    ).matches;

const IS_TOUCH =
    window.matchMedia(
        "(pointer: coarse)"
    ).matches;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        injectPremiumCSS();

        initializeTheme();

        initializeThemeToggle();

        initializeNavbar();

        initializeMobileMenu();

        initializeActiveNavigation();

        initializeSmoothScroll();

        initializeLoader();

        initializeGlobalLayers();

        initializeBrainSystems();

        initializeMouseParallax();

        initialize3DCards();

        initializeMagneticButtons();

        initializeScrollReveal();

        initializeCounters();

        initializeHoverBurst();

        initializePageTransitions();

        initializeBackToTop();

        initializeImages();

        initializeCurrentYear();

        initializePageEntrance();

        console.log(
            "%cAarogyaDrishti Premium Motion Engine Loaded",
            "color:#00F5A0;font-size:14px;font-weight:bold;"
        );

    },
    { once: true }
);


/* =========================================================
   THEME
   ========================================================= */

function initializeTheme() {

    const saved =
        localStorage.getItem(
            AAROGYA_CONFIG.themeKey
        );

    if (saved === "light") {

        document.body.classList.add(
            "light-mode"
        );

    } else {

        document.body.classList.remove(
            "light-mode"
        );

    }

    updateThemeUI();
}


/* =========================================================
   THEME TOGGLE
   ========================================================= */

function initializeThemeToggle() {

    const toggle =
        document.getElementById(
            "themeToggle"
        );

    if (!toggle) return;

    toggle.addEventListener(
        "click",
        () => {

            document.body.classList.add(
                "theme-transitioning"
            );

            const light =
                document.body.classList.contains(
                    "light-mode"
                );

            if (light) {

                document.body.classList.remove(
                    "light-mode"
                );

                localStorage.setItem(
                    AAROGYA_CONFIG.themeKey,
                    "dark"
                );

            } else {

                document.body.classList.add(
                    "light-mode"
                );

                localStorage.setItem(
                    AAROGYA_CONFIG.themeKey,
                    "light"
                );

            }

            updateThemeUI();

            setTimeout(
                () => {

                    document.body.classList.remove(
                        "theme-transitioning"
                    );

                },
                700
            );

        }
    );

}


/* =========================================================
   THEME UI
   ========================================================= */

function updateThemeUI() {

    const toggle =
        document.getElementById(
            "themeToggle"
        );

    if (!toggle) return;

    const light =
        document.body.classList.contains(
            "light-mode"
        );

    toggle.setAttribute(
        "aria-label",
        light
            ? "Switch to dark mode"
            : "Switch to light mode"
    );

    toggle.setAttribute(
        "title",
        light
            ? "Dark Mode"
            : "Light Mode"
    );

}


/* =========================================================
   NAVBAR
   ========================================================= */

function initializeNavbar() {

    const navbar =
        document.querySelector(
            ".navbar"
        );

    if (!navbar) return;

    function update() {

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

    }

    update();

    window.addEventListener(
        "scroll",
        update,
        { passive: true }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const button =
        document.querySelector(
            ".mobile-menu-btn"
        );

    const menu =
        document.querySelector(
            ".mobile-nav"
        );

    if (!button || !menu) return;

    button.addEventListener(
        "click",
        () => {

            const open =
                menu.classList.toggle(
                    "open"
                );

            button.classList.toggle(
                "active",
                open
            );

            button.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );

    menu.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    menu.classList.remove(
                        "open"
                    );

                    button.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function initializeActiveNavigation() {

    const current =
        window.location.pathname;

    document
        .querySelectorAll(
            ".nav-link, .mobile-nav-link"
        )
        .forEach(link => {

            const href =
                link.getAttribute(
                    "href"
                );

            if (!href) return;

            try {

                const url =
                    new URL(
                        href,
                        window.location.origin
                    );

                const same =
                    url.pathname ===
                    current;

                link.classList.toggle(
                    "active",
                    same
                );

            } catch {}

        });

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function initializeSmoothScroll() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(anchor => {

            anchor.addEventListener(
                "click",
                event => {

                    const id =
                        anchor.getAttribute(
                            "href"
                        );

                    if (
                        !id ||
                        id === "#"
                    ) return;

                    const target =
                        document.querySelector(
                            id
                        );

                    if (!target) return;

                    event.preventDefault();

                    const offset =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        90;

                    window.scrollTo({
                        top: offset,
                        behavior: "smooth"
                    });

                }
            );

        });

}


/* =========================================================
   GLOBAL LAYERS
   ========================================================= */

function initializeGlobalLayers() {

    createParticleField();

    createGlowParticles();

    createStarField();

    createFloatingOrbs();

    createFloatingBubbles();

    createHUD();

}


/* =========================================================
   TINY FALLING TECH PARTICLES
   ========================================================= */

function createParticleField() {

    if (
        document.querySelector(
            ".aarogya-particle-field"
        )
    ) return;

    const field =
        document.createElement(
            "div"
        );

    field.className =
        "aarogya-particle-field";

    field.setAttribute(
        "aria-hidden",
        "true"
    );

    const count =
        IS_MOBILE
            ? 20
            : AAROGYA_CONFIG
                .particleCount;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        particle.className =
            "tech-particle";

        const color =
            randomItem(
                AAROGYA_CONFIG.colors
            );

        const duration =
            8 +
            Math.random() *
            14;

        const delay =
            Math.random() *
            -20;

        particle.style.cssText = `
            position:absolute !important;
            left:${Math.random() * 100}% !important;
            top:-20px !important;
            width:${1.5 + Math.random() * 3}px !important;
            height:${1.5 + Math.random() * 3}px !important;
            display:block !important;
            visibility:visible !important;
            opacity:.85 !important;
            border-radius:50% !important;
            background:${color} !important;
            box-shadow:0 0 8px ${color}, 0 0 18px ${color} !important;
            pointer-events:none !important;
            z-index:9990 !important;

            --fall-x:${-30 + Math.random() * 60}px;
            --particle-color:${color};

            animation-name:aarogyaParticleFall !important;
            animation-duration:${duration}s !important;
            animation-delay:${delay}s !important;
            animation-timing-function:linear !important;
            animation-iteration-count:infinite !important;
            animation-fill-mode:both !important;
        `;

        field.appendChild(
            particle
        );

    }

    document.body.appendChild(
        field
    );

}


/* =========================================================
   RANDOM GLOW PARTICLES
   ========================================================= */

function createGlowParticles() {

    const field =
        document.createElement(
            "div"
        );

    field.className =
        "aarogya-glow-particles";

    field.setAttribute(
        "aria-hidden",
        "true"
    );

    const count =
        IS_MOBILE
            ? 10
            : AAROGYA_CONFIG
                .glowParticleCount;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        const color =
            randomItem(
                AAROGYA_CONFIG.colors
            );

        particle.className =
            "glow-particle";

        particle.style.cssText = `
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;

            width:${2 + Math.random() * 4}px;
            height:${2 + Math.random() * 4}px;

            background:${color};

            box-shadow:
                0 0 10px ${color},
                0 0 25px ${color};

            animation-duration:
                ${4 + Math.random() * 8}s;

            animation-delay:
                ${Math.random() * -10}s;
        `;

        field.appendChild(
            particle
        );

    }

    document.body.appendChild(
        field
    );

}


/* =========================================================
   FLOATING STARS
   ========================================================= */

function createStarField() {

    const field =
        document.createElement(
            "div"
        );

    field.className =
        "aarogya-star-field";

    field.setAttribute(
        "aria-hidden",
        "true"
    );

    const symbols = [
        "✦",
        "✧",
        "⋆",
        "·",
        "•",
        "＋",
        "◇",
        "⌁",
        "⟡",
        "AI"
    ];

    const count =
        IS_MOBILE
            ? 12
            : AAROGYA_CONFIG.starCount;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const star =
            document.createElement(
                "span"
            );

        star.className =
            "tech-star";

        star.textContent =
            randomItem(symbols);

        const color =
            randomItem(
                AAROGYA_CONFIG.colors
            );

        star.style.cssText = `
            position:absolute !important;
            left:${Math.random() * 100}% !important;
            top:${Math.random() * 100}% !important;

            color:${color} !important;

            font-size:
                ${7 + Math.random() * 10}px !important;

            text-shadow:
                0 0 8px ${color},
                0 0 20px ${color};

            animation-name:
                aarogyaStarFloat !important;

            animation-duration:
                ${7 + Math.random() * 10}s !important;

            animation-delay:
                ${Math.random() * -12}s !important;

            animation-iteration-count:
                infinite !important;

            animation-timing-function:
                ease-in-out !important;

            pointer-events:none !important;

            z-index:9991 !important;
        `;

        field.appendChild(
            star
        );

    }

    document.body.appendChild(
        field
    );

}


/* =========================================================
   FLOATING ORBS
   ========================================================= */

function createFloatingOrbs() {

    const field =
        document.createElement(
            "div"
        );

    field.className =
        "aarogya-orb-field";

    field.setAttribute(
        "aria-hidden",
        "true"
    );

    const orbColors = [
        "rgba(0,245,160,.20)",
        "rgba(0,217,255,.18)",
        "rgba(124,92,255,.18)",
        "rgba(168,85,247,.15)",
        "rgba(255,78,205,.10)"
    ];

    const count =
        IS_MOBILE
            ? 3
            : AAROGYA_CONFIG.orbCount;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const orb =
            document.createElement(
                "div"
            );

        orb.className =
            "floating-orb";

        orb.style.cssText = `
            position:absolute !important;

            left:${Math.random() * 100}% !important;
            top:${Math.random() * 100}% !important;

            width:
                ${160 + Math.random() * 260}px !important;

            height:
                ${160 + Math.random() * 260}px !important;

            border-radius:50% !important;

            background:
                radial-gradient(
                    circle,
                    ${orbColors[i % orbColors.length]},
                    transparent 70%
                ) !important;

            filter:blur(10px) !important;

            pointer-events:none !important;

            animation-name:
                aarogyaOrbFloat !important;

            animation-duration:
                ${18 + Math.random() * 12}s !important;

            animation-delay:
                ${Math.random() * -20}s !important;

            animation-iteration-count:
                infinite !important;

            animation-direction:
                alternate !important;

            z-index:9980 !important;
        `;

        field.appendChild(
            orb
        );

    }

    document.body.appendChild(
        field
    );

}


/* =========================================================
   FLOATING BUBBLES
   ========================================================= */

function createFloatingBubbles() {

    const field =
        document.createElement(
            "div"
        );

    field.className =
        "aarogya-bubble-field";

    field.setAttribute(
        "aria-hidden",
        "true"
    );

    const count =
        IS_MOBILE
            ? 6
            : AAROGYA_CONFIG.bubbleCount;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const bubble =
            document.createElement(
                "span"
            );

        bubble.className =
            "floating-bubble";

        bubble.style.cssText = `
            position:absolute !important;

            left:${Math.random() * 100}% !important;

            bottom:-60px !important;

            width:
                ${8 + Math.random() * 28}px !important;

            height:
                ${8 + Math.random() * 28}px !important;

            border-radius:50% !important;

            border:
                1px solid
                rgba(0,217,255,.22) !important;

            background:
                radial-gradient(
                    circle at 30% 25%,
                    rgba(255,255,255,.15),
                    rgba(0,217,255,.03)
                ) !important;

            box-shadow:
                inset 0 0 10px
                rgba(255,255,255,.06),
                0 0 15px
                rgba(0,217,255,.08) !important;

            pointer-events:none !important;

            animation-name:
                aarogyaBubbleFloat !important;

            animation-duration:
                ${12 + Math.random() * 16}s !important;

            animation-delay:
                ${Math.random() * -20}s !important;

            animation-iteration-count:
                infinite !important;

            animation-timing-function:
                linear !important;

            z-index:9990 !important;
        `;

        field.appendChild(
            bubble
        );

    }

    document.body.appendChild(
        field
    );

}


/* =========================================================
   GLOBAL HUD
   ========================================================= */

function createHUD() {

    const hud =
        document.createElement(
            "div"
        );

    hud.className =
        "aarogya-global-hud";

    hud.setAttribute(
        "aria-hidden",
        "true"
    );

    hud.innerHTML = `
        <span class="hud-corner hud-tl"></span>
        <span class="hud-corner hud-tr"></span>
        <span class="hud-corner hud-bl"></span>
        <span class="hud-corner hud-br"></span>

        <span class="hud-cross hud-c1">+</span>
        <span class="hud-cross hud-c2">+</span>

        <span class="hud-line hud-l1"></span>
        <span class="hud-line hud-l2"></span>
    `;

    document.body.appendChild(
        hud
    );

}


/* =========================================================
   BRAIN SYSTEMS
   ========================================================= */

function initializeBrainSystems() {

    const targets =
        document.querySelectorAll(
            [
                ".brain-core",
                ".brain-visual",
                ".hero-visual",
                ".ai-core",
                ".medical-core",
                ".visual-core",
                ".brain-container",
                ".brain-image",
                ".brain-wrapper",
                ".brain-section"
            ].join(",")
        );

    targets.forEach(
        target => {

            if (
                target.dataset
                    .aarogyaBrain
            ) return;

            target.dataset
                .aarogyaBrain =
                "true";

            createBrainOrbits(
                target
            );

            createOrbitalParticles(
                target
            );

            createNeuralNetwork(
                target
            );

            createScanner(
                target
            );

        }
    );

}


/* =========================================================
   3D BRAIN RINGS
   ========================================================= */

function createBrainOrbits(
    target
) {

    const system =
        document.createElement(
            "div"
        );

    system.className =
        "aarogya-brain-orbits";

    system.innerHTML = `
        <div class="brain-orbit orbit-one">
            <span></span>
        </div>

        <div class="brain-orbit orbit-two">
            <span></span>
        </div>

        <div class="brain-orbit orbit-three">
            <span></span>
        </div>

        <div class="brain-orbit orbit-four">
            <span></span>
        </div>
    `;

    target.appendChild(
        system
    );

}


/* =========================================================
   ORBITAL PARTICLES
   ========================================================= */

function createOrbitalParticles(
    target
) {

    const layer =
        document.createElement(
            "div"
        );

    layer.className =
        "brain-orbital-particles";

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        const color =
            randomItem(
                AAROGYA_CONFIG.colors
            );

        particle.style.cssText = `
            --angle:${Math.random() * 360}deg;

            --radius:
                ${40 + Math.random() * 30}px;

            width:${2 + Math.random() * 3}px;
            height:${2 + Math.random() * 3}px;

            background:${color};

            box-shadow:
                0 0 10px ${color},
                0 0 20px ${color};

            animation-duration:
                ${5 + Math.random() * 8}s;

            animation-delay:
                ${Math.random() * -10}s;
        `;

        layer.appendChild(
            particle
        );

    }

    target.appendChild(
        layer
    );

}


/* =========================================================
   NEURAL NETWORK
   ========================================================= */

function createNeuralNetwork(
    target
) {

    const layer =
        document.createElement(
            "div"
        );

    layer.className =
        "aarogya-neural-system";

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

    svg.setAttribute(
        "viewBox",
        "0 0 100 100"
    );

    const points = [
        [10,45],
        [18,22],
        [26,68],
        [38,15],
        [42,42],
        [56,25],
        [68,58],
        [82,35],
        [72,80],
        [42,82]
    ];

    const connections = [
        [0,1],
        [0,4],
        [1,3],
        [1,4],
        [2,4],
        [2,9],
        [3,4],
        [3,5],
        [4,5],
        [4,6],
        [4,9],
        [5,7],
        [5,6],
        [6,7],
        [6,8],
        [7,8],
        [9,8]
    ];

    connections.forEach(
        ([a,b]) => {

            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );

            line.setAttribute(
                "x1",
                points[a][0]
            );

            line.setAttribute(
                "y1",
                points[a][1]
            );

            line.setAttribute(
                "x2",
                points[b][0]
            );

            line.setAttribute(
                "y2",
                points[b][1]
            );

            svg.appendChild(
                line
            );

        }
    );

    points.forEach(
        ([x,y]) => {

            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );

            circle.setAttribute(
                "cx",
                x
            );

            circle.setAttribute(
                "cy",
                y
            );

            circle.setAttribute(
                "r",
                "1"
            );

            svg.appendChild(
                circle
            );

        }
    );

    layer.appendChild(
        svg
    );

    target.appendChild(
        layer
    );

}


/* =========================================================
   SCANNER
   ========================================================= */

function createScanner(
    target
) {

    const scanner =
        document.createElement(
            "span"
        );

    scanner.className =
        "aarogya-brain-scanner";

    target.appendChild(
        scanner
    );

}


/* =========================================================
   MOUSE PARALLAX
   ========================================================= */

function initializeMouseParallax() {

    if (IS_TOUCH) return;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    window.addEventListener(
        "mousemove",
        event => {

            targetX =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                ) *
                AAROGYA_CONFIG
                    .parallaxStrength;

            targetY =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                ) *
                AAROGYA_CONFIG
                    .parallaxStrength;

        },
        {
            passive:true
        }
    );

    function animate() {

        currentX +=
            (
                targetX -
                currentX
            ) * 0.045;

        currentY +=
            (
                targetY -
                currentY
            ) * 0.045;

        document.documentElement
            .style
            .setProperty(
                "--mouse-x",
                `${currentX}px`
            );

        document.documentElement
            .style
            .setProperty(
                "--mouse-y",
                `${currentY}px`
            );

        requestAnimationFrame(
            animate
        );

    }

    animate();

}


/* =========================================================
   3D CARD TILT
   ========================================================= */

function initialize3DCards() {

    if (IS_TOUCH) return;

    const selectors = [
        ".card",
        ".feature-card",
        ".stat-card",
        ".team-card",
        ".project-card",
        ".report-card",
        ".history-card",
        ".info-card",
        ".prediction-card",
        ".upload-card",
        ".result-card",
        ".recommendation-card"
    ];

    document
        .querySelectorAll(
            selectors.join(",")
        )
        .forEach(card => {

            card.style.transformStyle =
                "preserve-3d";

            card.addEventListener(
                "pointermove",
                event => {

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
                            0.5 - y
                        ) *
                        AAROGYA_CONFIG
                            .cardTilt;

                    const rotateY =
                        (
                            x - 0.5
                        ) *
                        AAROGYA_CONFIG
                            .cardTilt;

                    card.style.transform = `
                        perspective(1000px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        translateY(-6px)
                        translateZ(8px)
                    `;

                }
            );

            card.addEventListener(
                "pointerleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });

}


/* =========================================================
   MAGNETIC BUTTONS
   ========================================================= */

function initializeMagneticButtons() {

    if (IS_TOUCH) return;

    document
        .querySelectorAll(
            [
                ".btn",
                ".primary-btn",
                ".primary-action",
                ".secondary-btn",
                ".secondary-action",
                ".analyze-btn",
                ".cta-btn"
            ].join(",")
        )
        .forEach(button => {

            button.addEventListener(
                "pointermove",
                event => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        (
                            rect.left +
                            rect.width / 2
                        );

                    const y =
                        event.clientY -
                        (
                            rect.top +
                            rect.height / 2
                        );

                    button.style.transform = `
                        translate(
                            ${x * AAROGYA_CONFIG.magneticStrength}px,
                            ${y * AAROGYA_CONFIG.magneticStrength}px
                        )
                        scale(1.025)
                    `;

                }
            );

            button.addEventListener(
                "pointerleave",
                () => {

                    button.style.transform =
                        "";

                }
            );

        });

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initializeScrollReveal() {

    const elements =
        document.querySelectorAll(
            [
                ".reveal",
                ".reveal-up",
                ".fade-in",
                ".animate-on-scroll",
                ".feature-card",
                ".stat-card",
                ".team-card",
                ".report-card",
                ".history-card"
            ].join(",")
        );

    if (!elements.length) return;

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:0.08,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );

    elements.forEach(
        element =>
            observer.observe(
                element
            )
    );

}


/* =========================================================
   HOVER PARTICLE BURST
   ========================================================= */

function initializeHoverBurst() {

    document.addEventListener(
        "pointerover",
        event => {

            const target =
                event.target.closest(
                    [
                        ".btn",
                        ".primary-btn",
                        ".primary-action",
                        ".card-icon",
                        ".feature-icon",
                        ".logo"
                    ].join(",")
                );

            if (!target) return;

            if (
                target.dataset.burst
            ) return;

            target.dataset.burst =
                "true";

            createBurst(
                target
            );

            setTimeout(
                () => {

                    delete target
                        .dataset
                        .burst;

                },
                700
            );

        }
    );

}


/* =========================================================
   PARTICLE BURST
   ========================================================= */

function createBurst(
    target
) {

    const rect =
        target.getBoundingClientRect();

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            20 +
            Math.random() *
            45;

        const color =
            randomItem(
                AAROGYA_CONFIG.colors
            );

        particle.className =
            "aarogya-burst";

        particle.style.cssText = `
            position:fixed !important;

            left:
                ${rect.left + rect.width / 2}px !important;

            top:
                ${rect.top + rect.height / 2}px !important;

            width:
                ${2 + Math.random() * 3}px !important;

            height:
                ${2 + Math.random() * 3}px !important;

            border-radius:50% !important;

            background:${color} !important;

            box-shadow:
                0 0 12px ${color},
                0 0 24px ${color};

            pointer-events:none !important;

            z-index:999999 !important;

            --burst-x:
                ${Math.cos(angle) * distance}px;

            --burst-y:
                ${Math.sin(angle) * distance}px;

            animation:
                aarogyaBurst .7s
                cubic-bezier(.22,1,.36,1)
                forwards !important;
        `;

        document.body.appendChild(
            particle
        );

        setTimeout(
            () => {

                particle.remove();

            },
            750
        );

    }

}


/* =========================================================
   COUNTERS
   ========================================================= */

function initializeCounters() {

    const counters =
        document.querySelectorAll(
            [
                "[data-count]",
                ".counter",
                ".stat-number"
            ].join(",")
        );

    if (!counters.length) return;

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) return;

                        animateCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold:0.5
            }
        );

    counters.forEach(
        counter =>
            observer.observe(
                counter
            )
    );

}


/* =========================================================
   COUNTER ANIMATION
   ========================================================= */

function animateCounter(
    element
) {

    if (
        element.dataset
            .counterAnimated
    ) return;

    element.dataset
        .counterAnimated =
        "true";

    const source =
        element.dataset.count ||
        element.textContent;

    const match =
        source.match(
            /[\d,.]+/
        );

    if (!match) return;

    const target =
        parseFloat(
            match[0].replace(
                /,/g,
                ""
            )
        );

    if (!Number.isFinite(target))
        return;

    const prefix =
        source.substring(
            0,
            match.index
        );

    const suffix =
        source.substring(
            match.index +
            match[0].length
        );

    const start =
        performance.now();

    function frame(
        now
    ) {

        const progress =
            Math.min(
                (now - start) /
                1400,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const value =
            target *
            eased;

        element.textContent =
            prefix +
            (
                Number.isInteger(
                    target
                )
                    ? Math.round(
                        value
                    ).toLocaleString()
                    : value.toFixed(1)
            ) +
            suffix;

        if (
            progress < 1
        ) {

            requestAnimationFrame(
                frame
            );

        }

    }

    requestAnimationFrame(
        frame
    );

}


/* =========================================================
   PAGE TRANSITIONS
   ========================================================= */

function initializePageTransitions() {

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "a"
                );

            if (!link) return;

            const href =
                link.getAttribute(
                    "href"
                );

            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                link.target === "_blank" ||
                link.hasAttribute(
                    "download"
                )
            ) return;

            let url;

            try {

                url =
                    new URL(
                        href,
                        window.location.href
                    );

            } catch {

                return;

            }

            if (
                url.origin !==
                window.location.origin
            ) return;

            if (
                url.pathname ===
                window.location.pathname
            ) return;

            event.preventDefault();

            document.body.classList.add(
                "page-exiting"
            );

            setTimeout(
                () => {

                    window.location.href =
                        url.href;

                },
                AAROGYA_CONFIG
                    .transitionTime
            );

        }
    );

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function initializeBackToTop() {

    let button =
        document.querySelector(
            ".back-to-top"
        );

    if (!button) {

        button =
            document.createElement(
                "button"
            );

        button.className =
            "back-to-top";

        button.type =
            "button";

        button.innerHTML =
            "↑";

        button.setAttribute(
            "aria-label",
            "Back to top"
        );

        document.body.appendChild(
            button
        );

    }

    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        }
    );

    window.addEventListener(
        "scroll",
        () => {

            button.classList.toggle(
                "visible",
                window.scrollY > 400
            );

        },
        {
            passive:true
        }
    );

}


/* =========================================================
   IMAGES
   ========================================================= */

function initializeImages() {

    document
        .querySelectorAll("img")
        .forEach(img => {

            if (
                !img.hasAttribute(
                    "loading"
                )
            ) {

                img.setAttribute(
                    "loading",
                    "lazy"
                );

            }

        });

}


/* =========================================================
   YEAR
   ========================================================= */

function initializeCurrentYear() {

    const year =
        new Date()
            .getFullYear();

    document
        .querySelectorAll(
            "[data-current-year]"
        )
        .forEach(
            element =>
                element.textContent =
                    year
        );

}


/* =========================================================
   PAGE ENTRANCE
   ========================================================= */

function initializePageEntrance() {

    requestAnimationFrame(
        () => {

            document.body.classList.add(
                "aarogya-ready"
            );

        }
    );

}


/* =========================================================
   ENHANCED LOADER
   ========================================================= */

function initializeLoader() {

    let loader =
        document.querySelector(
            ".page-loader"
        );

    if (!loader) {

        loader =
            document.createElement(
                "div"
            );

        loader.className =
            "page-loader aarogya-loader";

        loader.innerHTML = `
            <div class="loader-core-wrap">

                <div class="loader-ring ring-a"></div>
                <div class="loader-ring ring-b"></div>
                <div class="loader-ring ring-c"></div>

                <div class="loader-core">
                    AD
                </div>

            </div>

            <div class="loader-title">
                AAROGYADRISHTI
            </div>

            <div class="loader-subtitle">
                Initializing Medical AI
            </div>

            <div class="loader-progress">
                <span></span>
            </div>
        `;

        document.body.prepend(
            loader
        );

    }

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                () => {

                    loader.classList.add(
                        "loaded"
                    );

                },
                500
            );

        },
        { once:true }
    );

    setTimeout(
        () => {

            loader.classList.add(
                "loaded"
            );

        },
        3500
    );

}


/* =========================================================
   PREMIUM GLOBAL CSS
   ========================================================= */

function injectPremiumCSS() {

    if (
        document.getElementById(
            "aarogya-motion-engine-css"
        )
    ) return;

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "aarogya-motion-engine-css";

    style.textContent = `

/* =====================================================
   ROOT MOTION
   ===================================================== */

:root {

    --aarogya-cyan:#00D9FF;
    --aarogya-emerald:#00F5A0;
    --aarogya-violet:#7C5CFF;
    --aarogya-purple:#A855F7;
    --aarogya-pink:#FF4ECD;

    --mouse-x:0px;
    --mouse-y:0px;
}


/* =====================================================
   PARTICLE LAYERS
   ===================================================== */

.aarogya-particle-field,
.aarogya-glow-particles,
.aarogya-star-field,
.aarogya-orb-field,
.aarogya-bubble-field {

    position:fixed !important;

    inset:0 !important;

    width:100vw !important;
    height:100vh !important;

    overflow:hidden !important;

    pointer-events:none !important;

    display:block !important;

    visibility:visible !important;
}


/* =====================================================
   Z-INDEX
   ===================================================== */

.aarogya-orb-field {

    z-index:0 !important;
}

.aarogya-particle-field,
.aarogya-glow-particles,
.aarogya-star-field,
.aarogya-bubble-field {

    z-index:9990 !important;
}

.aarogya-global-hud {

    z-index:9985 !important;
}


/* =====================================================
   PARTICLE ANIMATION
   ===================================================== */

@keyframes aarogyaParticleFall {

    0% {

        transform:
            translate3d(
                0,
                -30px,
                0
            )
            scale(.3);

        opacity:0;
    }

    8% {

        opacity:.85;
    }

    45% {

        transform:
            translate3d(
                var(--fall-x),
                50vh,
                0
            )
            scale(1);
    }

    80% {

        opacity:.65;
    }

    100% {

        transform:
            translate3d(
                calc(
                    var(--fall-x) * -1
                ),
                110vh,
                0
            )
            scale(.35);

        opacity:0;
    }

}


/* =====================================================
   GLOW PARTICLES
   ===================================================== */

.glow-particle {

    position:absolute;

    border-radius:50%;

    pointer-events:none;

    animation:
        aarogyaGlowFloat
        8s
        ease-in-out
        infinite
        alternate;
}

@keyframes aarogyaGlowFloat {

    0% {

        transform:
            translate3d(
                0,
                0,
                0
            )
            scale(.7);

        opacity:.25;
    }

    50% {

        transform:
            translate3d(
                30px,
                -25px,
                0
            )
            scale(1.2);

        opacity:1;
    }

    100% {

        transform:
            translate3d(
                -20px,
                35px,
                0
            )
            scale(.8);

        opacity:.35;
    }

}


/* =====================================================
   STARS
   ===================================================== */

@keyframes aarogyaStarFloat {

    0% {

        transform:
            translate3d(
                0,
                0,
                0
            )
            rotate(0deg)
            scale(.7);

        opacity:.2;
    }

    50% {

        transform:
            translate3d(
                18px,
                -24px,
                0
            )
            rotate(90deg)
            scale(1.15);

        opacity:1;
    }

    100% {

        transform:
            translate3d(
                -12px,
                18px,
                0
            )
            rotate(180deg)
            scale(.8);

        opacity:.25;
    }

}


/* =====================================================
   ORBS
   ===================================================== */

@keyframes aarogyaOrbFloat {

    0% {

        transform:
            translate3d(
                -3vw,
                -2vh,
                0
            )
            scale(.85);
    }

    50% {

        transform:
            translate3d(
                4vw,
                5vh,
                0
            )
            scale(1.08);
    }

    100% {

        transform:
            translate3d(
                -2vw,
                8vh,
                0
            )
            scale(.95);
    }

}


/* =====================================================
   BUBBLES
   ===================================================== */

@keyframes aarogyaBubbleFloat {

    0% {

        transform:
            translate3d(
                0,
                0,
                0
            )
            scale(.5);

        opacity:0;
    }

    12% {

        opacity:.7;
    }

    50% {

        transform:
            translate3d(
                35px,
                -55vh,
                0
            )
            scale(1);
    }

    100% {

        transform:
            translate3d(
                -30px,
                -115vh,
                0
            )
            scale(1.2);

        opacity:0;
    }

}


/* =====================================================
   BRAIN ORBITS
   ===================================================== */

.aarogya-brain-orbits {

    position:absolute !important;

    inset:-25% !important;

    z-index:30 !important;

    pointer-events:none !important;

    transform-style:preserve-3d;

    perspective:1000px;
}

.brain-orbit {

    position:absolute;

    left:15%;
    top:15%;

    width:70%;
    height:70%;

    border-radius:50%;

    border:
        1px solid
        rgba(
            0,
            217,
            255,
            .28
        );

    transform:
        rotateX(65deg)
        rotateZ(0deg);

    animation:
        aarogyaOrbit
        12s
        linear
        infinite;
}

.brain-orbit span {

    position:absolute;

    left:50%;
    top:-4px;

    width:7px;
    height:7px;

    border-radius:50%;

    background:
        var(--aarogya-cyan);

    box-shadow:
        0 0 12px
        var(--aarogya-cyan),
        0 0 25px
        var(--aarogya-cyan);
}

.orbit-two {

    left:7%;

    top:7%;

    width:86%;
    height:86%;

    border-color:
        rgba(
            0,
            245,
            160,
            .26
        );

    transform:
        rotateX(72deg)
        rotateZ(40deg);

    animation:
        aarogyaOrbitTwo
        18s
        linear
        infinite;
}

.orbit-two span {

    background:
        var(--aarogya-emerald);

    box-shadow:
        0 0 12px
        var(--aarogya-emerald),
        0 0 25px
        var(--aarogya-emerald);
}

.orbit-three {

    left:0;

    top:0;

    width:100%;
    height:100%;

    border-color:
        rgba(
            124,
            92,
            255,
            .24
        );

    transform:
        rotateX(58deg)
        rotateZ(80deg);

    animation:
        aarogyaOrbitThree
        24s
        linear
        infinite;
}

.orbit-three span {

    background:
        var(--aarogya-violet);

    box-shadow:
        0 0 12px
        var(--aarogya-violet),
        0 0 25px
        var(--aarogya-violet);
}

.orbit-four {

    left:20%;

    top:20%;

    width:60%;
    height:60%;

    border-color:
        rgba(
            255,
            78,
            205,
            .18
        );

    transform:
        rotateX(78deg)
        rotateZ(130deg);

    animation:
        aarogyaOrbitFour
        9s
        linear
        infinite;
}

.orbit-four span {

    background:
        var(--aarogya-pink);

    box-shadow:
        0 0 12px
        var(--aarogya-pink),
        0 0 25px
        var(--aarogya-pink);
}

@keyframes aarogyaOrbit {

    to {

        transform:
            rotateX(65deg)
            rotateZ(360deg);
    }

}

@keyframes aarogyaOrbitTwo {

    to {

        transform:
            rotateX(72deg)
            rotateZ(-320deg);
    }

}

@keyframes aarogyaOrbitThree {

    to {

        transform:
            rotateX(58deg)
            rotateZ(360deg);
    }

}

@keyframes aarogyaOrbitFour {

    to {

        transform:
            rotateX(78deg)
            rotateZ(-360deg);
    }

}


/* =====================================================
   ORBITAL PARTICLES
   ===================================================== */

.brain-orbital-particles {

    position:absolute;

    inset:0;

    z-index:31;

    pointer-events:none;
}

.brain-orbital-particles span {

    position:absolute;

    left:50%;
    top:50%;

    border-radius:50%;

    animation:
        aarogyaOrbitalParticle
        7s
        linear
        infinite;
}

@keyframes aarogyaOrbitalParticle {

    0% {

        transform:
            rotate(var(--angle))
            translateX(
                var(--radius)
            )
            scale(.3);

        opacity:0;
    }

    15% {

        opacity:1;
    }

    80% {

        opacity:.8;
    }

    100% {

        transform:
            rotate(
                calc(
                    var(--angle) + 360deg
                )
            )
            translateX(
                var(--radius)
            )
            scale(1);

        opacity:0;
    }

}


/* =====================================================
   NEURAL NETWORK
   ===================================================== */

.aarogya-neural-system {

    position:absolute;

    inset:-12%;

    z-index:25;

    pointer-events:none;

    opacity:.55;
}

.aarogya-neural-system svg {

    width:100%;
    height:100%;
}

.aarogya-neural-system line {

    stroke:
        rgba(
            0,
            217,
            255,
            .35
        );

    stroke-width:.35;

    stroke-dasharray:
        1 2;

    animation:
        aarogyaNeuralFlow
        4s
        linear
        infinite;
}

.aarogya-neural-system circle {

    fill:
        var(--aarogya-emerald);

    filter:
        drop-shadow(
            0 0 5px
            var(--aarogya-emerald)
        );

    animation:
        aarogyaNodePulse
        1.8s
        ease-in-out
        infinite
        alternate;
}

@keyframes aarogyaNeuralFlow {

    to {
        stroke-dashoffset:-20;
    }

}

@keyframes aarogyaNodePulse {

    from {
        opacity:.25;
        r:1;
    }

    to {
        opacity:1;
        r:1.5;
    }

}


/* =====================================================
   SCANNER
   ===================================================== */

.aarogya-brain-scanner {

    position:absolute;

    left:5%;
    right:5%;

    top:0;

    height:2px;

    z-index:40;

    background:
        linear-gradient(
            90deg,
            transparent,
            var(--aarogya-emerald),
            var(--aarogya-cyan),
            transparent
        );

    box-shadow:
        0 0 12px
        var(--aarogya-cyan);

    animation:
        aarogyaScanner
        4s
        ease-in-out
        infinite;
}

@keyframes aarogyaScanner {

    0% {

        transform:
            translateY(-120%);

        opacity:0;
    }

    15% {
        opacity:1;
    }

    80% {
        opacity:.8;
    }

    100% {

        transform:
            translateY(120%);

        opacity:0;
    }

}


/* =====================================================
   CARD TILT
   ===================================================== */

.card,
.feature-card,
.stat-card,
.team-card,
.project-card,
.report-card,
.history-card,
.info-card,
.prediction-card,
.upload-card,
.result-card {

    transform-style:preserve-3d;

    will-change:
        transform;
}


/* =====================================================
   BUTTON
   ===================================================== */

.btn,
.primary-btn,
.primary-action,
.secondary-btn,
.secondary-action,
.analyze-btn,
.cta-btn {

    will-change:
        transform;
}


/* =====================================================
   PAGE ENTRANCE
   ===================================================== */

body.aarogya-ready {

    animation:
        aarogyaPageEntrance
        .8s
        cubic-bezier(
            .22,
            1,
            .36,
            1
        )
        both;
}

@keyframes aarogyaPageEntrance {

    from {

        opacity:0;

        transform:
            translateY(12px);

        filter:
            blur(4px);
    }

    to {

        opacity:1;

        transform:
            translateY(0);

        filter:
            blur(0);
    }

}


/* =====================================================
   PAGE EXIT
   ===================================================== */

body.page-exiting {

    animation:
        aarogyaPageExit
        .42s
        ease
        forwards;

    pointer-events:none;
}

@keyframes aarogyaPageExit {

    to {

        opacity:0;

        transform:
            translateY(-10px);

        filter:
            blur(4px);
    }

}


/* =====================================================
   THEME TRANSITION
   ===================================================== */

body.theme-transitioning,
body.theme-transitioning * {

    transition:
        background .7s ease !important,
        background-color .7s ease !important,
        color .7s ease !important,
        border-color .7s ease !important,
        box-shadow .7s ease !important,
        fill .7s ease !important,
        stroke .7s ease !important;
}


/* =====================================================
   PARTICLE BURST
   ===================================================== */

@keyframes aarogyaBurst {

    from {

        opacity:1;

        transform:
            translate3d(
                0,
                0,
                0
            )
            scale(1);
    }

    to {

        opacity:0;

        transform:
            translate3d(
                var(--burst-x),
                var(--burst-y),
                0
            )
            scale(.05);
    }

}


/* =====================================================
   GLOBAL HUD
   ===================================================== */

.aarogya-global-hud {

    position:fixed;

    inset:0;

    pointer-events:none;

    opacity:.35;
}

.hud-corner {

    position:absolute;

    width:32px;
    height:32px;

    border-color:
        rgba(
            0,
            217,
            255,
            .35
        );

    border-style:solid;
}

.hud-tl {

    top:75px;
    left:20px;

    border-width:
        1px 0 0 1px;
}

.hud-tr {

    top:75px;
    right:20px;

    border-width:
        1px 1px 0 0;
}

.hud-bl {

    bottom:20px;
    left:20px;

    border-width:
        0 0 1px 1px;
}

.hud-br {

    bottom:20px;
    right:20px;

    border-width:
        0 1px 1px 0;
}

.hud-cross {

    position:absolute;

    color:
        rgba(
            0,
            217,
            255,
            .4
        );

    font-size:14px;
}

.hud-c1 {

    top:100px;
    left:50%;
}

.hud-c2 {

    right:45px;
    top:50%;
}

.hud-line {

    position:absolute;

    height:1px;

    background:
        linear-gradient(
            90deg,
            transparent,
            rgba(
                0,
                217,
                255,
                .25
            ),
            transparent
        );
}

.hud-l1 {

    top:120px;
    left:25%;
    right:25%;
}

.hud-l2 {

    bottom:50px;
    left:35%;
    right:35%;
}


/* =====================================================
   LOADER
   ===================================================== */

.page-loader,
.aarogya-loader {

    position:fixed !important;

    inset:0 !important;

    z-index:999999 !important;

    display:flex !important;

    flex-direction:column !important;

    align-items:center !important;

    justify-content:center !important;

    background:
        radial-gradient(
            circle at center,
            rgba(
                0,
                217,
                255,
                .08
            ),
            transparent 40%
        ),
        #020A12 !important;

    color:#fff;

    transition:
        opacity .55s ease,
        visibility .55s ease !important;
}

.page-loader.loaded {

    opacity:0 !important;

    visibility:hidden !important;

    pointer-events:none !important;
}

.loader-core-wrap {

    position:relative;

    width:120px;
    height:120px;

    display:grid;

    place-items:center;
}

.loader-core {

    width:58px;
    height:58px;

    display:grid;

    place-items:center;

    border-radius:50%;

    background:
        linear-gradient(
            135deg,
            #00F5A0,
            #00D9FF
        );

    color:#00130e;

    font-weight:900;

    box-shadow:
        0 0 35px
        rgba(
            0,
            217,
            255,
            .55
        );
}

.loader-ring {

    position:absolute;

    inset:0;

    border-radius:50%;

    border:
        1px solid
        rgba(
            0,
            217,
            255,
            .25
        );
}

.ring-a {

    animation:
        loaderSpin
        2s
        linear
        infinite;
}

.ring-b {

    inset:10px;

    border-color:
        rgba(
            0,
            245,
            160,
            .3
        );

    animation:
        loaderSpin
        3s
        linear
        reverse
        infinite;
}

.ring-c {

    inset:22px;

    border-color:
        rgba(
            124,
            92,
            255,
            .35
        );

    animation:
        loaderSpin
        4s
        linear
        infinite;
}

.loader-title {

    margin-top:25px;

    font-size:14px;

    font-weight:900;

    letter-spacing:.2em;
}

.loader-subtitle {

    margin-top:7px;

    font-size:10px;

    opacity:.55;
}

.loader-progress {

    width:180px;

    height:2px;

    margin-top:18px;

    overflow:hidden;

    background:
        rgba(
            255,
            255,
            255,
            .08
        );
}

.loader-progress span {

    display:block;

    width:40%;

    height:100%;

    background:
        linear-gradient(
            90deg,
            #00F5A0,
            #00D9FF
        );

    animation:
        loaderProgress
        1.4s
        ease-in-out
        infinite;
}

@keyframes loaderSpin {

    to {
        transform:
            rotate(360deg);
    }

}

@keyframes loaderProgress {

    from {
        transform:
            translateX(-150%);
    }

    to {
        transform:
            translateX(400%);
    }

}


/* =====================================================
   MOBILE
   ===================================================== */

@media(max-width:768px) {

    .aarogya-global-hud {

        opacity:.18;
    }

    .aarogya-neural-system {

        opacity:.28;
    }

    .aarogya-brain-orbits {

        inset:-18%;
    }

    .aarogya-orb-field {

        opacity:.75;
    }

}


/* =====================================================
   IMPORTANT:
   NO prefers-reduced-motion animation override.
   This prevents the previous 0.01s bug.
   ===================================================== */

`;

    document.head.appendChild(
        style
    );

}


/* =========================================================
   RANDOM HELPER
   ========================================================= */

function randomItem(
    array
) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AarogyaApp = {

    version:
        "AarogyaDrishti Premium Motion Engine",

    refresh() {

        location.reload();

    },

    scrollTop() {

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    },

    theme(
        mode
    ) {

        if (
            mode === "light"
        ) {

            document.body.classList.add(
                "light-mode"
            );

            localStorage.setItem(
                AAROGYA_CONFIG.themeKey,
                "light"
            );

        } else {

            document.body.classList.remove(
                "light-mode"
            );

            localStorage.setItem(
                AAROGYA_CONFIG.themeKey,
                "dark"
            );

        }

        updateThemeUI();

    }

};

/* =========================================================
   AAROGYADRISHTI — PREMIUM MONO TECH EFFECT OVERRIDE
   Clean White / Silver / Subtle Cyan
========================================================= */

(function premiumMonoTechMode() {

    const style = document.createElement("style");

    style.id = "aarogya-mono-tech-override";

    style.textContent = `

    /* =====================================================
       GLOBAL EFFECT COLORS
    ===================================================== */

    .aarogya-particle-field,
    .aarogya-glow-particles,
    .aarogya-star-field,
    .aarogya-bubble-field {

        filter:
            saturate(.35)
            brightness(1.15);

    }


    /* =====================================================
       FALLING PARTICLES
       Mostly white / silver
    ===================================================== */

    .tech-particle {

        background:
            rgba(255,255,255,.92) !important;

        box-shadow:
            0 0 5px
            rgba(255,255,255,.75),

            0 0 12px
            rgba(210,240,245,.35) !important;

        opacity:
            .48 !important;

    }


    /* =====================================================
       GLOW PARTICLES
       Soft white points
    ===================================================== */

    .glow-particle {

        background:
            rgba(245,252,255,.85) !important;

        box-shadow:
            0 0 7px
            rgba(255,255,255,.65),

            0 0 18px
            rgba(190,235,240,.25) !important;

        opacity:
            .32 !important;

    }


    /* =====================================================
       FLOATING STARS
    ===================================================== */

    .tech-star {

        color:
            rgba(255,255,255,.72) !important;

        text-shadow:
            0 0 6px
            rgba(255,255,255,.55),

            0 0 14px
            rgba(190,235,240,.2) !important;

        opacity:
            .42 !important;

    }


    /* =====================================================
       FLOATING ORBS
       Frosted white glass
    ===================================================== */

    .floating-orb {

        background:
            radial-gradient(
                circle at 35% 30%,

                rgba(255,255,255,.18),

                rgba(220,245,248,.08)
                35%,

                rgba(120,210,220,.025)
                65%,

                transparent 76%
            ) !important;

        border:
            1px solid
            rgba(255,255,255,.10);

        box-shadow:
            inset 0 0 25px
            rgba(255,255,255,.06),

            0 0 35px
            rgba(210,240,245,.06) !important;

        filter:
            blur(1px) !important;

    }


    /* =====================================================
       BUBBLES
    ===================================================== */

    .floating-bubble {

        border:
            1px solid
            rgba(255,255,255,.18) !important;

        background:
            radial-gradient(
                circle at 30% 25%,

                rgba(255,255,255,.20),

                rgba(255,255,255,.035)
            ) !important;

        box-shadow:

            inset 0 0 10px
            rgba(255,255,255,.12),

            0 0 15px
            rgba(255,255,255,.07) !important;

    }


    /* =====================================================
       ORBITAL RINGS AROUND FLOATING ORBS
    ===================================================== */

    .aarogya-orb-field::before,
    .aarogya-orb-field::after {

        content:"";

        position:absolute;

        left:50%;
        top:50%;

        width:230px;
        height:90px;

        transform:
            translate(-50%,-50%)
            rotateX(65deg);

        border-radius:50%;

        border:
            1px solid
            rgba(255,255,255,.10);

        box-shadow:
            0 0 18px
            rgba(190,235,240,.06);

        animation:
            aarogyaOrbitalRing
            12s
            linear
            infinite;

        pointer-events:none;

    }


    .aarogya-orb-field::after {

        width:330px;
        height:120px;

        transform:
            translate(-50%,-50%)
            rotateX(67deg)
            rotateZ(55deg);

        border-color:
            rgba(0,217,255,.08);

        animation-duration:
            18s;

        animation-direction:
            reverse;

    }


    @keyframes aarogyaOrbitalRing {

        from {

            transform:
                translate(-50%,-50%)
                rotateX(65deg)
                rotateZ(0deg);

        }

        to {

            transform:
                translate(-50%,-50%)
                rotateX(65deg)
                rotateZ(360deg);

        }

    }


    /* =====================================================
       FALLING BROKEN STAR / TECH SHARDS
    ===================================================== */

    .aarogya-tech-shard {

        position:fixed !important;

        width:8px !important;

        height:2px !important;

        background:
            linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.95),
                transparent
            ) !important;

        border-radius:999px !important;

        box-shadow:
            0 0 7px
            rgba(255,255,255,.65) !important;

        pointer-events:none !important;

        z-index:9994 !important;

        transform:
            rotate(-28deg);

        animation:
            aarogyaShardFall
            var(--shard-duration)
            linear
            var(--shard-delay)
            infinite;

    }


    @keyframes aarogyaShardFall {

        0% {

            transform:
                translate3d(
                    0,
                    -40px,
                    0
                )
                rotate(-28deg)
                scale(.4);

            opacity:0;

        }

        8% {

            opacity:.65;

        }

        45% {

            transform:
                translate3d(
                    35px,
                    48vh,
                    0
                )
                rotate(35deg)
                scale(1);

            opacity:.5;

        }

        80% {

            opacity:.25;

        }

        100% {

            transform:
                translate3d(
                    -25px,
                    110vh,
                    0
                )
                rotate(140deg)
                scale(.25);

            opacity:0;

        }

    }


    /* =====================================================
       MICRO TECH CROSS / SHARD
    ===================================================== */

    .aarogya-tech-cross {

        position:fixed !important;

        width:7px !important;

        height:7px !important;

        pointer-events:none !important;

        z-index:9993 !important;

        opacity:.35;

    }

    .aarogya-tech-cross::before,
    .aarogya-tech-cross::after {

        content:"";

        position:absolute;

        left:50%;
        top:50%;

        width:100%;
        height:1px;

        background:
            rgba(255,255,255,.8);

        box-shadow:
            0 0 5px
            rgba(255,255,255,.45);

    }

    .aarogya-tech-cross::after {

        transform:
            translate(-50%,-50%)
            rotate(90deg);

    }

    .aarogya-tech-cross::before {

        transform:
            translate(-50%,-50%);

    }


    /* =====================================================
       BRAIN ORBITS — WHITE / CYAN ONLY
    ===================================================== */

    .brain-orbit {

        border-color:
            rgba(255,255,255,.16) !important;

        box-shadow:
            0 0 12px
            rgba(255,255,255,.035);

    }

    .brain-orbit span {

        background:
            rgba(255,255,255,.9) !important;

        box-shadow:
            0 0 8px
            rgba(255,255,255,.7),

            0 0 18px
            rgba(150,230,240,.25) !important;

    }

    .orbit-two {

        border-color:
            rgba(0,217,255,.13) !important;

    }

    .orbit-two span {

        background:
            rgba(210,250,255,.9) !important;

    }

    .orbit-three {

        border-color:
            rgba(255,255,255,.10) !important;

    }

    .orbit-four {

        border-color:
            rgba(255,255,255,.08) !important;

    }


    /* =====================================================
       NEURAL NETWORK
    ===================================================== */

    .aarogya-neural-system {

        opacity:
            .30 !important;

    }

    .aarogya-neural-system line {

        stroke:
            rgba(220,245,248,.28) !important;

    }

    .aarogya-neural-system circle {

        fill:
            rgba(245,255,255,.8) !important;

        filter:
            drop-shadow(
                0 0 5px
                rgba(255,255,255,.5)
            ) !important;

    }


    /* =====================================================
       SCANNER
    ===================================================== */

    .aarogya-brain-scanner {

        background:
            linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.55),
                rgba(0,217,255,.35),
                transparent
            ) !important;

        box-shadow:
            0 0 10px
            rgba(220,250,255,.35) !important;

        opacity:
            .55 !important;

    }


    /* =====================================================
       HUD
    ===================================================== */

    .aarogya-global-hud {

        opacity:
            .20 !important;

    }

    .hud-corner {

        border-color:
            rgba(255,255,255,.18) !important;

    }

    .hud-cross {

        color:
            rgba(255,255,255,.25) !important;

    }

    .hud-line {

        background:
            linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.15),
                transparent
            ) !important;

    }

    `;

    document.head.appendChild(style);


    /* =====================================================
       CREATE BROKEN STAR PARTICLES
    ===================================================== */

    const shardField =
        document.createElement("div");

    shardField.className =
        "aarogya-shard-field";

    shardField.setAttribute(
        "aria-hidden",
        "true"
    );

    shardField.style.cssText = `
        position:fixed;
        inset:0;
        width:100vw;
        height:100vh;
        pointer-events:none;
        overflow:hidden;
        z-index:9994;
    `;

    const shardCount =
        window.innerWidth < 768
            ? 8
            : 18;

    for (
        let i = 0;
        i < shardCount;
        i++
    ) {

        const shard =
            document.createElement("span");

        shard.className =
            "aarogya-tech-shard";

        shard.style.left =
            `${Math.random() * 100}%`;

        shard.style.top =
            `${Math.random() * -100}px`;

        shard.style.setProperty(
            "--shard-duration",
            `${7 + Math.random() * 10}s`
        );

        shard.style.setProperty(
            "--shard-delay",
            `${Math.random() * -15}s`
        );

        shard.style.width =
            `${5 + Math.random() * 9}px`;

        shardField.appendChild(
            shard
        );

    }

    document.body.appendChild(
        shardField
    );


    /* =====================================================
       SMALL TECH CROSSES
    ===================================================== */

    const crossField =
        document.createElement("div");

    crossField.className =
        "aarogya-cross-field";

    crossField.style.cssText = `
        position:fixed;
        inset:0;
        width:100vw;
        height:100vh;
        pointer-events:none;
        overflow:hidden;
        z-index:9993;
    `;

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const cross =
            document.createElement("span");

        cross.className =
            "aarogya-tech-cross";

        cross.style.left =
            `${Math.random() * 100}%`;

        cross.style.top =
            `${Math.random() * 100}%`;

        cross.style.animation =
            `
            aarogyaStarFloat
            ${8 + Math.random() * 8}s
            ease-in-out
            ${Math.random() * -10}s
            infinite
            alternate
            `;

        crossField.appendChild(
            cross
        );

    }

    document.body.appendChild(
        crossField
    );


    console.log(
        "%cPremium Mono-Tech Visual Mode Enabled",
        "color:#ffffff;background:#071018;padding:6px 12px;border-radius:6px;font-weight:bold;"
    );

})();

/* =========================================================
   AAROGYADRISHTI — CALM PREMIUM MOTION
   Fewer particles + slower movement
========================================================= */

(function calmPremiumMotion() {

    const style = document.createElement("style");

    style.id = "aarogya-calm-motion";

    style.textContent = `

    /* -----------------------------------------
       FALLING TECH PARTICLES
       slower + dimmer
    ----------------------------------------- */

    .tech-particle {

        opacity: .30 !important;

        animation-duration:
            22s !important;

    }


    /* -----------------------------------------
       GLOW PARTICLES
    ----------------------------------------- */

    .glow-particle {

        opacity: .18 !important;

        animation-duration:
            18s !important;

    }


    /* -----------------------------------------
       STARS
    ----------------------------------------- */

    .tech-star {

        opacity: .22 !important;

        animation-duration:
            20s !important;

    }


    /* -----------------------------------------
       BUBBLES
    ----------------------------------------- */

    .floating-bubble {

        opacity: .28 !important;

        animation-duration:
            28s !important;

    }


    /* -----------------------------------------
       ORBS
       Very slow movement
    ----------------------------------------- */

    .floating-orb {

        opacity: .55 !important;

        animation-duration:
            35s !important;

    }


    /* -----------------------------------------
       BRAIN ORBIT
       Slow elegant rotation
    ----------------------------------------- */

    .brain-orbit {

        animation-duration:
            28s !important;

    }

    .orbit-two {

        animation-duration:
            36s !important;

    }

    .orbit-three {

        animation-duration:
            45s !important;

    }

    .orbit-four {

        animation-duration:
            32s !important;

    }


    /* -----------------------------------------
       ORBITAL PARTICLES
    ----------------------------------------- */

    .brain-orbital-particles span {

        opacity: .35 !important;

        animation-duration:
            18s !important;

    }


    /* -----------------------------------------
       NEURAL NETWORK
    ----------------------------------------- */

    .aarogya-neural-system {

        opacity: .18 !important;

    }


    /* -----------------------------------------
       HUD
    ----------------------------------------- */

    .aarogya-global-hud {

        opacity: .12 !important;

    }


    /* -----------------------------------------
       SCANNER
    ----------------------------------------- */

    .aarogya-brain-scanner {

        opacity: .30 !important;

        animation-duration:
            8s !important;

    }


    /* -----------------------------------------
       BROKEN STAR / SHARDS
       Very few + very slow
    ----------------------------------------- */

    .aarogya-shard-field {

        opacity: .35 !important;

    }

    .aarogya-tech-shard {

        opacity: .28 !important;

        animation-duration:
            18s !important;

    }


    /* -----------------------------------------
       TECH CROSSES
    ----------------------------------------- */

    .aarogya-cross-field {

        opacity: .22 !important;

    }

    `;

    document.head.appendChild(style);


    /* =====================================================
       REMOVE MOST OF THE EXISTING STARS
    ===================================================== */

    const stars =
        document.querySelectorAll(
            ".tech-star"
        );

    stars.forEach(
        (star, index) => {

            if (
                index % 3 !== 0
            ) {

                star.style.display =
                    "none";

            }

        }
    );


    /* =====================================================
       REMOVE MOST FALLING SHARDS
    ===================================================== */

    const shards =
        document.querySelectorAll(
            ".aarogya-tech-shard"
        );

    shards.forEach(
        (shard, index) => {

            if (
                index % 3 !== 0
            ) {

                shard.style.display =
                    "none";

            }

        }
    );


    /* =====================================================
       REMOVE MOST TECH CROSSES
    ===================================================== */

    const crosses =
        document.querySelectorAll(
            ".aarogya-tech-cross"
        );

    crosses.forEach(
        (cross, index) => {

            if (
                index % 2 !== 0
            ) {

                cross.style.display =
                    "none";

            }

        }
    );


    /* =====================================================
       REMOVE MOST BUBBLES
    ===================================================== */

    const bubbles =
        document.querySelectorAll(
            ".floating-bubble"
        );

    bubbles.forEach(
        (bubble, index) => {

            if (
                index % 2 !== 0
            ) {

                bubble.style.display =
                    "none";

            }

        }
    );


    console.log(
        "%cAarogyaDrishti Calm Premium Motion Enabled",
        "color:#fff;background:#071018;padding:6px 12px;border-radius:6px;font-weight:bold;"
    );

})();
/* =========================================================
   END
   ========================================================= */