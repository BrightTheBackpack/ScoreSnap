const express = require("express");
const cors = require("cors")
const SVGtoPDF = require("svg-to-pdfkit");
const { convert } = require('convert-svg-to-png');
import request from "request";
const PDFDocument  = require("pdfkit");
import sharp from 'sharp';

const XHR = require("xmlhttprequest").XMLHttpRequest;
const targetUrl = "https://s3.ultimate-guitar.com/musescore.scoredata/g/c0251f563b2bcfa165121936c9e4ffeec0325429/score_4.svg?response-content-disposition=attachment%3B%20filename%3D%22score_4.svg%22&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4SHNMJS3MTR9XKK7ULEP%2F20241110%2Fus-west%2Fs3%2Faws4_request&X-Amz-Date=20241110T062817Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=ee974ae54e5469d86ca46ccf46b58729b192d2a56f3697395a5c3399afa3f315";
const encodedUrl = encodeURIComponent(targetUrl); 
// console.log(encodedUrl)
const extTypeMap = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'webp': 'image/webp'
};
export const getImageDataUri = async (url) => {
  try {
    const stream = request(url),
      buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      }),
      dataUri = `data:${extTypeMap[url.split(".").pop()] || "image/png"};base64,${buffer.toString("base64")}`;

    return dataUri;
  } catch {
    return "";
  }
}

const app = express();
app.use(
    cors({
      origin: "*",
    })
);
app.get("/", (req, res) => {
  let url = req.query.url;
  console.log(url)
  if(!url){
    url = "https://jsonplaceholder.typicode.com/posts/1"
  }
  try{
    const decodedUrl = decodeURIComponent(url);
    fetch(decodedUrl).then((response) => response.text()).then((data) => {
      res.send(data)
    })
  }catch(e){
    res.send(e)
  }
  
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow all methods
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); 
  next(); // Continue to the next middleware or route handler
});
app.get("/proccess", async (req, res) => {

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged_pdf.pdf"');
  
    const doc = new PDFDocument();
    console.log('PDF document initialized');

    let urls = decodeURIComponent( req.query.urls).split(",");
    if (!urls || urls.length === 0) {
      throw new Error("No URLs provided");
    }
    let index = 0;
    doc.pipe(res);
  
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index];
      console.log(url); // Check the URL being processed
      if(url.includes(".svg")){
        console.log('Starting image processing for URL:', url);

        const response = await fetch(url);
        console.log('Fetch response status:', response.status);

        const data = await response.text();
        console.log('SVG content length:', data.length);

        if (!data || !data.includes("<svg")) {
          throw new Error(`Invalid SVG content from ${url}`);
        }
        const scalerFactor = 4;
        // const png = await convert(data);
        console.log('Converting SVG to PNG...');

        const png = await sharp(Buffer.from(data)).png().toBuffer();        
        console.log('PNG buffer size:', png.length);
        const metadata = await sharp(png).metadata();
        console.log('PNG dimensions:', metadata.width, 'x', metadata.height);
    
        doc.addPage({ size: [612, 792] });
        console.log('Adding image to PDF');

      
      
        const scaleFactor = Math.min(612 / png.width, 792 / png.height); 
        const imgWidth = png.width * scaleFactor;
        const imgHeight = png.height * scaleFactor;
  
        doc.image(png, 0, 0, { fit: [612, 792],align: 'center', valign: 'center' });
        await new Promise(resolve => setTimeout(resolve, 100));  
        console.log('Flushing pages');

        doc.flushPages();  

      }else if(url.includes(".png")){
        let img = await getImageDataUri(url);
        doc.addPage({ size: [612, 792] });
        console.log(img)
        doc.image(img, 0, 0, { fit: [612, 792] });
        await new Promise(resolve => setTimeout(resolve, 100)); 
        doc.flushPages();  
  
      }
  
    }
    console.log('All files processed, ending document');
    doc.on('end', () => {
      console.log('PDF document ended successfully');
    });
    
    // Handle any errors during PDF creation
    doc.on('error', (err) => {
      console.error('Error during PDF creation:', err);
    });
    doc.end();


 
  // const buffer = await new Promise((resolve, reject) => {
  //   doc.pipe(res).on('finish', resolve).on('error', reject);
  // });

  // Set headers to indicate PDF content
});


const PORT = 1891;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  } else {
    console.error(err);
  }
});
module.exports = app;
