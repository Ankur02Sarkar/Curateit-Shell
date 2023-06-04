import store                        from '../store'
// import { setCurrentTabDetails }     from '../actions/app/index'

export const fetchCurrentTab = () =>{
    return new Promise((resolve, reject) => {
        window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length !== 0) {
                // store.dispatch(setCurrentTabDetails(tabs[0]))
                resolve(tabs[0])
            }
            reject("Not fetched!")
        })
    })
}