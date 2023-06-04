

let curateitButtonId = ""
let loading = false
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
const TOOL_TIP_MESSAGE = "Curateit"
const BACKGROUND_IN_RGBA = "rgba(103, 54, 221, 0.2)"
const BACKGROUND_IN_RGBA03 = "rgba(103, 54, 221, 0.3)"
const SAVE_STATUS = {
  SUCCESSFUL: "SUCCESSFUL",
  FAILED: "FAILED",
}

let collectionId = null;
let selectedTags = [];
let remarks = "";
let importType = "";
let userObj = [];
let userCreated = [];

const LOADING_SVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="30px" height="30px" viewBox="0 0 128 128" xml:space="preserve"><g><circle cx="16" cy="64" r="16" fill="#6736dd"/><circle cx="16" cy="64" r="14.344" fill="#6736dd" transform="rotate(45 64 64)"/><circle cx="16" cy="64" r="12.531" fill="#6736dd" transform="rotate(90 64 64)"/><circle cx="16" cy="64" r="10.75" fill="#6736dd" transform="rotate(135 64 64)"/><circle cx="16" cy="64" r="10.063" fill="#6736dd" transform="rotate(180 64 64)"/><circle cx="16" cy="64" r="8.063" fill="#6736dd" transform="rotate(225 64 64)"/><circle cx="16" cy="64" r="6.438" fill="#6736dd" transform="rotate(270 64 64)"/><circle cx="16" cy="64" r="5.375" fill="#6736dd" transform="rotate(315 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g></svg>`

const ICON = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="18.75" height="15.75" viewBox="0 0 47.000000 48.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#6b727c" stroke="none">
                        <path d="M300 411 c-12 -24 -3 -51 17 -51 10 0 12 6 8 20 -5 14 -2 20 10 20
                        27 0 28 -27 1 -84 -14 -30 -26 -64 -26 -76 0 -12 12 -46 26 -76 27 -57 26 -84
                        -1 -84 -12 0 -15 6 -10 20 8 24 -20 28 -29 4 -10 -27 12 -54 45 -54 42 0 53
                        34 32 95 -8 25 -13 48 -10 51 9 9 57 -19 57 -34 0 -8 -6 -12 -15 -8 -9 3 -15
                        0 -15 -10 0 -20 27 -29 45 -14 25 21 18 66 -12 89 l-28 21 28 21 c30 23 37 68
                        12 89 -18 15 -45 6 -45 -14 0 -10 6 -13 15 -10 9 4 15 0 15 -8 0 -15 -48 -43
                        -57 -34 -3 3 2 26 10 51 21 61 10 95 -32 95 -20 0 -34 -7 -41 -19z"/>
                        <path d="M94 361 c-47 -29 -64 -59 -64 -116 0 -86 54 -145 134 -145 44 0 79
                        13 106 40 31 31 25 43 -17 36 -107 -19 -109 -19 -138 7 -39 33 -39 81 0 114
                        29 26 31 26 138 7 39 -6 46 1 25 28 -41 50 -127 64 -184 29z"/>
                        <path d="M175 280 c-3 -5 1 -10 10 -10 9 0 13 5 10 10 -3 6 -8 10 -10 10 -2 0
                        -7 -4 -10 -10z"/>
                        <path d="M178 203 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
                    </g>
                </svg>`
const SAVED_ICON = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="18.75" height="15.75" viewBox="0 0 47.000000 48.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#105fd2" stroke="none">
                        <path d="M300 411 c-12 -24 -3 -51 17 -51 10 0 12 6 8 20 -5 14 -2 20 10 20
                        27 0 28 -27 1 -84 -14 -30 -26 -64 -26 -76 0 -12 12 -46 26 -76 27 -57 26 -84
                        -1 -84 -12 0 -15 6 -10 20 8 24 -20 28 -29 4 -10 -27 12 -54 45 -54 42 0 53
                        34 32 95 -8 25 -13 48 -10 51 9 9 57 -19 57 -34 0 -8 -6 -12 -15 -8 -9 3 -15
                        0 -15 -10 0 -20 27 -29 45 -14 25 21 18 66 -12 89 l-28 21 28 21 c30 23 37 68
                        12 89 -18 15 -45 6 -45 -14 0 -10 6 -13 15 -10 9 4 15 0 15 -8 0 -15 -48 -43
                        -57 -34 -3 3 2 26 10 51 21 61 10 95 -32 95 -20 0 -34 -7 -41 -19z"/>
                        <path d="M94 361 c-47 -29 -64 -59 -64 -116 0 -86 54 -145 134 -145 44 0 79
                        13 106 40 31 31 25 43 -17 36 -107 -19 -109 -19 -138 7 -39 33 -39 81 0 114
                        29 26 31 26 138 7 39 -6 46 1 25 28 -41 50 -127 64 -184 29z"/>
                        <path d="M175 280 c-3 -5 1 -10 10 -10 9 0 13 5 10 10 -3 6 -8 10 -10 10 -2 0
                        -7 -4 -10 -10z"/>
                        <path d="M178 203 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
                    </g>
                </svg>`

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "greeting") {
    console.log(message.data)
  }
})

const createCurateitButtonMainContainer = () => {
  const containerId = uuidv4()
  const newContainer = document.createElement("div")
  newContainer.style.display = "flex"
  newContainer.style.alignItems = "center"
  newContainer.style.justifyContent = "center"
  newContainer.style.height = "100%"
  newContainer.style.width = "34px"
  newContainer.id = containerId
  return newContainer
}

const createCurateitButton = () => {
  const newButton = document.createElement("button")
  newButton.innerHTML = ICON
  newButton.style.color = "#5b7082"
  newButton.style.display = "flex"
  newButton.style.alignItems = "center"
  newButton.style.justifyContent = "center"
  newButton.style.background = "none"
  newButton.style.border = "none"
  newButton.style.cursor = "pointer"
  newButton.style.width = "34px"
  newButton.style.height = "34px"
  newButton.id = uuidv4()
  return newButton
}

const divWrapperBox = () => {
  let divWrapper = document.createElement("div")
  divWrapper.style.position = "fixed"
  divWrapper.style.zIndex = "999"
  divWrapper.style.left = "0"
  divWrapper.style.top = "0"
  divWrapper.style.width = "100%"
  divWrapper.style.height = "100%"
  divWrapper.style.overflow = "auto"
  divWrapper.style.backgroundColor = "rgb(0,0,0,0.7)"
  divWrapper.style.display = "flex"
  divWrapper.style.alignItems = "center"
  divWrapper.style.justifyContent = "center"
  divWrapper.style.flexDirection = "column"
  divWrapper.setAttribute("id", "tweet-div-wrapper")
  return divWrapper
}

const tagHeader = () => {
  let header = document.createElement("div")
  header.style.boxSizing = "borderBox"
  header.style.width = "100%"
  header.style.paddingTop = "21px"
  header.style.paddingRight = "38px"
  header.style.paddingLeft = "30px"
  header.style.paddingBottom = "19px"
  header.style.backgroundColor = "white"
  header.style.maxWidth = "700px"
  header.style.transform = "translateY(5px)"
  header.style.borderTopLeftRadius = "12px"
  header.style.borderTopRightRadius = "12px"
  header.style.borderBottomWidth = "1px"
  header.style.borderBottomStyle = "solid"
  header.style.borderBottomColor = "#C2C9D0"
  header.style.position = "relative"
  header.style.zIndex = "123456"
  header.style.display = "flex"
  header.style.justifyContent = "space-between"
  header.style.alignItems = "center"
  header.innerHTML =
    '<h2 class="tags-title">Save tweet</h2><svg class="tags-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6 6L18 18" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  return header
}

const btnClose = () => {
  let closeBtn = document.querySelector(".tags-svg")
  closeBtn.style.cursor = "pointer"
  closeBtn.setAttribute("id", "tag-btn-close")
  return closeBtn
}

