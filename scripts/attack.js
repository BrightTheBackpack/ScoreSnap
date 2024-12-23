// const { all } = require("core-js/fn/promise");


// const  jsPDF  = window.jspdf && window.jspdf.jsPDF;
// const  svg2pdf  = window.svg2pdf && window.svg2pdf.svg2pdf;

// const  SVGtoPDF = window.svgtopdfkit && window.svgtopdfkit.SVGtoPDF;

console.log("Content script loaded.");


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message.type === 'pdf'){
        await grabber(sendResponse);

    }
    if(message.type === 'midi'){
        midi();
        sendResponse({status: 'done'});

    }
    if(message.type === 'audio'){
        audio();
        sendResponse({status: 'done'});
    }
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
async function grabber(sendResponse){
    console.log("grabbing")
    const stepComponent = document.getElementById('step-4');

    allLinks = [];
    classname = "";
        let scrollerComponent = document.getElementById('jmuse-scroller-component');
        // canvas.width = 1000; // Adjust as needed
        // canvas.height = 2000; 
        let index = 0;
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
                            allLinks.push(img.src);
                            console.log("grabbing image")


                        }else{
                            console.log("image not part of score")
                        }
                      

                    }catch(e){
                        console.error(e)
                    }
                }



            }
  
            if (scrollerComponent.scrollHeight - scrollerComponent.scrollTop <= scrollerComponent.clientHeight + 100            ) {
                // Stop scrolling when the bottom is reached
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
                    link.click(); // Trigger the download
                    sendResponse({status: 'done'});
                })
                .catch(error => {
                    console.error('Error fetching PDF:', error);
                });
    

      
            }
        }, 1000);

        console.log(scrollerComponent.innerHTML)

    

    if (stepComponent) {
        stepComponent.innerHTML = 'Hello World!';
    }

}
window.addEventListener('load', () => {
    // grabber()

})