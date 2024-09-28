const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Income = require('../models/Income'); // Assuming you have these models
const Expense =require('../models/Expense');
const {generatePDF,uploadToS3} = require('../services/AwsService');
const fs = require('fs');
//const uploadToS3 = require('../services/AwsService');
// Endpoint to get report data based on type (daily, weekly, monthly, yearly)
router.get('/report/:type', async (req, res) => {
    const { type } = req.params;

    let startDate;
    const endDate = new Date();

    switch (type) {
        case 'daily':
            startDate = new Date(endDate);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'weekly':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 7);
            break;
        case 'monthly':
            startDate = new Date(endDate);
            startDate.setMonth(endDate.getMonth() - 1);
            break;
        case 'yearly':
            startDate = new Date(endDate);
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        default:
            return res.status(400).json({ error: 'Invalid report type' });
    }

    try {
        const incomes = await Income.findAll({
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
        const expenses = await Expense.findAll({
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
         console.log(incomes);
         console.log(expenses);
        res.json({ incomes, expenses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch report data',error });
    }
});
router.post('/download-report', async (req, res) => {
  const htmlContent = req.body.html; // This would be the entire HTML of the report page
  const fileName = 'report.pdf';
  const bucketName = 'expense-tracker-report';
  const keyName = `reports/${fileName}`;

  try {
      const pdfPath = await generatePDF(htmlContent, fileName);
	  console.log(pdfPath,'it is undefined');
      const s3Url = await uploadToS3(pdfPath, bucketName, keyName);

      // Remove the PDF from the local server after uploading
      //fs.unlinkSync(pdfPath);

      // Respond with the S3 URL to download the file
      res.json({ downloadUrl: s3Url });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error generating or uploading PDF');
  }
});
module.exports = router;