const createCurateitButtonWrapper = () => {
  const curateitButtonWrapper = document.createElement("div")
  curateitButtonWrapper.id = uuidv4()
  curateitButtonWrapper.style.display = "flex"
  curateitButtonWrapper.style.alignItems = "center"
  curateitButtonWrapper.style.justifyContent = "center"
  curateitButtonWrapper.style.height = "30px"
  curateitButtonWrapper.style.width = "30px"
  curateitButtonWrapper.style.position = "relative"

  const toolTipSpan = document.createElement("SPAN")
  toolTipSpan.style.color = "#fff"
  toolTipSpan.style.position = "absolute"
  toolTipSpan.style.top = "18px"
  toolTipSpan.style.left = "30px"
  toolTipSpan.style.padding = "3px"
  toolTipSpan.style.fontWeight = "100"
  toolTipSpan.style.visibility = "hidden"
  toolTipSpan.style.backgroundColor = "#4a6274"
  toolTipSpan.style.opacity = "0"
  toolTipSpan.style.transition = "opacity 1s"
  toolTipSpan.style.whiteSpace = "nowrap"
  toolTipSpan.style.borderRadius = "2px"
  toolTipSpan.style.letterSpacing = ".3px"
  toolTipSpan.style.zIndex = 1000

  let fontFace = new FontFace("Inter", "url(/fonts/Inter-Regular.ttf)")
  fontFace.family = "Inter, sans-serif"
  toolTipSpan.style.fontFamily = "Inter, sans-serif"
  toolTipSpan.style.fontSize = "12px"
  toolTipSpan.innerText = TOOL_TIP_MESSAGE

  curateitButtonWrapper.addEventListener("mouseenter", function () {
    if (curateitButtonWrapper.style.background !== BACKGROUND_IN_RGBA03) {
      curateitButtonWrapper.style.background = BACKGROUND_IN_RGBA
      curateitButtonWrapper.style.transitionDuration = "0.2s"
      curateitButtonWrapper.style.borderRadius = "50%"
      curateitButtonWrapper.style.transitionProperty = "background"
      toolTipSpan.style.visibility = "visible"
      toolTipSpan.style.opacity = "1"

      //Color the svg paths
      curateitButtonWrapper.querySelectorAll("path").forEach((path) => {
        path.style.fill = "#8552ff"
      })
    }
  })
  curateitButtonWrapper.addEventListener("mouseleave", function () {
    if (curateitButtonWrapper.style.background === BACKGROUND_IN_RGBA) {
      curateitButtonWrapper.style.background = "none"
      toolTipSpan.style.visibility = "hidden"
      toolTipSpan.style.opacity = "0"

      //Color the svg paths
      curateitButtonWrapper.querySelectorAll("path").forEach((path) => {
        path.style.fill = "#5b7082"
      })
    }
  })
  curateitButtonWrapper.appendChild(toolTipSpan)
  return curateitButtonWrapper
}

const tagIframe = () => {
  let iframe = document.createElement("iframe")
  iframe.setAttribute("id", "myIframe")
  iframe.style.boxSizing = "borderBox"
  iframe.style.width = "100%"
  iframe.style.height = "100%"
  iframe.style.maxWidth = "700px"
  iframe.style.maxHeight = "350px"
  iframe.style.borderBottomLeftRadius = "12px"
  iframe.style.borderBottomRightRadius = "12px"
  return iframe
}

//TODO::HERE STARTS
window.grabTwitterPosts = async (vals) => {
  collectionId = vals?.collection_gems;
  selectedTags = vals?.tags;
  remarks = vals?.remarks;
  const authenticateUser = await checkIsUserLoggedIn()
  scrapeTweets(importType, authenticateUser)
}

//New functions start
const checkIsUserLoggedIn = async () => {
  const text = await chrome?.storage?.sync.get(["userData"])

  if (text && text?.userData && text?.userData?.apiUrl) {
    return {
      url: text.userData.apiUrl,
      token: text.userData.token,
      collectionId: text?.userData?.unfilteredCollectionId,
    }
  } else {
    window.panelToggle(`?open-extension`, true)
    return false
  }
}
//New functions end

//key will be tweet url and value will be profile pic of this tweet author
const tweetAuthorProfilePic = {}

async function handleCuarate(_flickedButtonWrapperId, _flickedButtonId, tweet) {
  const authenticateUser = await checkIsUserLoggedIn()
  if (authenticateUser?.token) {
    saveTweet(_flickedButtonWrapperId, _flickedButtonId, tweet)
  } else {
    return false
  }
  // checkLogin(_flickedButtonWrapperId, _flickedButtonId, tweet)
  // return false
}

function saveTweet(
  _flickedButtonWrapperId,
  _flickedButtonId,
  tweet,
  token,
  extensionId
) {
  if (loading) {
    return
  }
  // loading = true;
  curateitButtonId = _flickedButtonId
  let button = document.getElementById(_flickedButtonId)
  let box = button.closest('div[data-testid="cellInnerDiv"]')
  let links = box.querySelectorAll('a[href] div[dir="auto"]')
  let type =
    box.innerHTML.search("Show this thread") !== -1 ? "thread" : "tweet"

  const coverArr = [];
  if (tweet?.medias && Array.isArray(tweet.medias) && tweet.medias.length > 0) {
    tweet.medias.map((m => {
      coverArr.push(m.url)
    }))
  }

  const newObj = {
    title: tweet?.user?.name ? `${tweet?.user?.name} on Twitter ${tweet?.text ? tweet?.text.substring(0, 20) : ""}` : "No Title",
    description: tweet?.text || "",
    media_type: "SocialFeed",
    platform: "Twitter",
    post_type: "SaveToCurateit",
    type: "Twitter",
    url: tweet?.tweetUrl,
    metaData: {
      url: tweet?.tweetUrl,
      type: "Twitter",
      title: tweet?.user?.name ? tweet?.user?.name + ' on Twitter' : "No Title",
      covers: coverArr
    },
    media: {
      covers: coverArr
    },
    socialfeed_obj: tweet
  }

  const message = {
    token: token,
    tweet: newObj,
    type: type,
  }

  chrome.storage.sync.set({
    twitterObj: message,
  })
  window.panelToggle(`?save-tweet`, true)
}

//Insert curateit button into each twitter card
async function addCurateitButton(mainDivHavingTweetActions, tweet, isThread) {
  const curateitButtonMainContainer = createCurateitButtonMainContainer()
  const curateitButton = createCurateitButton()
  const curateitButtonWrapper = createCurateitButtonWrapper()
  curateitButton.value = tweet.tweetUrl

  //Curateit button click
  curateitButton.addEventListener("click", async function (e) {
    handleCuarate(curateitButtonWrapper.id, curateitButton.id, tweet)
  })
  curateitButtonWrapper.appendChild(curateitButton)
  curateitButtonMainContainer.appendChild(curateitButtonWrapper)

  function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
  }

  insertAfter(
    curateitButtonMainContainer,
    mainDivHavingTweetActions.childNodes[4]
  )
}

let checkTweetsAreFullyLoaded = null
const BACKEND_URL = "https://twitter-be.curateit.com"
let bookmarksUrl = "https://twitter.com/i/bookmarks"
let likesUrl = "https://twitter.com/[^.]+/likes"
var likesUrlRegex = new RegExp(likesUrl)
var tokenVariable
let is_delta = false

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.tab_url && request.tab_url.indexOf(bookmarksUrl) > -1) {
    if (checkTweetsAreFullyLoaded) {
      clearInterval(checkTweetsAreFullyLoaded)
      checkTweetsAreFullyLoaded = null
    }

    if (request.tab_url.indexOf(bookmarksUrl) > -1) {
      checkTweetsAreFullyLoaded = setInterval(() => {
        utils.onReady("Bookmarks")
      }, 500)
    }

    utils.initAddSpecificToBookmarks()
  }

  if (request.tab_url && request.tab_url.match(likesUrlRegex)) {
    if (checkTweetsAreFullyLoaded) {
      clearInterval(checkTweetsAreFullyLoaded)
      checkTweetsAreFullyLoaded = null
    }

    if (request.tab_url.match(likesUrlRegex)) {
      // || (request.change_info_url && request.change_info_url.indexOf(bookmarksUrl) > -1)) {
      checkTweetsAreFullyLoaded = setInterval(() => {
        utils.onReady("Likes")
      }, 500)
    }

    utils.initAddSpecificToBookmarks()
  }

  // if (request.message === "send_user_details_bookmarks") {
  //   userParams = request.data
  //   scrapeTweets("bookmarks")
  //   // scrapeBookmarks(tokenVariable, 'bookmarks');
  // }

  // if (request.message === "send_user_details_likes") {
  //   userParams = request.data
  //   scrapeTweets("likes")
  //   // scrapeBookmarks(tokenVariable, 'likes');
  // }
})

