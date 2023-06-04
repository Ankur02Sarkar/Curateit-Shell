const iframe = document.createElement('iframe');
const snackbar = document.createElement('div');
const divWrapperCurateit = document.createElement("div")

chrome.runtime.onMessage.addListener((msg, sender, cb) => {
    try {
        if (typeof msg === "object" && (msg.type === "USER_LOGIN" || msg.type === "CHECK_GEM_URL")) {
            checkURL()
        }

        if (msg === "toggle") {
            window.panelToggle();
        }
        if (typeof msg === "object" && msg.type === "CT_CLOSE_PANEL" && iframe) {
            iframe.style.display = "none"
            iframe.style.width = "470px";
        }
        if (typeof msg === "object" && msg.id === "CT_OPEN_WINDOW" && msg.tabURLs) {
            msg.tabURLs.forEach((t) => {
                window.open(t, "_blank")
            })
            if (msg.isCloseExt) {
                iframe.style.display = "none"
            }
        }

        if (typeof msg === "object" && msg.type === "CT_PANEL_EXPAND" && iframe) {
            iframe.style.width = "470px"
            iframe.style.height = "100%"
        }
        if (typeof msg === "object" && msg.type === "CT_SHOW_MESSAGE" && msg.text && msg.msgType) {
            window.showMessage(msg.text, msg.msgType)
        }

        if (typeof msg === "object" && msg.type === "LOGOUT_EXPAND_IFRAME" && iframe) {
            chrome.runtime.sendMessage({ message: "default-icon" }, function (response) {
                console.log(response);
            });
            if (iframe.width < 100) {
                iframe.style.width = "470px"
                iframe.style.height = "100%"
            }
        }

        if (typeof msg === "object" && msg.id === "IMPORT_SOCIAL_POSTS" && msg.value) {
            //Check current active tab url
            const currentUrl = window.location.href;
            chrome.runtime.sendMessage({ request: "close-extension" });
            if (currentUrl.includes('https://twitter.com') || currentUrl.includes('https://www.twitter.com')) {
                window.grabTwitterPosts(msg.value);
            } else if (currentUrl.includes('https://read.amazon.in') || currentUrl.includes('https://read.amazon.com')) {
                window.importKindleHighlights(msg.value);
            }
        }

    }
    catch (e) {
        console.log("Error on message", e)
    }

    if (cb) cb()
})

const position = window.localStorage.getItem("CT_SIDER_POSITION")
const sidebarType = window.localStorage.getItem("CT_SIDEBAR_VIEW_TYPE")

iframe.style.height = "100%";
iframe.style.width = "470px";
iframe.style.display = "none";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.left = "auto";
iframe.style.zIndex = "9000000000000000000";
iframe.style.outline = "1px solid lightgrey"
iframe.style.border = "0px";
// iframe.sandbox = "allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox"
iframe.src = chrome.runtime.getURL("index.html")

snackbar.classList.add("ct-snackbar")
document.body.appendChild(iframe);
document.body.appendChild(snackbar);

window.showMessage = (message, type) => {
    snackbar.innerHTML = `<div class="${type}"></div>${message}`
    snackbar.classList.add("ct-show")
    setTimeout(() => {
        snackbar.classList.remove("ct-show")
    }, 3000)
}

