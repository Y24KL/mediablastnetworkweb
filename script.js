document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Preloader Removal
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    });

    // 2. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        const icon = themeBtn.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // 3. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObserver.observe(el));

    // 4. Live Viewer Simulation
    const countEl = document.getElementById('count');
    let baseCount = 18540;
    setInterval(() => {
        const fluctuation = Math.floor(Math.random() * 40) - 20;
        baseCount += fluctuation;
        countEl.innerText = baseCount.toLocaleString();
    }, 4000);

    // 5. Blog Data & Filtering
    const blogData = [
        { title: "Future of 8K Streaming", cat: "tech", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" },
        { title: "Unfiltered News: Middle East", cat: "media", img: "https://images.unsplash.com/photo-1504711432869-5d592f239cff?auto=format&fit=crop&q=80&w=600" },
        { title: "Mediablasst Originals: 2026", cat: "media", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600" }
    ];

    const blogGrid = document.getElementById('blogGrid');
    
    function renderBlog(filter = 'all', search = '') {
        blogGrid.innerHTML = '';
        const filtered = blogData.filter(item => {
            const matchesFilter = filter === 'all' || item.cat === filter;
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card glass';
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${post.img}')"></div>
                <div class="card-body">
                    <h3>${post.title}</h3>
                    <p>Latest insights from our digital newsroom.</p>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    }

    // Initial Blog Load
    renderBlog();

    // Search and Filter Listeners
    document.getElementById('blogSearch').addEventListener('input', (e) => renderBlog('all', e.target.value));
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            renderBlog(btn.dataset.filter);
        });
    });

    // 6. Carousel Logic
    const track = document.querySelector('.carousel-track');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    let scrollPos = 0;

    nextBtn.addEventListener('click', () => {
        scrollPos = Math.min(scrollPos + 350, track.scrollWidth - track.clientWidth);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    prevBtn.addEventListener('click', () => {
        scrollPos = Math.max(scrollPos - 350, 0);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    // 7. Form Validation
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        alert('Message received! Mediablasst will contact you shortly.');
        contactForm.reset();
    });
});

// Add this to your existing script.js
if (document.querySelector('.live-theater-mode')) {
    const chatContainer = document.getElementById('chat-stream');
    const users = ['DigitalArtisan', 'NewsBuff_99', 'Blasst_Fan', 'TechExplorer', 'Sarah_M'];
    const messages = [
        "Incredible coverage!",
        "Who is the guest speaker?",
        "Mediablasst quality is unmatched.",
        "Greetings from London! 🇬🇧",
        "The audio is crystal clear.",
        "Can't wait for the next segment!"
    ];

    function addChatMessage() {
        const user = users[Math.floor(Math.random() * users.length)];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg';
        msgDiv.innerHTML = `<b>${user}</b> ${msg}`;
        
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Cleanup to keep DOM light
        if (chatContainer.children.length > 25) {
            chatContainer.removeChild(chatContainer.firstChild);
        }
    }

    // New message every 3-6 seconds
    setInterval(addChatMessage, Math.random() * 3000 + 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FAST PRELOADER
    const loader = document.getElementById('loader');
    // Don't wait for 'load' (which waits for every image), hide it once the structure is ready
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 400);
    }, 500);

    // 2. THEME TOGGLE
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        const icon = themeBtn.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // 3. BLOG SYSTEM (Optimized Data)
    const blogData = [
        { title: "Future of 8K Streaming", cat: "tech", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=60&w=800" },
        { title: "Unfiltered News: Middle East", cat: "media", img: "https://images.unsplash.com/photo-1504711432869-5d592f239cff?auto=format&fit=crop&q=60&w=800" },
        { title: "Mediablasst Originals: 2026", cat: "media", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=60&w=800" }
    ];

    const blogGrid = document.getElementById('blogGrid');
    
    function renderBlog(filter = 'all', search = '') {
        if (!blogGrid) return;
        blogGrid.innerHTML = '';
        const filtered = blogData.filter(item => {
            const matchesFilter = filter === 'all' || item.cat === filter;
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card glass';
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${post.img}')"></div>
                <div class="card-body">
                    <h3>${post.title}</h3>
                    <p>Latest insights from our digital newsroom.</p>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    }

    renderBlog();

    // 4. SEARCH & FILTER
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderBlog('all', e.target.value));
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            renderBlog(btn.dataset.filter);
        });
    });

    // 5. FORMSPREE SUBMISSION (One clear version)
    const contactForm = document.getElementById("contactForm");
    const status = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            status.innerHTML = "Blasting your message...";
            
            fetch(e.target.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "Success! Message sent.";
                    status.style.color = "#00ff88";
                    contactForm.reset();
                } else {
                    status.innerHTML = "Error sending message.";
                    status.style.color = "#ff4444";
                }
            });
        });
    }

    // 6. SCROLL REVEAL (Efficiency)
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
});

