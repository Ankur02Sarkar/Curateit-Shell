let intervalForURL = setInterval(() => {
    if (window.location.href.includes("access_token")) {
        const tag = window.document.getElementsByTagName("pre")
        const o   = tag.length !== 0 ? JSON.parse(tag[0].innerHTML) : null
        clearInterval(intervalForURL)
        if (window.opener) {
            console.log("Name ===>", window.name)
            window.opener.postMessage(JSON.stringify({ userDetails: o ? JSON.stringify(o) : "", isSignedIn: o && o.user }), window.name)
        }
        window.close()
    }
}, 200)
