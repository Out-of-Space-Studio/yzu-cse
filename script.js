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
