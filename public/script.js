// Navbar smooth scrolling

const navLinks = document.querySelectorAll("nav a, .footer-links a");

navLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// Join Now button

const joinButton = document.querySelector(".join-btn");
const membershipSection = document.querySelector("#membership");

joinButton.addEventListener("click", function() {
    membershipSection.scrollIntoView({
        behavior: "smooth"
    });
});

// Hero buttons

const startButton = document.querySelector(".hero-btn");
const exploreButton = document.querySelector(".secondary-btn");

const contactSection = document.querySelector("#contact");
const programsSection = document.querySelector("#programs");


// Start Today → Contact section

startButton.addEventListener("click", function() {
    contactSection.scrollIntoView({
        behavior: "smooth"
    });
});


// Explore Programs → Programs section

exploreButton.addEventListener("click", function() {
    programsSection.scrollIntoView({
        behavior: "smooth"
    });
});


 // Contact form validation and MongoDB submission

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = contactForm.querySelector('input[type="text"]').value.trim();
    const phone = contactForm.querySelector('input[type="tel"]').value.trim();
    const plan = contactForm.querySelector("select").value;
    const message = contactForm.querySelector("textarea").value.trim();
    const successMessage = document.querySelector("#successMessage");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    if (plan === "") {
        alert("Please select a membership plan.");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    successMessage.textContent = "";

    try {
        const response = await fetch("/api/enquiries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                plan: plan,
                message: message
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not submit enquiry.");
        }

        successMessage.textContent =
            "Your enquiry has been submitted successfully! 💪";

        contactForm.reset();

    } catch (error) {
        console.error("Form submission error:", error);
        successMessage.textContent =
            "Could not submit your enquiry. Please try again.";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }
});