window.addEventListener("message", function (event) {
  if (event.data == "success") {
    let button = document.getElementById(curateitButtonId)
    button.innerHTML = SAVED_ICON
    let divWrapper = document.getElementById("tweet-div-wrapper")
    divWrapper.remove()
  }
})

!(function (window) {
  "use strict"

  const observer = window.MutationObserver || window.WebKitMutationObserver
  const windowDocument = window.document
  var t,
    r = []

  function callback() {
    for (var e, t, o = 0, a = r.length; o < a; o++) {
      e = r[o]
      for (
        var s,
        i = 0,
        l = (t = windowDocument.querySelectorAll(e.selector)).length;
        i < l;
        i++
      )
        (s = t[i]).ready || ((s.ready = true), e.fn.call(s, s))
    }
  }

  window.ready = function (element, elementReadyCallBack) {
    r.push({ selector: element, fn: elementReadyCallBack }),
      t ||
      (t = new observer(callback)).observe(windowDocument.documentElement, {
        childList: true,
        subtree: true,
      }),
      callback()
  }
})(this)

const moreInTwitterSupportedLanguages = [
  "المزيد",
  "আরও",
  "Gehiago",
  "More",
  "Още",
  "Més",
  "Više",
  "Víc",
  "Mere",
  "Meer",
  "More",
  "Higit pa",
  "Lisää",
  "Plus",
  "Máis",
  "Mehr",
  "Περισσότερα",
  "વધુ",
  "עוד",
  "और अधिक",
  "Még több",
  "Selengkapnya",
  "Tuilleadh",
  "Altro",
  "もっと見る",
  "ಮತ್ತಷ್ಟು",
  "더 보기",
  "Lagi",
  "अधिक",
  "Mer",
  "بیشتر",
  "Więcej",
  "Mais",
  "Mai multe",
  "Еще",
  "Још",
  "更多",
  "Viac",
  "Más opciones",
  "Mer",
  "மேலும்",
  "เพิ่มเติม",
  "更多",
  "Daha fazla",
  "Інші дії",
  "مزید",
  "Thêm",
]
  .map(
    (moreInTwitterSupportedLanguages) =>
      `div[aria-label="${moreInTwitterSupportedLanguages}"]`
  )
  .join(",")

function renderArticleButton(article) {
  const moreSection = article.querySelector(moreInTwitterSupportedLanguages)
  const divContainingTweetActions =
    article.querySelectorAll("div[role=group]").length > 1
      ? article.querySelectorAll("div[role=group]")[1]
      : article.querySelectorAll("div[role=group]")[0]

  if (!moreSection) return
  //regex to check if it's a tweet link or not;
  // const tweetUrlRegex = /^https:\/\/(?:m.|mobile.|www.)?twitter\.com\/.+\/status\/([0-9]+)$/;
  const tweetUrlRegex =
    /^https:\/\/(?:m\.|mobile\.|www\.)?twitter\.com\/(?:.+\/)?(status|home|bookmarks)(?:\/.+)?$/

  let currentTweetLink
  let currentTweetAuthorDisplayName = null
  const allAnchorTagsInArticle = [...article.querySelectorAll("a[role=link]")]

  const isTweetAuthorProfileLink = (currentTweetLink, url) => {
    const tweetAuthorUserName = currentTweetLink?.split("/")[3]
    return url.endsWith(tweetAuthorUserName)
  }

  for (const anchorTag of allAnchorTagsInArticle) {
    if (tweetUrlRegex.test(anchorTag.href)) {
      currentTweetLink = anchorTag.href
      break
    }
  }

  for (const anchorTag of allAnchorTagsInArticle) {
    if (isTweetAuthorProfileLink(currentTweetLink, anchorTag.href)) {
      currentTweetAuthorDisplayName = anchorTag.innerText.split("@")[0].trim()
    }
  }

  const articleObserverCallback = (mutation) => {
    const addedNodes = []
    mutation.forEach(
      (record) =>
        record.addedNodes.length & addedNodes.push(...record.addedNodes)
    )
    const addedImgTagNodes = addedNodes.filter((node) => node.tagName === "IMG")
    const isAProfilePicUrl = (url) => {
      return url.includes("profile_images")
    }
    for (const imgTag of addedImgTagNodes) {
      if (isAProfilePicUrl(imgTag.src)) {
        tweetAuthorProfilePic[currentTweetLink] = imgTag.src
        break
      }
    }
  }
  const observer = new MutationObserver(articleObserverCallback)
  observer.observe(article, {
    childList: true,
    subtree: true,
  })
  //this div has multiple children and with tags like span, anchor tag etc so will need to iterate all and then get the complete text of the tweet.
  const divContainingTweetText = article.querySelector("div[dir=auto][lang]")
  let tweetText = "No text found in this tweet."
  if (divContainingTweetText) {
    tweetText = ((divContainingTweetText) => {
      let tweetTextResult = ""
      for (const child of divContainingTweetText.children) {
        tweetTextResult += child.innerText
      }
      return tweetTextResult
    })(divContainingTweetText)
  }
  let date = null
  const timeTag = article.querySelector("time")
  if (timeTag) {
    date = timeTag.dateTime
  }
  //there are edge cases when user have add blocker it can give some bugs
  if (!date) {
    const allAnchorTagsInArticle = [...article.querySelectorAll("a[role=link]")]
    for (const anchorTag of allAnchorTagsInArticle) {
      if (anchorTag.href === currentTweetLink) {
        date = Date(anchorTag.innerText)
      }
    }
  }

  const tweetDetails = extractTweetData(article)

  if (divContainingTweetActions && currentTweetLink) {
    try {
      const url = new URL(currentTweetLink)
      const tweetId = url.pathname.split("/").reverse()[0]
      const tweet = {
        tweetUrl: currentTweetLink,
        text: tweetText,
        tweetId,
        date,
        authorDisplayName: currentTweetAuthorDisplayName,
        user: tweetDetails?.user,
        likeCount: tweetDetails?.likeCount,
        reply_count: tweetDetails?.reply_count,
        retweet_count: tweetDetails?.retweet_count,
        user: tweetDetails?.user,
        medias: tweetDetails?.medias,
      }
      addCurateitButton(
        divContainingTweetActions,
        tweet,
        article.textContent.includes("Show this thread")
      )
    } catch (error) {
      console.log("Invalid Url :>> ", currentTweetLink, error)
    }
  }
}

ready("article", async (article) => {
  const awaitedArticle = await article
  if (awaitedArticle) {
    setTimeout(() => {
      renderArticleButton(article)
    }, 1000)
  }
})

