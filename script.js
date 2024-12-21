
grabbing = false;
async function grab() {
    const [tab] = await chrome.tabs.query({active: true});
    console.log(tab);
    console.log(tab.url);
    if (tab.url.includes("musescore.com/user")) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "msg_from_popup"}, function(response) {
                alert(response);
            });
        });
        return tab.url;
    } else {
        console.log("nah bro");
        document.getElementById("msg").innerText = 'Could not grab: Not a musescore.com page';
        return 'Could not grab: Not a musescore.com page';
    }
}

document.getElementById("button").addEventListener("click", async () => {
    if (!grabbing) grab();
    console.log('clicked');
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tab.id, {type: 'invoke_grabber'}, function(response) {
        console.log(response.status);
    });
});