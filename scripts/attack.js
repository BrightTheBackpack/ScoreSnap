// const { all } = require("core-js/fn/promise");


// const  jsPDF  = window.jspdf && window.jspdf.jsPDF;
// const  svg2pdf  = window.svg2pdf && window.svg2pdf.svg2pdf;

// const  SVGtoPDF = window.svgtopdfkit && window.svgtopdfkit.SVGtoPDF;

console.log("Content script loaded.");


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message.type === 'pdf'){
        grabber()
        .then(() => {
            console.log("Grabber finished successfully");
            sendResponse({status: 'done'});
        })
        .catch((error) => {
            console.error("Grabber failed:", error);
            sendResponse({status: 'error', error: error.message});
        });
    
    // Return true to indicate we'll send a response asynchronously
    return true;    }
    if(message.type === 'midi'){
        midi();
        sendResponse({status: 'done'});

    }
    if(message.type === 'audio'){
        audio();
        sendResponse({status: 'done'});
    }
    return true;
});

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function midi(){
    console.log('midi clicking')
    const button = document.getElementById("piano-keyboard-button")
    button.click();
    setTimeout(() => {
        button.click();

    },200);


}
function audio(){
    let audio = document.getElementsByTagName("audio")
    if(audio.length == 0){
        let playbutton = document.getElementById("scorePlayButton")
        playbutton.click()
        // setTimeout(()=>{playbutton.click()},1000)
        setTimeout(()=>{
            audio = document.getElementsByTagName("audio")
            let url = audio[0].src
            const link = document.createElement('a');
            link.href = url
            link.download = 'audio.mp3'
            document.body.appendChild(link); 
            link.click()
        },100)
  
    }else{
        console.log(audio)
        let url = audio[0].src
        const link = document.createElement('a');
        link.href = url
        link.download = 'audio.mp3'
        document.body.appendChild(link); 
        link.click()
    }

}
async function grabber(){
    console.log("grabbing")
    let maxAttemps = 10;
    const stepComponent = document.getElementById('step-4');
    let pagenum = 0;
    let allLinks = [];
    let classname = "";
        let scrollerComponent = document.getElementById('jmuse-scroller-component');
        const images = scrollerComponent.querySelectorAll('img');
        pagenum = images[0].alt.slice(-10).replace(/^\D+|\D+$/g, "")
        // canvas.width = 1000; // Adjust as needed
        // canvas.height = 2000; 
        let index = 0;
        return new Promise((resolve, reject) => {
            const scroll = setInterval(async () => {
                console.log("scrolling")
                scrollerComponent.scrollBy(0, 1000);
                scrollerComponent = document.getElementById('jmuse-scroller-component');
                const images = scrollerComponent.querySelectorAll('img');
                if(allLinks.length == 0){
                    classname = images[0].className;
                }
                for(img of images){
                    if(allLinks.includes(img.src)){
                        console.log("already grabbed image")}
                    else{
                        try{
                            if(img.className == classname){
    
                                if(img.src != ""){
                                    // console.log(img.src)
                                    allLinks.push(img.src);
                                    // console.log("grabbing image")
        
                                };
    
    
                            }else{
                                console.log("image not part of score")
                            }
                          
    
                        }catch(e){
                            console.error(e)
                            
                        }
                    }
    
    
    
                }
    
      
                if (scrollerComponent.scrollHeight - scrollerComponent.scrollTop <= scrollerComponent.clientHeight + 100 &&(allLinks.length==pagenum)    ) {
                    // Stop scrolling when the bottom is reached
                    console.log(allLinks)
                    console.log(allLinks.length)
                    if(allLinks.length != pagenum){
                        return "Error: Try increasing delay in the settings(top right)"
                    }
                    clearInterval(scroll);
                    const apiUrl = 'https://score-snap.vercel.app/proccess'; // Replace with your server's URL and port
                 
    
                    const urlParams = new URLSearchParams({ urls: allLinks.join(',') });
                    const finalUrl = `${apiUrl}?${urlParams.toString()}`;
    
                    fetch(finalUrl)
                    .then(response => {
                        if (!response.ok) {
                            console.log(response)
                        throw new Error('Network response was not ok'); 
                        }
                        return response.blob(); // Get the PDF as a Blob
                    })
                    .then(pdfBlob => {
                        let div = document.getElementById('aside-container-unique');
                        console.log(div)
                        let text = div.querySelector('h1')
                        console.log(text)
                         text = text.querySelector('span').innerText
                        const url = window.URL.createObjectURL(pdfBlob); // Create a temporary URL 
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = text+'.pdf'; // Set a filename for download
                        document.body.appendChild(link); // Add the link to the DOM
                        resolve(finalUrl);

                        link.click(); // Trigger the download
                    })
                    .catch(error => {
                        console.error('Error fetching PDF:', error);
                        reject(error);
                    });
                    return "response"
    
        
    
          
                }
            }, 500);
    
            console.log(scrollerComponent.innerHTML)
    

        })

        
    

    
}
window.addEventListener('load', () => {
    // grabber()

})