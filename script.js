// Navbar smooth scrolling

const navLinks = document.querySelectorAll("nav a");

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

// Contact form validation

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = contactForm.querySelector('input[type="text"]').value.trim();
    const phone = contactForm.querySelector('input[type="tel"]').value.trim();
    const plan = contactForm.querySelector("select").value;

    // Check name
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    // Check phone
    if (phone === "") {
        alert("Please enter your phone number.");
        return;
    }

    // Check phone length
    if (phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    // Check membership plan
    if (plan === "") {
        alert("Please select a membership plan.");
        return;
    }

    const successMessage = document.querySelector("#successMessage");

successMessage.textContent = "Your enquiry has been submitted successfully! 💪";

contactForm.reset();

});

const membershipButtons = document.querySelectorAll(".membership-btn");
const membershipSelect = document.querySelector(".contact-form select");

membershipButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        const selectedPlan = button.getAttribute("data-plan");

        membershipSelect.value = selectedPlan;

        document.querySelector("#contact").scrollIntoView({
            behavior: "smooth"
        });

    });

});