const init = async (page) => {
  let header =
    page == "Bookmarks"
      ? $('[data-testid="primaryColumn"] h2 span')
      : $('[data-testid="primaryColumn"] h2')
  let body = $("body")
  let is_injected_button_exists = $("#injected-button").length
  if (!is_injected_button_exists) {
    header.append(
      `<button id="injected-button" style="font-size: 14px;border: 1px solid gray;margin-left: 30px;margin-right: 30px;cursor: pointer;background: white;border-radius: 16px;color: black;padding: 6px 10px;font-weight: 600;display: inline-flex;align-items: center;position: absolute;top: 5px;"><img src="https://uploads-ssl.webflow.com/630c8eb6cd033024afa8858e/63511ad74e84aab0cb60a9e4_android-chrome-256x256.png" width="20" style="margin-right: 5px;"/>Import ${page}</button>`
    )
    let is_injected_overlay_exists = $("#injected-overlay").length
    if (!is_injected_overlay_exists) {
      body.append(
        `<div id="injected-overlay" style="font-size:50px;display:none;font-weight:800;position: fixed;width: 100%;height: 100%;top: 0;left: 0;right:0;bottom: 0;background: linear-gradient(90deg, rgba(16,95,211, 0.8), rgba(16,95,211, 0.8));z-index: 1; font-family: Roboto, Helvetica, Arial, sans-serif;"><div style="position: absolute;top: 50%;left: 50%;font-size: 50px;color: white;transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);text-align: center;"><span id="status-bar">Sit tight, we’re grabbing <br/> your ${page.toLowerCase()}...<br/></span></div><div style="position: absolute;top: 90%;left: 90%;"></div></div>`
      )
    } else {
      let status_bar = $("#status-bar")
      if (status_bar) {
        status_bar.html(
          `Sit tight, we’re grabbing <br/> your ${page.toLowerCase()}...<br/>`
        )
      }
    }

    $("#injected-button").click(async function () {
      const authenticateUser = await checkIsUserLoggedIn()
      if (authenticateUser?.token) {
        if (page == "Bookmarks") {
          importType = "bookmarks"
        } else {
          importType = "likes"
        }
        collectionId = null;
        selectedTags = [];
        remarks = "";
        userObj = [];
        userCreated = [];
        window.panelToggle(`?add-import-details`, true)
      }
    })
  }
}

// Scrapping
async function scrollWithDelay(new_height, t, trigger_submit) {
  window.scrollTo(0, new_height)

  if (is_delta && trigger_submit) {
    let tweets = []

    await runInPageContext(utils.grabBookmarksContext).then((response) => {
      bookmarks = response

      // Direct valid tweets
      let valid_tweets = bookmarks.sort_order.filter((e) => e.type == "tweet")
      let valid_tweets_id = valid_tweets
        .filter((e) => !parsed_bookmarks.keys.includes(e.content.id))
        .map((e) => e.content.id)

      // Set sort order dict for each tweet
      bookmarks.parsed_sort_order = {}
      valid_tweets.forEach((t) => {
        bookmarks.parsed_sort_order[t.content.id] = t.sortIndex
      })

      Object.keys(bookmarks.tweets).forEach((key) => {
        if (valid_tweets_id.includes(key)) {
          let parsed_tweet = utils.parseTweet(bookmarks.tweets[key])
          if (parsed_tweet) {
            tweets.push(parsed_tweet)

            parsed_bookmarks.keys.push(key)
            parsed_bookmarks.values.push(parsed_tweet)
          }
        }
      })
    })

    tweets = tweets.sort((a, b) => (a.sort_order < b.sort_order && 1) || -1)
    await addBulkTweets(t, tweets)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 100)
  })
}

async function scrapeBookmarks(t, type = "bookmarks") {
  stop_scrapping = false

  parsed_bookmarks = {
    keys: [],
    values: [],
  }

  $("#injected-overlay").css({ display: "block" })
  window.scrollTo(0, 0)

  let primaryColumn = $('[data-testid="primaryColumn"]')
  let new_height = 0
  let total_height = primaryColumn.height()
  let fail_safe_counter = 0
  let status_bar = $("#status-bar")
  let delta_count = 0
  let trigger_submit = false

  while (!stop_scrapping) {
    if (is_delta) {
      delta_count++
      if (delta_count == 5 || stop_scrapping) {
        trigger_submit = true
        delta_count = 0
      } else {
        trigger_submit = false
      }
    }

    await scrollWithDelay(new_height, t, trigger_submit)

    new_height += 250
    total_height = primaryColumn.height()
    if (new_height >= total_height) {
      primaryColumn
        .find(
          'div[role="button"] svg g path[d="M12 2C6.486 2 2 6.486 2 12c0 .414.336.75.75.75s.75-.336.75-.75c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5c-2.886 0-5.576-1.5-7.13-3.888l2.983.55c.402.08.798-.193.874-.6.076-.408-.194-.8-.6-.874l-4.663-.86c-.204-.04-.414.01-.58.132-.168.123-.276.31-.3.515l-.57 4.706c-.05.412.242.785.653.835.03.004.06.006.09.006.375 0 .698-.278.745-.66l.32-2.63C5.673 20.36 8.728 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2z"]'
        )
        .parents('div[role="button"]')
        .click()
      await utils.sleep(1000)
      fail_safe_counter += 1
      if (fail_safe_counter > 5) {
        stop_scrapping = true
      }
    } else {
      fail_safe_counter = 0
    }
  }

  if (!is_delta) {
    await runInPageContext(utils.grabBookmarksContext).then((response) => {
      bookmarks = response

      let tweets = []
      // Direct valid tweets
      if (type == "bookmarks") {
        let valid_tweets = bookmarks.sort_order.filter((e) => e.type == "tweet")
        let valid_tweets_id = valid_tweets.map((e) => e.content.id)
        // Set sort order dict for each tweet
        bookmarks.parsed_sort_order = {}
        valid_tweets.forEach((t) => {
          bookmarks.parsed_sort_order[t.content.id] = t.sortIndex
        })

        Object.keys(bookmarks.tweets).forEach((key) => {
          if (valid_tweets_id.includes(key)) {
            let parsed_tweet = utils.parseTweet(bookmarks.tweets[key])
            if (parsed_tweet) {
              tweets.push(parsed_tweet)
            }
          }
        })
      } else {
        Object.keys(bookmarks.tweets).forEach((key) => {
          let parsed_tweet = utils.parseLikedTweet(bookmarks.tweets[key])
          if (parsed_tweet) {
            tweets.push(parsed_tweet)
          }
        })
      }

      bookmarks.parsed_tweets = tweets
      if (bookmarks) {
        // Update progress bar
        if (status_bar) {
          status_bar.html(
            `Ingesting ${bookmarks.parsed_tweets.length} ${type}<br/> 🚀`
          )
        }

        if (bookmarks.parsed_tweets.length) {
          setTimeout(() => {
            addBulkTweets(t, bookmarks.parsed_tweets, type)
          }, 1000)
        }
      }
    })
  }
}

//Get tweetId and date
function getTweetId(tweet) {
  // Get the tweet url and id
  const tweetUrlRegex =
    /^https:\/\/(?:m\.|mobile\.|www\.)?twitter\.com\/(?:.+\/)?(status|home|bookmarks)(?:\/.+)?$/
  const allAnchorTagsInArticle = [...tweet.querySelectorAll("a[role=link]")]
  let tweetUrl = ""
  for (const anchorTag of allAnchorTagsInArticle) {
    if (tweetUrlRegex.test(anchorTag.href)) {
      tweetUrl = anchorTag.href
      break
    }
  }

  // const url = new URL(tweetUrl)
  let url = null
  try {
    url = new URL(tweetUrl)
  } catch (error) {
    console.log("Invalid Url :>> ", tweetUrl, error)
    return null
  }

  const tweetId = url.pathname.split("/").reverse()[0]
  return tweetId
}

//FORMAT GEM OBJECT
function formatGem(objArr, type) {
  const newArr = [];
  objArr.map(obj => {
    if (obj?.tweetUrl){
      if (!userCreated.includes(obj?.user?.id)) {
        formatUser(obj?.user);
      }
  
      const coverArr = [];
      if (obj?.medias && Array.isArray(obj.medias) && obj.medias.length > 0) {
        obj.medias.map((m => {
          coverArr.push(m.url)
        }))
      }
  
      const newObj = {
        title: obj?.user?.name ? `${obj?.user?.name} on Twitter ${obj?.text ? obj?.text.substring(0, 20) : "" }` : "No Title",
        description: obj?.text || "",
        media_type: "SocialFeed",
        platform: "Twitter",
        post_type: type,
        type: "Twitter",
        url: obj?.tweetUrl,
        metaData: {
          url: obj?.tweetUrl,
          // "icon": "https://abs.twimg.com/favicons/twitter.2.ico",
          type: "Twitter",
          title: obj?.user?.name ? obj?.user?.name + ' on Twitter' : "No Title",
          covers: coverArr
        },
        media: {
          covers: coverArr
        },
        collection_gems: collectionId,
        remarks: remarks,
        tags: selectedTags,
        // is_favourite: true,
        socialfeed_obj: obj
      }
      newArr.push(newObj);
    }

  })

  collectionId = null;
  selectedTags = [];
  remarks = "";
  importType = "";
  userObj = [];
  userCreated = [];

  return newArr;
}

