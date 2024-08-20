// Typing Effect
let i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;

// Typerwrite text content. Use a pipe to indicate the start of the second line "|".
const textArray = [
    "歡迎來到 2024 六系聯合宿營|讓我們以一段前導片深入了解這件案件！",
];

// Speed (in milliseconds) of typing.
const speedForward = 100, // Typing Speed
    speedWait = 3000, // Wait between typing and backspacing
    speedBetweenLines = 500, // Wait between first and second lines
    speedBackspace = 25; // Backspace Speed

// Run the loop when the document is ready
$(document).ready(function () {
    typeWriter("output", textArray);
});

function typeWriter(id, ar) {
    const element = $("#" + id),
        aString = ar[a],
        eHeader = element.children("h1"), // Header element
        eParagraph = element.children("p"); // Subheader element

    // Determine if animation should be typing or backspacing
    if (!isBackspacing) {
        // If full string hasn't yet been typed out, continue typing
        if (i < aString.length) {
            // If character about to be typed is a pipe, switch to second line and continue.
            if (aString.charAt(i) === "|") {
                isParagraph = true;
                eHeader.removeClass("cursor");
                eParagraph.addClass("cursor");
                i++;
                setTimeout(() => {
                    typeWriter(id, ar);
                }, speedBetweenLines);

                // If character isn't a pipe, continue typing.
            } else {
                // Type header or subheader depending on whether pipe has been detected
                if (!isParagraph) {
                    eHeader.text(eHeader.text() + aString.charAt(i));
                } else {
                    eParagraph.text(eParagraph.text() + aString.charAt(i));
                }
                i++;
                setTimeout(() => {
                    typeWriter(id, ar);
                }, speedForward);
            }

            // If full string has been typed, switch to backspace mode.
        } else if (i === aString.length) {
            isBackspacing = true;
            setTimeout(() => {
                typeWriter(id, ar);
            }, speedWait);
        }

        // If backspacing is enabled
    } else {
        // If either the header or the paragraph still has text, continue backspacing
        if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
            // If paragraph still has text, continue erasing, otherwise switch to the header.
            if (eParagraph.text().length > 0) {
                eParagraph.text(
                    eParagraph.text().substring(0, eParagraph.text().length - 1)
                );
            } else if (eHeader.text().length > 0) {
                eParagraph.removeClass("cursor");
                eHeader.addClass("cursor");
                eHeader.text(
                    eHeader.text().substring(0, eHeader.text().length - 1)
                );
            }
            setTimeout(() => {
                typeWriter(id, ar);
            }, speedBackspace);

            // If neither head or paragraph still has text, switch to next quote in array and start typing.
        } else {
            isBackspacing = false;
            i = 0;
            isParagraph = false;
            a = (a + 1) % ar.length; // Moves to next position in array, always looping back to 0
            setTimeout(() => {
                typeWriter(id, ar);
            }, 50);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const titles = document.querySelectorAll(".event-title");
    const contents = document.querySelectorAll(".event-content");

    function activateEvent(eventType) {
        // Remove active class from all titles and contents
        titles.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.remove("active"));

        // Add active class to the selected title and corresponding content
        const activeTitle = document.querySelector(
            `.event-title[data-event="${eventType}"]`
        );
        const activeContent = document.querySelector(
            `.event-content[data-event="${eventType}"]`
        );

        if (activeTitle && activeContent) {
            activeTitle.classList.add("active");
            activeContent.classList.add("active");
        }
    }

    titles.forEach((title) => {
        title.addEventListener("click", function () {
            const eventType = this.getAttribute("data-event");
            activateEvent(eventType);
        });

        title.addEventListener("mouseenter", function () {
            const eventType = this.getAttribute("data-event");
            activateEvent(eventType);
        });
    });

    // Activate the first event by default
    activateEvent(titles[0].getAttribute("data-event"));
});
