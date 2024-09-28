const AWS = require('aws-sdk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure AWS environment variables are set
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    throw new Error('AWS credentials or region not configured');
}

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

async function generatePDF(htmlContent, fileName) {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
	    console.log(browser,'first step of generating pdf');
        const page = await browser.newPage();
        await page.setContent(htmlContent);
	 if(!page){
               console.log('page not formed');
	 }
	    if(page){console.log('page formed');}
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Save PDF locally
        const pdfPath = path.join(__dirname, fileName);
	   if(!pdfPath){ console.log('pdf path in awsservice is not working');}
        fs.writeFileSync(pdfPath, pdfBuffer);

        return pdfPath;
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

async function uploadToS3(filePath, bucketName, keyName) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const params = {
            Bucket: bucketName,
            Key: keyName,
            Body: fileContent,
            ContentType: 'application/pdf',
            ACL: 'public-read'
        };

        const data = await s3.upload(params).promise();

        // Optionally, clean up the local file after upload
        fs.unlinkSync(filePath);

        return data.Location; // S3 file URL
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('S3 upload failed');
    }
}

module.exports = { uploadToS3, generatePDF };
