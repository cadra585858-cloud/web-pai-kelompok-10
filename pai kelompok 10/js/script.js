document.addEventListener("DOMContentLoaded", function () {

    // 1. MOBILE MENU
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");

    function closeMenu() {
        if (!menu || !menuToggle) return;
        menu.classList.remove("show");
        menuToggle.classList.remove("active");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu");
    }

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = menu.classList.toggle("show");
            menuToggle.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && menu.classList.contains("show")) {
                closeMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth >= 768) {
                closeMenu();
            }
        });
    }

    // 2. SCROLL REVEAL ANIMATION
    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: 0.15 }
        );

        reveals.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        reveals.forEach(function (element) {
            element.classList.add("show");
        });
    }

    // 3. ANIMASI COUNTER ANGKA STATISTIK
    const counters = document.querySelectorAll(".counter");
    if ("IntersectionObserver" in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute("data-target"), 10);
                    const duration = 1500;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.floor(easeProgress * target);

                        counter.textContent = currentVal.toLocaleString("id-ID");

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString("id-ID");
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(function (c) {
            counterObserver.observe(c);
        });
    }

    // 4. PROGRESS BAR & BACK TO TOP
    const progressBar = document.getElementById("progressBar");
    const backToTop = document.getElementById("backToTop");

    function updateScrollUI() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = progress + "%";
        }

        if (backToTop) {
            backToTop.classList.toggle("show", scrollTop > 350);
        }
    }

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 5. ACTIVE NAVIGATION (Scroll Spy)
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");

    function updateActiveNav() {
        let currentId = "";
        const scrollPosition = window.scrollY + window.innerHeight * 0.4;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentId = section.id;
            }
        });

        if (currentId) {
            navLinks.forEach(function (link) {
                const isActive = link.getAttribute("href") === "#" + currentId;
                link.classList.toggle("active", isActive);
            });
        }
    }

    // 6. LIGHTBOX PREVIEW FOTO DOKUMENTASI
    const galleryCards = document.querySelectorAll(".gallery-card");
    const photoModal = document.getElementById("photoModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    const closeModal = document.getElementById("closeModal");

    function openPhotoModal(src, caption) {
        if (!photoModal || !modalImg) return;
        modalImg.src = src;
        if (modalCaption) modalCaption.textContent = caption || "Dokumentasi Sedekah Bumi";
        photoModal.classList.remove("hidden");
        photoModal.classList.add("flex");
    }

    function hidePhotoModal() {
        if (!photoModal) return;
        photoModal.classList.add("hidden");
        photoModal.classList.remove("flex");
        if (modalImg) modalImg.src = "";
    }

    galleryCards.forEach(function (card) {
        card.addEventListener("click", function () {
            const imgEl = card.querySelector("img");
            const imgSrc = card.getAttribute("data-img");
            const caption = card.getAttribute("data-caption");

            if (imgEl && imgEl.style.display !== "none" && imgSrc) {
                openPhotoModal(imgSrc, caption);
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener("click", hidePhotoModal);
    }

    if (photoModal) {
        photoModal.addEventListener("click", function (e) {
            if (e.target === photoModal) hidePhotoModal();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && photoModal && !photoModal.classList.contains("hidden")) {
            hidePhotoModal();
        }
    });

    function handleScroll() {
        updateScrollUI();
        updateActiveNav();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

});