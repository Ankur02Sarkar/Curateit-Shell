
export async function getActiveTabURL() {
    const tabs = await window.chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tabs[0];
}


export const sendSocialImportToChrome = async (value, tab) => {
  if (tab) {
    window.chrome.tabs.sendMessage(tab.id, {
      id: "IMPORT_SOCIAL_POSTS",
      value: value,
    })
  }
}