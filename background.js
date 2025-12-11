chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "copy-animanch-res-url",
        title: "このレスのURLをコピー",
        contexts: ["all"],
        documentUrlPatterns: ["https://bbs.animanch.com/board/*"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copy-animanch-res-url") {
        if (tab && tab.id) {
            chrome.tabs.sendMessage(tab.id, { action: "get_post_id_and_copy" });
        }
    }
});