//FORMAT USER OBJECT
function formatUser(obj) {
  const newObj = {
    title: obj?.id,
    description: "",
    media_type: "Profile",
    platform: "Twitter",
    post_type: "Post",
    url: obj?.profile_url,
    metaData: {
      url: obj?.profile_url,
      type: "Profile",
      title: obj?.id,
      covers: obj?.profile_image_url ? { covers: [obj?.profile_image_url] } : null,
    },
    media: obj?.profile_image_url ? { covers: [obj?.profile_image_url] } : null,
    collection_gems: collectionId,
    remarks,
    tags: selectedTags,
    payload: { user: obj }
  }
  userCreated.push(obj?.id);
  userObj.push(newObj);
}

// Define a function to extract tweet data from a given tweet element
function extractTweetData(tweet) {
  // Get the tweet url and id
  const tweetUrlRegex =
    /^https:\/\/(?:m\.|mobile\.|www\.)?twitter\.com\/(?:.+\/)?(status|home|bookmarks)(?:\/.+)?$/
  const allAnchorTagsInArticle = [...tweet.querySelectorAll("a[role=link]")]
  let tweetUrl = ""
  for (const anchorTag of allAnchorTagsInArticle) {
    if (tweetUrlRegex.test(anchorTag.href)) {
      tweetUrl = anchorTag.href
      break
    }
  }

  // const url = new URL(tweetUrl)
  let url = null
  try {
    url = new URL(tweetUrl)
  } catch (error) {
    console.log("Invalid Url :>> ", tweetUrl, error)
    return null
  }

  const tweetId = url.pathname.split("/").reverse()[0]
  const conversation_id = tweetId

  // Get the tweet user data
  let user = {}
  const userHandleElement = tweet
    .querySelector('div[data-testid="Tweet-User-Avatar"]')
    ?.querySelector("div[data-testid]")
  const userNameElement = tweet.querySelector('div[data-testid="User-Name"]')
  const userHandle = userHandleElement
    .getAttribute("data-testid")
    .replace("UserAvatar-Container-", "")
  const userProfile = userHandleElement
    .querySelector(`a[href="/${userHandle}"]`)
    .querySelector("img")?.src
  user.id = userHandle
  user.name = userNameElement.querySelector("a span span")?.textContent
  user.profile_url = "https://twitter.com/" + userHandle
  user.screen_name = userHandle
  user.profile_image_url = userProfile
  user.verified = userNameElement.querySelector(
    'svg[data-testid="icon-verified"]'
  )
    ? true
    : false
  const date = userNameElement.querySelector("time")
    ? userNameElement.querySelector("time").getAttribute("datetime")
    : ""

  // Get the tweet text
  const text = tweet.querySelector('div[data-testid="tweetText"]')?.textContent

  // Get the reply count
  const replycountElement = tweet.querySelector('[data-testid="reply"]')
  const reply_count = replycountElement
    ? replycountElement.getAttribute("aria-label").match(/\d+/)[0]
    : 0

  // Get the like count
  const likeCountElement = tweet.querySelector('[data-testid="like"]')
    ? tweet.querySelector('[data-testid="like"]')
    : tweet.querySelector('[data-testid="unlike"]')
  const likeCount = likeCountElement
    ? likeCountElement.getAttribute("aria-label").match(/\d+/)[0]
    : 0

  // Get the retweet count
  const retweetCountElement = tweet.querySelector('[data-testid="retweet"]')
  const retweet_count = retweetCountElement
    ? retweetCountElement.getAttribute("aria-label").match(/\d+/)[0]
    : 0

  // Get the bookmark count
  const bookmarkCountElement = tweet.querySelector('[data-testid="bookmark"]')
  const bookmarkCount = bookmarkCountElement
    ? bookmarkCountElement.getAttribute("aria-label").match(/\d+/)[0]
    : 0

  // Get the media URLs
  const medias = []

  const mediaElements = tweet.querySelectorAll('[data-testid="tweetPhoto"]')
  for (const mediaElement of mediaElements) {
    const mediaUrl = mediaElement
      .querySelector("div")
      ?.style.backgroundImage.slice(4, -1)
      .replace(/"/g, "")
    if (mediaUrl) {
      medias.push({ url: mediaUrl })
    }
  }

  const videoElements = tweet.querySelectorAll('[data-testid="videoComponent"]')
  for (const videoElement of videoElements) {
    const mediaUrl = videoElement.querySelector("video")?.getAttribute("poster")
    if (mediaUrl) {
      medias.push({ url: mediaUrl })
    }
  }

  const EmbedElements = tweet.querySelectorAll('[data-testid="card.wrapper"]')
  for (const EmbedElement of EmbedElements) {
    const mediaUrl = EmbedElement.querySelector("img")?.getAttribute("src")
    if (mediaUrl) {
      medias.push({ url: mediaUrl })
    }
  }


  // Return an object with the tweet data
  return {
    tweetId,
    conversation_id,
    date,
    text,
    reply_count,
    retweet_count,
    likeCount,
    medias,
    user,
    tweetUrl,
  }
  // const tweetObj =  {
  //   tweetId,
  //   conversation_id,
  //   date,
  //   text,
  //   reply_count,
  //   retweet_count,
  //   likeCount,
  //   medias,
  //   user,
  //   tweetUrl,
  // }
}

// Define a function to scroll through the Twitter page and extract tweet data
async function scrapeTweets(type, authenticateUser) {
  // Get the initial set of tweet elements on the page

  stop_scrapping = false

  parsed_bookmarks = {
    keys: [],
    values: [],
  }

  $("#injected-overlay").css({ display: "block" })
  window.scrollTo(0, 0)

  //Fetch latest tweets
  let flag_ok = false
  let response
  let latestTweet = {}
  if (type === "bookmarks") {
    response = await fetch(
      `${authenticateUser?.url}/api/fetch-gems?type=SocialFeed&platform=Twitter&posttype=Bookmark&isLatest=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticateUser.token}`,
        },
      }
    )
    flag_ok = response.ok
  } else {
    response = await fetch(
      `${authenticateUser?.url}/api/fetch-gems?type=SocialFeed&platform=Twitter&posttype=Like&isLatest=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticateUser.token}`,
        },
      }
    )
    flag_ok = response.ok
  }

  let stopScrappingTweets = false
  const apiResponse = await response.json()

  if (flag_ok) {
    latestTweet = apiResponse.data
  }

  let primaryColumn = $('[data-testid="primaryColumn"]')
  let new_height = 0
  let total_height = primaryColumn.height()
  let fail_safe_counter = 0
  let status_bar = $("#status-bar")
  let delta_count = 0
  let trigger_submit = false

  let tweetData = []
  let tweets = []

  while (!stop_scrapping) {
    if (is_delta) {
      delta_count++
      if (delta_count == 5 || stop_scrapping) {
        trigger_submit = true
        delta_count = 0
      } else {
        trigger_submit = false
      }
    }

    await scrollWithDelay(new_height, null, trigger_submit)

    new_height += 250
    total_height = primaryColumn.height()
    if (new_height >= total_height) {
      primaryColumn
        .find(
          'div[role="button"] svg g path[d="M12 2C6.486 2 2 6.486 2 12c0 .414.336.75.75.75s.75-.336.75-.75c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5c-2.886 0-5.576-1.5-7.13-3.888l2.983.55c.402.08.798-.193.874-.6.076-.408-.194-.8-.6-.874l-4.663-.86c-.204-.04-.414.01-.58.132-.168.123-.276.31-.3.515l-.57 4.706c-.05.412.242.785.653.835.03.004.06.006.09.006.375 0 .698-.278.745-.66l.32-2.63C5.673 20.36 8.728 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2z"]'
        )
        .parents('div[role="button"]')
        .click()
      await utils.sleep(1000)
      fail_safe_counter += 1
      if (fail_safe_counter > 5) {
        stop_scrapping = true
      }
    } else {
      fail_safe_counter = 0
      tweets = primaryColumn[0].querySelectorAll("article")

      for (let i = 0; i < tweets.length; i++) {
        if (latestTweet?.socialfeed_obj?.tweetId !== getTweetId(tweets[i])) {
          //Scrap data
          tweetData.push(extractTweetData(tweets[i]))
        } else {
          stop_scrapping = true
          stopScrappingTweets = true
          break
        }
      }
    }
  }

  // Scroll through the page to load more tweets

  if (!stopScrappingTweets) {
    let lastTweet = tweets[tweets.length - 1]
    while (lastTweet) {
      const newTweets = document.querySelectorAll('div[data-testid="tweet"]')
      const newTweetData = []
      for (let i = tweets.length; i < newTweets.length; i++) {
        //Compare if tweet save before
        if (latestTweet?.tweet_obj?.tweetId !== getTweetId(tweet)) {
          //Scrap data
          newTweetData.push(extractTweetData(newTweets[i]))
        } else {
          stopScrappingTweets = true
          lastTweet = 0
          break
        }

        // newTweetData.push(extractTweetData(newTweets[i]))
      }
      tweetData.push(...newTweetData)
      tweets = newTweets
      lastTweet = tweets[tweets.length - 1]
    }
  }

  let parsed_tweets = removeDuplicates(tweetData)

  if (parsed_tweets) {
    // Update progress bar
    if (status_bar) {
      status_bar.html(`Ingesting ${parsed_tweets.length} ${type}<br/> 🚀`)
    }
    if (parsed_tweets.length) {
      setTimeout(() => {
        addBulkTweets(parsed_tweets, type, authenticateUser)
      }, 1000)
    } else {
      if (type === "bookmarks") {
        utils.resetAfterSubmit("bookmarks")
        alert("Your bookmarks are updated successfully.")
      } else {
        utils.resetAfterSubmit("likes")
        alert("Your likes are updated successfully.")
      }
    }
  } else {
    if (type === "bookmarks") {
      utils.resetAfterSubmit("bookmarks")
      alert("Your bookmarks are updated successfully.")
    } else {
      utils.resetAfterSubmit("likes")
      alert("Your likes are updated successfully.")
    }
  }
}

