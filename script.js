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

    // --- Reservation Form Handling & Ticket Generation ---
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
                    // Extract data
                    const name = resForm.querySelector('#name').value || 'John Doe';
                    const tel = resForm.querySelector('#tel').value || '+237 --- --- ---';
                    const date = resForm.querySelector('#date').value || 'Aujourdhui';
                    const guests = resForm.querySelector('#guests').value || '2';
                    const refNum = 'SH-' + Math.random().toString(36).substr(2, 5).toUpperCase();

                    // Create or find ticket modal
                    let ticketModal = document.getElementById('ticket-modal');
                    if (ticketModal) {
                        ticketModal.remove();
                    }
                    
                    ticketModal = document.createElement('div');
                    ticketModal.className = 'ticket-modal-overlay';
                    ticketModal.id = 'ticket-modal';
                        
                        ticketModal.innerHTML = `
                            <div class="ticket-container glass">
                                <button class="close-ticket" id="close-ticket">&times;</button>
                                <div class="ticket-content" id="ticket-content" style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-md);">
                                    <div class="ticket-header">
                                        <img src="logo/logo.jpg" alt="Seven Hills Logo" class="ticket-logo">
                                        <h3>SEVEN HILLS</h3>
                                        <p>Ticket de Réservation</p>
                                    </div>
                                    <div class="ticket-body" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; flex-wrap: wrap;">
                                        <div class="ticket-details" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                            <div class="ticket-row"><span>Réf:</span> <strong id="ticket-ref"></strong></div>
                                            <div class="ticket-row"><span>Nom:</span> <strong id="ticket-name"></strong></div>
                                            <div class="ticket-row"><span>Tél:</span> <strong id="ticket-tel"></strong></div>
                                            <div class="ticket-row"><span>Date:</span> <strong id="ticket-date"></strong></div>
                                            <div class="ticket-row"><span>Invités:</span> <strong id="ticket-guests"></strong></div>
                                        </div>
                                        <div class="ticket-qr" style="background: white; padding: 0.5rem; border-radius: 8px;">
                                            <img id="qr-code-img" src="" alt="QR Code" style="width: 100px; height: 100px; display: block;">
                                        </div>
                                    </div>
                                    <div class="ticket-footer">
                                        <p>Veuillez présenter ce ticket à la réception.</p>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                                    <button class="btn btn-futuristic" id="download-ticket" style="flex: 1; font-size: 0.75rem; padding: 1rem;">Télécharger</button>
                                    <button class="btn btn-futuristic" id="print-ticket" style="flex: 1; font-size: 0.75rem; padding: 1rem;">Imprimer</button>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(ticketModal);

                        // Event Listeners for new modal
                        document.getElementById('close-ticket').addEventListener('click', () => {
                            ticketModal.classList.remove('active');
                        });
                        document.getElementById('print-ticket').addEventListener('click', () => {
                            window.print();
                        });
                        document.getElementById('download-ticket').addEventListener('click', () => {
                            if (typeof html2pdf !== 'undefined') {
                                const element = document.getElementById('ticket-content');
                                html2pdf().from(element).set({
                                    margin: [0.5, 0.5, 0.5, 0.5],
                                    filename: 'Seven_Hills_Ticket.pdf',
                                    image: { type: 'jpeg', quality: 0.98 },
                                    html2canvas: { scale: 2, useCORS: true },
                                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                                }).save().catch(err => {
                                    console.error("PDF Generation Error:", err);
                                    alert("Le téléchargement direct en PDF a rencontré une erreur (possiblement due au fait d'être ouvert localement sans serveur). Veuillez cliquer sur le bouton 'Imprimer' et choisir 'Enregistrer au format PDF'.");
                                });
                            } else {
                                alert("Le système de téléchargement est introuvable. Veuillez recharger la page ou utiliser le bouton Imprimer et faire 'Sauvegarder en PDF'.");
                            }
                        });

                    // Populate ticket details
                    document.getElementById('ticket-ref').innerText = refNum;
                    document.getElementById('ticket-name').innerText = name;
                    document.getElementById('ticket-tel').innerText = tel;
                    document.getElementById('ticket-date').innerText = date;
                    document.getElementById('ticket-guests').innerText = guests + (guests > 1 ? ' Personnes' : ' Personne');
                    
                    // Set QR Code
                    const verifyUrl = encodeURIComponent(`https://sevenhills.cm/verify?ref=${refNum}`);
                    document.getElementById('qr-code-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${verifyUrl}`;

                    // Reset Form
                    resForm.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    
                    // Show Ticket
                    ticketModal.classList.add('active');
                }, 2000);
            }, 1000);
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
