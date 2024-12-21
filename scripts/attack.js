// const { all } = require("core-js/fn/promise");

// const  jsPDF  = window.jspdf && window.jspdf.jsPDF;
// const  svg2pdf  = window.svg2pdf && window.svg2pdf.svg2pdf;

// const  SVGtoPDF = window.svgtopdfkit && window.svgtopdfkit.SVGtoPDF;

console.log("Content script loaded.");

// async function combineSVG(svgs){
//     if(!jsPDF ){
//         console.error("jsPDF ");}
//     if(!SVG){
//         console.error("svg2pdf ");
//     }
//     const doc = new jsPDF();
//     console.log("starting")
//     for(svg of svgs){
//         console.log("combining")
//         console.log(svg)
//         svgString = null;
//         try{
//             const response = await fetch(svg);
//             svgString = await response.text();
//             console.log(svgString)
//         } catch(e){
//             console.error(e)
//             continue;
//         }

//         const canvasElement = document.createElement('canvas');
//         const ctx = canvasElement.getContext('2d');
//         const svgd = SVG().addTo(canvasElement).size(612,792).svg(svgString);


//         doc.addImage(canvasElement.toDataURL('image/png'), 'PNG', 0, 0); 

//         doc.addPage();
  

        
//     }
//     console.log("done")
//     doc.save('svgs.pdf');

// }
// const originalFetch = window.fetch;
// window.addEventListener('load', () => {
//     window.fetch = function (url, options) {
//         console.log('Request:', { url, options }); // Log the request
    
//         return originalFetch(url, options).then(response => {
//             if(url.includes("ultimate-guitar.com")){
//                 console.log('Response:', { status: response.status, headers: response.headers }); // Log the response
    
//             }
    
    
//             // You can modify the response here if needed
//             // For example, you could modify the body of the response:
//             // response.clone().json().then(data => {
//             //    // Modify data here
//             //    return response.clone().json();
//             // });
    
