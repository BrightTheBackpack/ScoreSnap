
grabbing = false;
let midi_url = null;
let auth = null;
async function grab() {
    const [tab] = await chrome.tabs.query({active: true});
    console.log(tab);
    console.log(tab.url);
    if (tab.url.includes("musescore.com/user")) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "msg_from_popup"}, function(response) {
            });
        });
        return tab.url;
    } else {
        return 'Could not grab: Not a musescore.com page';
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("button").addEventListener("click", async () => {
        // if (!grabbing) grab();
        console.log('clicked');
        document.getElementById("button").setAttribute("disabled", "true");
        document.getElementById("button").style.backgroundColor = "gray";

        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        chrome.tabs.sendMessage(tab.id, {type: 'pdf'}, function(response) {
            if(response && response.status === 'done'){
                document.getElementById("button").setAttribute("disabled", "false");
                document.getElementById("button").style.backgroundColor = "green";
    
            }
            });
    });
    document.getElementById("midi").addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        // chrome.tabs.sendMessage(tab.id, {type: 'midi'}, function(response) {
        //     // console.log(response.status);
        // });
        document.getElementById("button").setAttribute("disabled", "true");
        document.getElementById("button").style.backgroundColor = "gray";

        console.log(auth, "auth", midi_url, "midi_url");
        if(midi_url == null || auth == null){
            chrome.tabs.sendMessage(tab.id, {type: 'midi'}, function(response) {
                setTimeout(() => {
                    fetch(midi_url, {
                        headers: {
                            'Authorization': auth
                        }
                    }).then(response => response.json()).then(json => {
                        const url = json.info.url;
                        console.log("url", url);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'midi.midi';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        document.getElementById("midi").setAttribute("disabled", "false");
                        document.getElementById("midi").style.backgroundColor = "green";
        
                    });   
                }, 200);
                  });
        }else{
    
            fetch(midi_url, {
                headers: {
                    'Authorization': auth
                }
            }).then(response => response.json()).then(json => {
                const url = json.info.url;
                console.log("url", url);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'midi.midi';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                document.getElementById("midi").setAttribute("disabled", "false");
                document.getElementById("midi").style.backgroundColor = "green";

            });
        }
      
   
    
    
    })
    document.getElementById("audio").addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        chrome.tabs.sendMessage(tab.id, {type: 'audio'}); 
    });
})


  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
    if(details.url.includes("midi")){
        midi_url = details.url;
        auth = details.requestHeaders[1].value;
        console.log(auth);
    }
    },
    { urls: ["https://*.musescore.com/*"] },
    ["requestHeaders"]
  );
  