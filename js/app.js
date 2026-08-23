// Welcome Message

console.log("Welcome to EduTrack");

// Current Year in Footer

const year = new Date().getFullYear();

const footer = document.querySelector("footer p");

if (footer) {
    footer.innerHTML = `© ${year} EduTrack`;
}

