const express = require("express");
const cors = require("cors")
const SVGtoPDF = require("svg-to-pdfkit");
const pdfkit = require("pdfkit");
const PDFDocument  = require("pdfkit");
const XHR = require("xmlhttprequest").XMLHttpRequest;
const targetUrl = "https://s3.ultimate-guitar.com/musescore.scoredata/g/c0251f563b2bcfa165121936c9e4ffeec0325429/score_4.svg?response-content-disposition=attachment%3B%20filename%3D%22score_4.svg%22&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=4SHNMJS3MTR9XKK7ULEP%2F20241110%2Fus-west%2Fs3%2Faws4_request&X-Amz-Date=20241110T062817Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=ee974ae54e5469d86ca46ccf46b58729b192d2a56f3697395a5c3399afa3f315";
const encodedUrl = encodeURIComponent(targetUrl); 
// console.log(encodedUrl)

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

app.get("/proccess", async (req, res) => {
  const doc = new PDFDocument();
  let urls = decodeURIComponent( req.query.urls).split(",");
  let index = 0;
  doc.pipe(res);
  for (let index = 0; index < urls.length; index++) {
    const url = urls[index];
    console.log(url); // Check the URL being processed

    const response = await fetch(url);
    const data = await response.text();

    
    doc.addPage({ size: [612, 792] });

  
  
    SVGtoPDF(doc, data, 0, 0, {width:612, height:792, assumePt:true, preserveAspectRatio:"xMidYMin meet"}); //, {width: 612, assumePt: true}

    await new Promise(resolve => setTimeout(resolve, 100));  // Optional delay for debugging
    doc.flushPages();  // Explicitly flush pages after each SVG is added

  }
  doc.end();
  // const buffer = await new Promise((resolve, reject) => {
  //   doc.pipe(res).on('finish', resolve).on('error', reject);
  // });

  // Set headers to indicate PDF content
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="merged_pdf.pdf"');
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow all methods
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); 
  next(); // Continue to the next middleware or route handler
});
app.listen(4242, () =>{
  // console.log(encodedUrl)

  // console.log("Server ready on port 3000.")

    
} );
module.exports = app;