/**
 * Runs a function in the page context by serializing it to a string and injecting it to the page
 * @param {(function|Object)} func - a function to serialize and run in the page context, or an arguments object
 * @param {function} func.func - a function to serialize and run in the page context
 * @param {Array} [func.args] - arguments array to be passed to `func`
 * @param {Document} [func.doc] - alternative `document` to inject the serialized function
 * @param {number} [func.timeout] - optional timeout (milliseconds)
 * @param {...any} [args] - arguments array to be passed to `func`
 * @returns {Promise} a promise that will be resolved with the return value of the serialized function
 */

async function runInPageContext(func, ...args) {
  const params = Object(func)

  const { doc = document, timeout } = params

  if (typeof func !== "function") {
    func = params.func
    args = params.args
  }

  // test that we are running with the allow-scripts permission
  try {
    window.sessionStorage
  } catch (ignore) {
    return null
  }

  // returned value container
  const resultMessageId = parseInt(
    "" + Math.floor(Math.random() * 100 + 1) + new Date().getTime()
  )

  // prepare script container
  let scriptElm = doc.createElement("script")
  scriptElm.setAttribute("type", "application/javascript")
  scriptElm.setAttribute("nonce", "random-nonce")
  scriptElm.setAttribute(
    "integrity",
    "sha256-IRldrjOK9CQRoihq945JhntuvsmLPgkwRvBM148d6G0="
  )

  const code = `
        (
            async function () {

                    const response = {
                        id: ${resultMessageId}
                    };

                    try {
                        response.result = JSON.stringify(await (${func})(...${JSON.stringify(
    args || []
  )})); // run script
                    } catch(err) {
                        response.error = JSON.stringify(err);
                    }

                    window.postMessage(response, '*');
            }
        )();
    `

  // inject the script
  // scriptElm.textContent = postMessageCreator(resultMessageId, func, args);
  scriptElm.textContent = code

  // run the script
  doc.documentElement.appendChild(scriptElm)

  // clean up script element
  scriptElm.remove()

  // create a "flat" promise
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  // reject on timeout
  if (timeout !== undefined) {
    const timerId = setTimeout(() => {
      onResult({
        data: {
          id: resultMessageId,
          error: "Script timeout",
        },
      })
    }, timeout)

    // clear the timeout handler
    promise.finally(() => (timerId !== null ? clearTimeout(timerId) : null))
  }

  // resolve on result
  function onResult(event) {
    const data = Object(event.data)
    if (data.id === resultMessageId) {
      window.removeEventListener("message", onResult)
      if (data.error !== undefined) {
        return reject(JSON.parse(data.error))
      }
      return resolve(
        data.result !== undefined ? JSON.parse(data.result) : undefined
      )
    }
  }

  window.addEventListener("message", onResult)

  return promise
}

function removeDuplicates(arr) {
  const map = new Map()
  const uniqueArr = arr.filter((obj) => {
    const isDuplicate = map.has(obj?.tweetId)
    map.set(obj?.tweetId, true)
    return !isDuplicate
  })
  return uniqueArr
}

async function handleBookmarkAPI(params, authenticateUser) {
  userObj = [];
  userCreated = [];
  const gemFormated = formatGem(params, 'Bookmark');
  let dataArray = [...userObj, ...gemFormated];

  const chunkSize = 20
  let flag_ok = false

  for (let i = 0; i < dataArray.length; i += chunkSize) {
    const chunk = dataArray.slice(i, i + chunkSize)
    const response = await fetch(
      `${authenticateUser?.url}/api/store-gems`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticateUser.token}`,
        },
        body: JSON.stringify({
          data: chunk,
        }),
      }
    )
    flag_ok = response.ok
  }
  if (flag_ok) {
    utils.resetAfterSubmit("bookmarks")
    alert("Your bookmarks has been imported successfully.")
  } else {
    utils.resetAfterSubmit("bookmarks")
    alert("Something went wrong please try again.")
  }
}

async function handleLikesAPI(params, authenticateUser) {
  userObj = [];
  userCreated = [];
  const gemFormated = formatGem(params, 'Like');
  let dataArray = [...userObj, ...gemFormated];
  const chunkSize = 20
  let flag_ok = false

  for (let i = 0; i < dataArray.length; i += chunkSize) {
    const chunk = dataArray.slice(i, i + chunkSize)
    const response = await fetch(
      `${authenticateUser?.url}/api/store-gems`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authenticateUser.token}`,
        },
        body: JSON.stringify({ data: chunk }),
      }
    )
    flag_ok = response.ok
  }
  if (flag_ok) {
    utils.resetAfterSubmit("likes")
    alert("Your likes has been imported successfully.")
  } else {
    utils.resetAfterSubmit("likes")
    alert("Something went wrong please try again.")
  }
}

function addBulkTweets(tweets, type, authenticateUser) {
  if (type == "bookmarks") {
    handleBookmarkAPI(tweets, authenticateUser)
  } else {
    handleLikesAPI(tweets, authenticateUser)
  }
}

function addTweet(t, tweet) {
  let data = {
    tweet: JSON.stringify(tweet),
  }

  return new Promise((resolve) => {
    $.ajax({
      url: server_url + "tweets/add-or-remove/",
      type: "POST",
      cache: false,
      dataType: "json",
      headers: { Authorization: t },
      data: data,
    })
      .done((response) => {
        resolve(response)
      })
      .fail((xhr) => {
        if (xhr.status == 403) {
          chrome.storage.local.remove("token")
        }

        resolve()
      })
  })
}