window.panelToggle = (url, isOpen) => {
    let keywords = []
    const keywordElems = document.querySelector("meta[name='keywords']")
    const keywordContent = keywordElems ? keywordElems.getAttribute("content") : null

    if (keywordContent && keywordContent.length > 0) {
        keywords = keywordElems.getAttribute("content").split(",")
    }
    else {
        const bodyElement = document.querySelector("body")
        const allWords = bodyElement.outerText.toLowerCase().replace(/[^A-Za-z]/gm, " ").split(/\s+/gm)
        const wordsObj = {}
        allWords.filter((o) => { return o !== "" }).forEach((w) => {
            if (wordsObj[w]) {
                wordsObj[w]++
            }
            else if (w.length > 5) {
                wordsObj[w] = 1
            }
        })
        const sortedValues = Object.values(wordsObj).sort((a, b) => b - a);
        const maxN = sortedValues[5 - 1]
        const fiveHighest = Object.entries(wordsObj).reduce((wordsObj, [k, v]) => v >= maxN ? { ...wordsObj, [k]: v } : wordsObj, {});
        keywords = Object.keys(fiveHighest).map((o) => { return o })
    }

    chrome.storage.sync.set({ "CT_INITIAL_DATA": { "CT_KEYWORDS": keywords, "CT_URL": window.location.href } })

    if (url) {
        iframe.contentWindow.postMessage(url, chrome.runtime.getURL("index.html"))
    }

    if (isOpen) {
        iframe.style.display = "block";
        iframe.style.width = '470px'
    }
    else {
        if (iframe.style.display === "none") {
            iframe.style.display = "block";
            // iframe.style.top = "0px";
        }
        else {
            iframe.style.display = "none";
        }
    }
}

const showSidePanel = async () => {
    try {
        const data = await new Promise((resolve, reject) => {
            chrome.storage.sync.get(["userData"], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });

        if (data?.userData?.token) {
            let keywords = []
            const keywordElems = document.querySelector("meta[name='keywords']")
            const keywordContent = keywordElems ? keywordElems.getAttribute("content") : null

            if (keywordContent && keywordContent.length > 0) {
                keywords = keywordElems.getAttribute("content").split(",")
            }
            else {
                const bodyElement = document.querySelector("body")
                const allWords = bodyElement.outerText.toLowerCase().replace(/[^A-Za-z]/gm, " ").split(/\s+/gm)
                const wordsObj = {}
                allWords.filter((o) => { return o !== "" }).forEach((w) => {
                    if (wordsObj[w]) {
                        wordsObj[w]++
                    }
                    else if (w.length > 5) {
                        wordsObj[w] = 1
                    }
                })
                const sortedValues = Object.values(wordsObj).sort((a, b) => b - a);
                const maxN = sortedValues[5 - 1]
                const fiveHighest = Object.entries(wordsObj).reduce((wordsObj, [k, v]) => v >= maxN ? { ...wordsObj, [k]: v } : wordsObj, {});
                keywords = Object.keys(fiveHighest).map((o) => { return o })
            }
            chrome.storage.sync.set({ "CT_INITIAL_DATA": { "CT_KEYWORDS": keywords, "CT_URL": window.location.href } })

            iframe.style.width = "50px";
            iframe.style.display = "block";
            iframe.style.height = "100%"
            iframe.contentWindow.postMessage('SHOW_MENU', chrome.runtime.getURL("index.html"))
        } else {
            window.panelToggle(`?open-extension`, true)
            // window.alert('Please logged in into curateit!')
        }
    } catch (error) {
        console.error(error);
    }
}


async function checkUserLogin() {
    try {
        const data = await new Promise((resolve, reject) => {
            chrome.storage.sync.get(["userData"], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });
        return data;

    } catch (error) {
        console.error(error);
    }
}
async function checkURL() {
    const data = await checkUserLogin()
    const url = window.location.href

    if (data?.userData?.token) {
        fetch(
            `${data.userData.apiUrl}/api/fetch-bookmarks?url=${url}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.userData.token}`,
                },
            }
        )
            .then((response) => {
                return response.json()
            })
            .then((res) => {
                if (res && res?.message === true) {
                    chrome.runtime.sendMessage({ message: "change-icon" }, function (response) {
                        console.log(response);
                    });
                } else {
                    chrome.runtime.sendMessage({ message: "default-icon" }, function (response) {
                        console.log(response);
                    });
                }
            })
            .catch((error) => {
                return
            })
    } else {
        chrome.runtime.sendMessage({ message: "default-icon" });
    }
}
checkURL()