//             return response;
//         });
//     };
// })
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'invoke_grabber') {
        grabber();
        sendResponse({status: 'grabber invoked'});
    }
});

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function grabber(){
    console.log("grabbing")
    const stepComponent = document.getElementById('step-4');

    allLinks = [];
        let scrollerComponent = document.getElementById('jmuse-scroller-component');
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas); 
        canvas.width = 1000; // Adjust as needed
        canvas.height = 2000; 
        var ctx = canvas.getContext('2d');
        let index = 0;
        const scroll = setInterval(async () => {
            console.log("scrolling")
            scrollerComponent.scrollBy(0, 1000);
            scrollerComponent = document.getElementById('jmuse-scroller-component');
            const images = scrollerComponent.querySelectorAll('img');

            for(img of images){
                if(allLinks.includes(img.src)){
                    console.log("already grabbed image")}
                else{
                    try{
                        console.log("grabbing image")
                        allLinks.push(img.src);
                        // const response = await fetch("https://cors-beige-nine.vercel.app/?url=" +encodeURIComponent(img.src));
                        // console.log(response)
                        // const svgString = await response.text(); 
                        // const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 
                        // svgElement.innerHTML = svgString;
                        // document.body.appendChild(svgElement); 
                        // const bbox = svgElement.getBBox();
                        // const width = bbox.width;
                        // const height = bbox.height;
                        // const serializer = new XMLSerializer();
                        // const svgData = serializer.serializeToString(svgElement);
                        // const blob = new Blob([svgData], {type: 'image/svg+xml'});
                        // const url = URL.createObjectURL(blob);
                        // const imgs = new Image();
                        // imgs.crossOrigin = "anonymous"; 
                        // imgs.onload = () => {
                        //     ctx.drawImage(img, 0, height * index, width, height);
                        //     URL.revokeObjectURL(url); // Clean up the URL
                        // };
                        // console.log(url)
                        // imgs.src = url;

                        // allLinks.push(img.src);
                        // index++;
                        // // pdf.addImage(url, 'PNG', 0, 0, 210, 297);
                        // // pdf.addPage();
                        // await new Promise(resolve => {
                        //     resolve();
                        //   });
                        // const response = await fetch("https://cors-beige-nine.vercel.app/?url=" + encodeURIComponent(img.src));
                        // const svgString = await response.text(); 
                        // console.log(svgString)
                        // await doc.html(svgString, {
                        //     callback: (doc) => {
                        //       console.log("SVG added to PDF");
                        //       doc.addPage(); // Add a new page for the next SVG
                        //       index++;
                        //       return doc
                        //     },
                        //     x: 0,
                        //     y: 0,
                        //     html2canvas: {
                        //       scale: 1, // Adjust as needed
                        //       width: 612, // Set the width (in points)
                        //       height: 792 // Set the height (in points)
                        //     },
                        //     // ... (other options, if needed) 
                        //   });

                        //   var canvas = doc.canvas;
                        //   canvas.width = 612; // Adjust as needed
                        //   canvas.height = 792;
                        //   var ctx = canvas.getContext('2d');
                        //   co
                        // doc.svg(svgString, {
                        //     x:0,
                        //     y:0,
                        //     width: 612,
                        //     height: 792
                        // }).then(() => {
                        //     console.log("SVG added to PDF");
                        //     doc.addPage(); // Add a new page for the next SVG
                        //     index++;
                        // })
                        //   allLinks.push(img.src);

                        //   await new Promise(resolve => {
                        //     doc.callback = resolve; 
                        //   });
                
                

                    }catch(e){
                        console.error(e)
                    }
                }
                // if(!allLinks.includes(img.src)){
                //     var a = document.createElement('a');
                //     a.href = img.src;
                //     a.download = "test.svg";
                //     a.click();
                //     chrome.runtime.sendMessage({ action: 'downloadImage', imageData: img.src });

                //     img.crossOrigin = "anonymous";
                //     allLinks.push(img.src);
                //     const canvas = document.createElement('canvas');
                //     const context = canvas.getContext('2d');
                  
                //     // Set the canvas dimensions to match the image
                //     canvas.width = img.width;
                //     canvas.height = img.height;
                  
                //     // Draw the image img the canvas
                //     context.drawImage(img, 0, 0);
                  
                //     // Convert the canvas to a data URL
                //     const dataURL = canvas.toDataURL();
                  
                //     // Create a link element and trigger a download
                //     const link = document.createElement('a');
                //     link.href = dataURL;
                //     link.download = 'image.png'; // Set the desired filename
                //     link.click();
                // }

     


            }
            // images.forEach(img =>  () => {
                
            //     if(allLinks.includes(img.src)){
            //         console.log()
            //     }else{
            //         console.log("grabbing image")
            //         const image = new Image();
            //         image.crossOrigin = 'anonymous'; 
            //         image.src = img.src;
            //         allLinks.push(image.src);
                    
            //     }
                
            // });
            if (scrollerComponent.scrollHeight - scrollerComponent.scrollTop <= scrollerComponent.clientHeight + 100            ) {
                // Stop scrolling when the bottom is reached
                clearInterval(scroll);
                const apiUrl = 'https://cors-beige-nine.vercel.app/proccess'; // Replace with your server's URL and port
             

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
                    // Handle the PDF Blob, for example:
                    const url = window.URL.createObjectURL(pdfBlob); // Create a temporary URL 
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'merged_pdf.pdf'; // Set a filename for download
                    document.body.appendChild(link); // Add the link to the DOM
                    link.click(); // Trigger the download
                })
                .catch(error => {
                    console.error('Error fetching PDF:', error);
                });
                // document.body.appendChild(canvas); 

                // console.log(allLinks)
                // const dataUrl = canvas.toDataURL('image/png');
                // console.log(dataUrl)
                // const doc = new jsPDF();
                // doc.addImage(dataUrl, 'PNG', 0, 0);
                // doc.save('combined.pdf');
              


                // combineSVG(Object.keys(allLinks));

      
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