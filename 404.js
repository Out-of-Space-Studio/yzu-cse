const typedSpan = document.getElementById("typed");
const cursorSpan = document.querySelector(".cursor");
const textArray = [
    "The page you were looking for could not be found...",
    "Oops! It looks like you're lost...",
    "Sorry about that...",
    "Let me try and help...",
];

const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing"))
            cursorSpan.classList.add("typing");
        typedSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing"))
            cursorSpan.classList.add("typing");
        typedSpan.textContent = textArray[textArrayIndex].substring(
            0,
            charIndex - 1
        );
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});