// === ENHANCED MODAL WITH VIDEO PREVIEW ===
// === ENHANCED MODAL WITH VIDEO OR STATIC PICTURE PREVIEW ===
const modal = document.getElementById("programModal");
const closeModal = document.querySelector(".close-modal");

document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').innerText;
        const fullText = card.getAttribute('data-fulltext') || card.querySelector('p').innerText;
        
        const videoUrl = card.getAttribute('data-video');
        const previewImg = card.getAttribute('data-preview-img') || 
                           card.querySelector('.card-img').style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/)[1];

        // Set text
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalDescription").innerText = fullText;

        // Dynamic preview: VIDEO or PICTURE
        const previewContainer = document.getElementById("modalPreview");
        previewContainer.innerHTML = '';

        if (videoUrl) {
            // Video mode
            previewContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="${videoUrl}" 
                    title="${title} Preview" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            `;
        } else if (previewImg) {
            // Static image mode (exception)
            previewContainer.innerHTML = `
                <div class="modal-hero-img" style="background-image: url('${previewImg}')"></div>
            `;
        }

        modal.style.display = "flex";
    });
});

// Close modal + stop any video
closeModal.onclick = () => {
    modal.style.display = "none";
    document.getElementById("modalPreview").innerHTML = '';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        document.getElementById("modalPreview").innerHTML = '';
    }
};

// 2. Enhanced Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;

themeBtn.addEventListener('click', () => {
    // Add rotation animation
    const icon = themeBtn.querySelector('i');
    icon.classList.add('rotate-icon');
    
    // Toggle the themes
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');

    // Swap icons after a tiny delay for smoothness
    setTimeout(() => {
        if (body.classList.contains('light-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }, 200);

    // Remove the rotation class so it can be re-triggered later
    setTimeout(() => {
        icon.classList.remove('rotate-icon');
    }, 500);
});

// Carousel Drag/Scroll functionality (Optional)
const carousel = document.querySelector('.program-carousel');

if (carousel) {
    let isDown = false;
    let scrollLeft;
    let startX;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => isDown = false);
    carousel.addEventListener('mouseup', () => isDown = false);
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; 
        carousel.scrollLeft = scrollLeft - walk;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('programCarousel');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (carousel && nextBtn && prevBtn) {
        // Calculate the width of one card + the gap
        const getScrollAmount = () => {
            const card = carousel.querySelector('.program-card-link');
            return card.offsetWidth + 25; // 25 is the gap defined in your CSS
        };

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }
});

// Update your blogData array with these reliable links
const blogData = [
    { 
        title: "Future of 8K Streaming", 
        cat: "tech", 
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        title: "Unfiltered News: Middle East", 
        cat: "media", 
        img: "https://images.unsplash.com/photo-1504711432869-5d592f239cff?auto=format&fit=crop&q=80&w=600" 
    },
    { 
        title: "Mediablasst Originals: 2026", 
        cat: "media", 
        img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600" 
    }
];

// Ensure the render function uses the 'glass' class
function renderBlog(filter = 'all', search = '') {
    const blogGrid = document.getElementById('blogGrid');
    blogGrid.innerHTML = '';
    
    const filtered = blogData.filter(item => {
        const matchesFilter = filter === 'all' || item.cat === filter;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filtered.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card glass'; // Explicitly add glass class
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${post.img}')"></div>
            <div class="card-body">
                <span class="tag">${post.cat.toUpperCase()}</span>
                <h3>${post.title}</h3>
                <p>Latest insights from our digital newsroom.</p>
            </div>
        `;
        blogGrid.appendChild(card);
    });
}

