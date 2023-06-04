chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, "toggle", (res) => {
        if (chrome.runtime.lastError) {
            console.log("Error Happended!", res)
        }
        return true
    })
})


// Check if tabs have changed and actions need to be fetched again
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.tabs.sendMessage(tabId, { tab_url: tab.url })
})