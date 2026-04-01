// Seven Hills Yaoundé - Multi-Page Interactivity

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const burger = document.getElementById('burger-btn');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const resForm = document.getElementById('res-form');

    // --- Active Page Highlighting ---
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a, .nav-links-mobile a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Header Scroll Effect ---
    const handleScroll = () => {
        // If we are not on index.html, the header is always scrolled/solid for visibility
        if (currentPath !== "index.html") {
            header.classList.add('scrolled');
            return;
        }

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- Mobile Overlay Toggle ---
    const toggleMenu = () => {
        const isActive = mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('nav-active', isActive);
        
        // Burger Animation
        const spans = burger.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.transform = 'rotate(-45deg) translate(4px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.transform = 'none';
        }
    };

    burger.addEventListener('click', toggleMenu);

    // --- Reservation Form Handling ---
    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = resForm.querySelector('button');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'TRAITEMENT...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerText = 'EXPÉRIENCE CONFIRMÉE';
                submitBtn.style.background = '#28a745';

                setTimeout(() => {
                    resForm.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    alert('Merci pour votre réservation. Une confirmation vous sera envoyée sous peu.');
                }, 3000);
            }, 1500);
        });
    }

    // --- Reveal Animation System (High-End) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before it enters fully
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
});