// Locate your form submission block in script.js
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Stop the default refresh
        
        const data = new FormData(e.target);
        const status = document.getElementById("form-status");
        
        // Visual feedback that the blast is happening
        status.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Transmitting to MediaBlast Network...";
        status.style.color = "var(--primary)";

        fetch(e.target.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                // ✨ THIS IS THE LINK: Redirects to your thank-you.html
                window.location.href = "thankyou.html";
            } else {
                status.innerHTML = "Transmission Failed. Please try again.";
                status.style.color = "#ff4444";
            }
        }).catch(error => {
            status.innerHTML = "Connection Error. Check your network.";
            status.style.color = "#ff4444";
        });
    });
}

// Change this line in your script.js:
if (response.ok) {
    window.location.href = "thankyou.html"; // Removed the hyphen to match your file
}

// --- FINAL STREAM UNLOCK FIX ---
document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('live-auth-form');
    const authOverlay = document.getElementById('auth-overlay');
    const liveContent = document.getElementById('live-content');
    const ytPlayer = document.getElementById('yt-player');

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = authForm.querySelector('button');
            submitBtn.innerText = "Unlocking...";

            const formData = new FormData(authForm);
            
            try {
                const response = await fetch(authForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // 1. Hide the overlay smoothly
                    authOverlay.style.opacity = '0';
                    
                    setTimeout(() => {
                        authOverlay.style.display = 'none';
                        
                        // 2. Remove the blur by targeting the correct ID
                        if(liveContent) {
                            liveContent.classList.remove('locked');
                            liveContent.style.filter = "none"; // Hard override for the blur
                        }
                        
                        // 3. Trigger the video
                        ytPlayer.src = "https://www.youtube.com/embed/3umsy4MqUSM?autoplay=1&mute=0";
                    }, 500);
                } else {
                    alert("Submission failed. Check your Formspree ID.");
                    submitBtn.innerText = "Unlock Stream";
                }
            } catch (error) {
                alert("Connection error.");
                submitBtn.innerText = "Unlock Stream";
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('live-auth-form');
    const authOverlay = document.getElementById('auth-overlay');
    const liveContent = document.getElementById('live-content');
    const ytPlayer = document.getElementById('yt-player');

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = authForm.querySelector('button');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Unlocking...';

            const formData = new FormData(authForm);
            
            try {
                const response = await fetch(authForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // 1. Hide Overlay
                    authOverlay.classList.add('hidden');
                    
                    // 2. Unlock Content
                    if(liveContent) {
                        liveContent.classList.remove('locked');
                        liveContent.style.filter = "none"; 
                    }
                    
                    // 3. Start Video
                    // IMPORTANT: Ensure this is the EMBED URL
                    ytPlayer.src = "https://www.youtube.com/embed/3umsy4MqUSM?autoplay=1&mute=0";
                    
                } else {
                    alert("Submission failed. Please check your network.");
                    submitBtn.innerText = "Unlock Stream";
                }
            } catch (error) {
                alert("Error connecting to server.");
                submitBtn.innerText = "Unlock Stream";
            }
        });
    }
});

// REMOVE OR COMMENT OUT THIS SECTION
/*
const chatForm = document.getElementById('chat-form');
if (chatForm) {
    chatForm.addEventListener('submit', (e) => { ... });
}
*/