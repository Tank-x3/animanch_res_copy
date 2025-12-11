let lastRightClickedElement = null;

// Track the element that was right-clicked
document.addEventListener("contextmenu", (event) => {
    lastRightClickedElement = event.target;
}, true);

// Listen for the command from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_post_id_and_copy") {
        let currentElement = lastRightClickedElement;
        let postId = null;

        // Traverse up DOM to find the parent <li> with id starting with "res"
        while (currentElement) {
            if (currentElement.tagName === "LI" && currentElement.id && currentElement.id.startsWith("res")) {
                postId = currentElement.id.replace("res", "");
                break;
            }
            // Stop if we hit the body or root to prevent infinite loops (though parentElement becomes null eventually)
            if (currentElement === document.body) break;
            currentElement = currentElement.parentElement;
        }

        if (postId) {
            // Construct the clean URL
            const url = new URL(window.location.href);
            // clear existing parameters to ensure clean link
            url.search = "";
            url.searchParams.set("res", postId);

            const finalUrl = url.toString();

            // Write to clipboard
            navigator.clipboard.writeText(finalUrl).then(() => {
                console.log("AnimanchURLCopier: Copied " + finalUrl);
                // Optional: Provide visual feedback? User did not strictly request it, but it's good UX.
                // For now, keeping it invisible to follow "simple" request, relying on context menu action completing.
            }).catch(err => {
                console.error("AnimanchURLCopier: Failed to copy", err);
            });

            sendResponse({ success: true, url: finalUrl });
        } else {
            console.warn("AnimanchURLCopier: Could not find parent post element with id='res...'");
            sendResponse({ success: false, error: "Post element not found" });
        }
    }
    // Return true to indicate we might respond asynchronously (though here we responded synchronously mostly)
    // but good practice if we add async clipboard logic later.
    return true;
});