function removeTweet(t, tweet) {
  let data = {
    tweet: JSON.stringify(tweet),
    is_remove: true,
  }

  return new Promise((resolve) => {
    $.ajax({
      url: server_url + "tweets/add-or-remove/",
      type: "POST",
      cache: false,
      dataType: "json",
      headers: { Authorization: t },
      data: data,
    })
      .done((response) => {
        resolve(response)
      })
      .fail((xhr) => {
        if (xhr.status == 403) {
          chrome.storage.local.remove("token")
        }

        resolve()
      })
  })
}

function addNotesToTweet(t, params) {
  return new Promise((resolve) => {
    $.ajax({
      url: server_url + "tweets/update/",
      type: "POST",
      cache: false,
      dataType: "json",
      headers: { Authorization: t },
      data: params,
    })
      .done(() => {
        notes_popup.close()
        resolve()
      })
      .fail((xhr) => {
        if (xhr.status == 403) {
          chrome.storage.local.remove("token")
        }

        notes_popup.close()
        resolve()
      })
  })
}

let utils = {
  onReady: (page) => {
    let on_bookmarks_page = false
    if (page == "Bookmarks")
      on_bookmarks_page =
        $('link[rel="canonical"]').length &&
        $('link[rel="canonical"]')[0].href.indexOf("bookmarks") > -1
    else
      on_bookmarks_page =
        $('a[aria-selected="true"]').length &&
        $('a[aria-selected="true"]')[0].href.includes("/likes") > -1

    if (on_bookmarks_page) {
      clearInterval(checkTweetsAreFullyLoaded)
      checkTweetsAreFullyLoaded = null

      init(page)
    }
  },
  initAddSpecificToBookmarks: () => {
    function _onShareClick(token) {
      $('*[role="button"]')
        .find(
          'svg g path[d^="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"]'
        )
        .each((_, share_image) => {
          let share_button = $(share_image).parents('*[role="button"]').eq(0)
          if (share_button && share_button.length) {
            share_button.off("click").on("click", () => {
              notes_popup.close()

              // Wait for popup to open
              setTimeout(() => {
                $('#layers *[role="menu"] *[role="menuitem"]')
                  .off("click")
                  .on("click", (event) => {
                    let target = $(event.currentTarget)

                    // Check if add to bookmarks clicked
                    let icon = target.find(
                      'svg g path[d^="M17 3V0h2v3h3v2h-3v3h-2V5h-3V3h3zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V11h2v11.94l-8-5.71-8 5.71V4.5C4 3.12 5.119 2 6.5 2h4.502v2H6.5z"]'
                    )
                    if (icon && icon.length) {
                      const uuid = utils.CreateUUID()
                      share_button
                        .parents("article")
                        .eq(0)
                        .parent()
                        .parent()
                        .attr("id", uuid)

                      runInPageContext(utils.grabTweetContext, {
                        uuid: uuid,
                      }).then(
                        (response) => {
                          let tweet_data = utils.parseTweet(
                            response.tweets[response.tweet_id],
                            response
                          )

                          addTweet(token, tweet_data).then(
                            (response) => {
                              if (response && response.id) {
                                popup.open("Tweet added to Dewey.")
                                notes_popup.open(
                                  response.id,
                                  response.tweet_content,
                                  response.notes
                                )
                              }
                            },
                            () => { }
                          )
                        },
                        (err) => {
                          console.log(err)
                        }
                      )
                    } else {
                      let icon = target.find(
                        'svg g path[d^="M16.586 4l-2.043-2.04L15.957.54 18 2.59 20.043.54l1.414 1.42L19.414 4l2.043 2.04-1.414 1.42L18 5.41l-2.043 2.05-1.414-1.42L16.586 4zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V11h2v11.94l-8-5.71-8 5.71V4.5C4 3.12 5.119 2 6.5 2h4.502v2H6.5z"]'
                      )
                      if (icon && icon.length) {
                        const uuid = utils.CreateUUID()
                        share_button
                          .parents("article")
                          .eq(0)
                          .parent()
                          .parent()
                          .attr("id", uuid)

                        runInPageContext(utils.grabTweetContext, {
                          uuid: uuid,
                        }).then(
                          (response) => {
                            let tweet_data = utils.parseTweet(
                              response.tweets[response.tweet_id],
                              response
                            )

                            removeTweet(token, tweet_data, true).then(
                              (response) => {
                                if (response && response.id) {
                                  popup.open("Tweet removed from Dewey.")
                                }
                              },
                              () => { }
                            )
                          },
                          (err) => {
                            console.log(err)
                          }
                        )
                      }
                    }
                  })
              }, 200)
            })
          }
        })
    }

    if (chrome.storage) {
      chrome.storage.local.get("token", function (t) {
        if (t && t.token) {
          token = t.token
          if (token) {
            const intr = setInterval(() => {
              if ($('main[role="main"] article').length > 0) {
                clearInterval(intr)
                _onShareClick(token)
              }
            }, 300)

            $(document)
              .off("scroll")
              .on("scroll", () => {
                // On share click
                _onShareClick(token)
              })
          }
        }
      })
    }
  },
  sleep: (timeout) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, timeout)
    })
  },
  resetAfterSubmit: async (type) => {
    window.scrollTo(0, 0)
    $("#injected-overlay").css({ display: "none" })

    $("#injected-button").unbind("click")
    $("#injected-button").click(async function () {
      // const authenticateUser = await checkIsUserLoggedIn()
      // if (authenticateUser?.token) {
      //   if (type == "bookmarks") {
      //     scrapeTweets("bookmarks", authenticateUser)
      //   } else {twi
      //     scrapeTweets("likes", authenticateUser)
      //   }
      // }
      const authenticateUser = await checkIsUserLoggedIn()
      if (authenticateUser?.token) {
        if (type == "bookmarks") {
          importType = "bookmarks"
        } else {
          importType = "likes"
        }
        collectionId = null;
        selectedTags = [];
        remarks = "";
        userObj = [];
        userCreated = [];
        window.panelToggle(`?add-import-details`, true)
      }
    })

    let status_bar = $("#status-bar")
    if (status_bar) {
      status_bar.html(`Sit tight, we’re grabbing <br/> your ${type}...<br/>`)
    }
  },
  grabBookmarksContext: () => {
    let appStates = []
    let reactRoot = document.getElementById("react-root")
    let base = reactRoot._reactRootContainer._internalRoot.current
    while (base) {
      try {
        let state = base.pendingProps.store.getState()
        appStates.push(state)
      } catch (e) { }

      base = base.child
    }

    const result = {
      tweets: appStates[0].entities.tweets.entities,
      users: appStates[0].entities.users.entities,
      sort_order: appStates[0].urt.bookmarks
        ? appStates[0].urt.bookmarks.entries
        : [],
    }

    return new Promise((resolve) => setTimeout(() => resolve(result), 0))
  },
  grabTweetContext: (args) => {
    let tweet_container = document.getElementById(args.uuid)
    const reactHandlerKey = Object.keys(tweet_container).filter(
      (item) => item.indexOf("__reactProps") >= 0
    )
    const react_data = tweet_container[reactHandlerKey[0]]

    let tweet_id = react_data.children.props.entryId
      .replace("tweet-", "")
      .replace("tweet:", "")

    let appStates = []
    let reactRoot = document.getElementById("react-root")
    let base = reactRoot._reactRootContainer._internalRoot.current
    while (base) {
      try {
        let state = base.pendingProps.store.getState()
        appStates.push(state)
      } catch (e) { }
      base = base.child
    }

    let full_data = {
      tweet_id: tweet_id,
      tweets: appStates[0].entities.tweets.entities,
      users: appStates[0].entities.users.entities,
      sort_order: appStates[0].urt.home ? appStates[0].urt.home.entries : [],
      parsed_sort_order: {},
    }
    let valid_tweets = full_data.sort_order.filter((e) => e.type == "tweet")
    valid_tweets.forEach((t) => {
      full_data.parsed_sort_order[t.content.id] = t.sortIndex
    })

    return new Promise((resolve) => setTimeout(() => resolve(full_data), 0))
  },
  parseTweet: (tweet, _bookmarks) => {
    let local_bookmarks = _bookmarks ? _bookmarks : bookmarks

    if (!tweet.bookmarked) {
      return
    }

    // Check user
    const user = local_bookmarks.users[tweet.user]
    if (!user) {
      return
    }

    // Get medias object
    const media_src =
      tweet?.extended_entities?.media && tweet?.extended_entities?.media.length
        ? tweet.extended_entities.media
        : tweet.entities.media

    let quote_status
    if (tweet.is_quote_status && local_bookmarks.tweets[tweet.quoted_status]) {
      quote_status = utils.parseTweet(
        local_bookmarks.tweets[tweet.quoted_status],
        local_bookmarks
      )
    }

    let tweet_text = tweet.text
    if (tweet.display_text_range && tweet.display_text_range.length == 2) {
      tweet_text = tweet_text.substring(
        tweet.display_text_range[0],
        tweet.display_text_range[1]
      )
    }

    return {
      id: tweet.id_str,
      conversation_id: tweet.conversation_id_str,
      created_at: tweet.created_at,
      text: tweet_text,
      reply_count: tweet.reply_count,
      retweet_count: tweet.retweet_count,
      is_self_thread: !!tweet.self_thread,
      quote_count: tweet.quote_count,
      view_count: tweet.views ? tweet.views.count : 0,
      favorite_count: tweet.favorite_count,
      user: {
        id: user.id_str,
        name: user.name,
        screen_name: user.screen_name,
        profile_image_url: user.profile_image_url_https,
        followers_count: user.followers_count,
        favourites_count: user.favourites_count,
        friends_count: user.friends_count,
        verified: user.verified || false,
      },
      medias: media_src
        ? media_src.map((media) => {
          let video_src
          if (media.type == "video" && media.video_info) {
            video_src = media.video_info.variants
          }

          return {
            type: media.type,
            url: media.media_url_https,
            media_url: media.expanded_url,
            video_src: video_src,
          }
        })
        : [],
      quote_status: quote_status,
      sort_order: local_bookmarks.parsed_sort_order[tweet.id_str],
    }
  },
  parseLikedTweet: (tweet) => {
    if (!tweet.favorited) {
      return
    }

    let local_bookmarks = bookmarks

    // Check user
    const user = local_bookmarks.users[tweet.user]
    if (!user) {
      return
    }

    // Get medias object
    const media_src =
      tweet?.extended_entities?.media && tweet?.extended_entities?.media.length
        ? tweet.extended_entities.media
        : tweet.entities.media

    let quote_status
    if (tweet.is_quote_status && local_bookmarks.tweets[tweet.quoted_status]) {
      quote_status = utils.parseLikedTweet(
        local_bookmarks.tweets[tweet.quoted_status],
        local_bookmarks
      )
    }

    let tweet_text = tweet.text
    if (tweet.display_text_range && tweet.display_text_range.length == 2) {
      tweet_text = tweet_text.substring(
        tweet.display_text_range[0],
        tweet.display_text_range[1]
      )
    }

    return {
      id: tweet.id_str,
      conversation_id: tweet.conversation_id_str,
      created_at: tweet.created_at,
      text: tweet_text,
      reply_count: tweet.reply_count,
      retweet_count: tweet.retweet_count,
      is_self_thread: !!tweet.self_thread,
      quote_count: tweet.quote_count,
      view_count: tweet.views ? tweet.views.count : 0,
      favorite_count: tweet.favorite_count,
      user: {
        id: user.id_str,
        name: user.name,
        screen_name: user.screen_name,
        profile_image_url: user.profile_image_url_https,
        followers_count: user.followers_count,
        favourites_count: user.favourites_count,
        friends_count: user.friends_count,
        verified: user.verified || false,
      },
      medias: media_src
        ? media_src.map((media) => {
          let video_src
          if (media.type == "video" && media.video_info) {
            video_src = media.video_info.variants
          }

          return {
            type: media.type,
            url: media.media_url_https,
            media_url: media.expanded_url,
            video_src: video_src,
          }
        })
        : [],
      quote_status: quote_status,
      sort_order: null,
    }
  },
  CreateUUID: () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  },
}

  ; (function () {
    "use strict"
    // let link = document.createElement('link');
    // link.setAttribute('rel', 'stylesheet');
    // link.setAttribute('type', 'text/css');
    // link.setAttribute('href', './fonts.css');
    // document.head.appendChild(link);
    // Plugin Constructor
    var TagsInput = function (opts) {
      this.options = Object.assign(TagsInput.defaults, opts)
      this.init()
    }

    // Initialize the plugin
    TagsInput.prototype.init = function (opts) {
      this.options = opts ? Object.assign(this.options, opts) : this.options

      if (this.initialized) this.destroy()

      if (
        !(this.orignal_input = document.getElementById(this.options.selector))
      ) {
        console.error("tags-input couldn't find an element with the specified ID")
        return this
      }

      this.arr = []
      this.wrapper = document.createElement("div")
      this.input = document.createElement("input")
      init(this)
      initEvents(this)

      this.initialized = true
      return this
    }

    // Add Tags
    TagsInput.prototype.addTag = function (string) {
      if (this.anyErrors(string)) return

      this.arr.push(string)
      var tagInput = this

      var tag = document.createElement("span")
      tag.className = this.options.tagClass
      tag.innerText = string

      var closeIcon = document.createElement("a")
      closeIcon.innerHTML = "&times;"

      // delete the tag when icon is clicked
      closeIcon.addEventListener("click", function (e) {
        e.preventDefault()
        var tag = this.parentNode

        for (var i = 0; i < tagInput.wrapper.childNodes.length; i++) {
          if (tagInput.wrapper.childNodes[i] == tag) tagInput.deleteTag(tag, i)
        }
      })

      tag.appendChild(closeIcon)
      this.wrapper.insertBefore(tag, this.input)
      this.orignal_input.value = this.arr.join(",")

      return this
    }

    // Delete Tags
    TagsInput.prototype.deleteTag = function (tag, i) {
      tag.remove()
      this.arr.splice(i, 1)
      this.orignal_input.value = this.arr.join(",")
      return this
    }

    // Make sure input string have no error with the plugin
    TagsInput.prototype.anyErrors = function (string) {
      if (this.options.max != null && this.arr.length >= this.options.max) {
        console.log("max tags limit reached")
        return true
      }

      if (!this.options.duplicate && this.arr.indexOf(string) != -1) {
        console.log('duplicate found " ' + string + ' " ')
        return true
      }

      return false
    }

    // Add tags programmatically
    TagsInput.prototype.addData = function (array) {
      var plugin = this

      array.forEach(function (string) {
        plugin.addTag(string)
      })
      return this
    }

    // Get the Input String
    TagsInput.prototype.getInputString = function () {
      return this.arr.join(",")
    }

    // destroy the plugin
    TagsInput.prototype.destroy = function () {
      this.orignal_input.removeAttribute("hidden")

      delete this.orignal_input
      var self = this

      Object.keys(this).forEach(function (key) {
        if (self[key] instanceof HTMLElement) self[key].remove()

        if (key != "options") delete self[key]
      })

      this.initialized = false
    }

    // Private function to initialize the tag input plugin
    function init(tags) {
      tags.wrapper.append(tags.input)
      tags.wrapper.classList.add(tags.options.wrapperClass)
      tags.orignal_input.setAttribute("hidden", "true")
      tags.orignal_input.parentNode.insertBefore(tags.wrapper, tags.orignal_input)
    }

    // initialize the Events
    function initEvents(tags) {
      tags.wrapper.addEventListener("click", function () {
        tags.input.focus()
      })

      tags.input.addEventListener("keydown", function (e) {
        var str = tags.input.value.trim()

        if (!!~[9, 13, 188].indexOf(e.keyCode)) {
          e.preventDefault()
          tags.input.value = ""
          if (str != "") tags.addTag(str)
        }
      })
    }

    // Set All the Default Values
    TagsInput.defaults = {
      selector: "",
      wrapperClass: "tags-input-wrapper",
      tagClass: "tag",
      max: null,
      duplicate: false,
    }

    window.TagsInput = TagsInput
  })()
