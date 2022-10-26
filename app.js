const express = require('express');
const app = express();
const path = require('path');
var Api2Pdf = require('api2pdf');
var mkdirp = require('mkdirp');
var a2pClient = new Api2Pdf('ed231e48-a5f1-4644-abe1-71e9f22e88dd');
const PORT = 3000;
const { db, storage } = require('./firebase.js');
var bodyParser = require('body-parser');
const Downloader = require("nodejs-file-downloader");
const fs = require('fs');
const pdf = require('pdf-page-counter');
var jsonParser = bodyParser.json();
var url = require('url');



app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});


async function docConvert(fileUrl) {
    try {
        const fin2 = await a2pClient.libreOfficeAnyToPdf(`${fileUrl}`);
        
        // const pdfPageNum = await pdf(fin2['FileUrl']);
        console.log(fin2['FileUrl']);
        console.log(fin2['FileUrl'].split('/')[3]);
        console.log(fin2['ResponseId']);
        // console.log(pdfPageNum['numpages']);

        return fin2['Success'] == true ? fin2['FileUrl'] : 'error';
    } catch (error) {
        console.log(error);
        return 'error';
    }
};


async function downloadFile(fileUrl, userId, fileId) {
    const downloader = new Downloader({
        url: fileUrl,
        directory: `./files/${userId}/${fileId}`,
    });
    try {
        const resDownload = await downloader.download();
        const fileUrlDone = url.pathToFileURL(resDownload['filePath']);
        const pdfPageNum = await pdf(fileUrl);        
       
        await db.collection('users').doc(userId).collection('files').doc(fileId).update({
            "fileUrlPdf":  fileUrlDone['pathname'],
            "filePagesCount": pdfPageNum['numpages'],
        });
        return 'ok';
    } catch (error) {
        console.log(error);
        return 'error';
    }
};

app.post('/post', jsonParser, async function (req, res) {
    const convertResult = await docConvert(req.body['url'])
    if (convertResult == null) {
        res.json({ "status": 'error' });
    } else {
        await mkdirp(`files/${req.body['userId']}/${req.body['fileId']}`).catch((e) => {
            console.log(e);
            return null;
        });
        const downloadRes = await downloadFile(convertResult, req.body['userId'], req.body['fileId'])
        if (downloadRes != 'error') {
            res.json({ "status": downloadRes });
        } else {
            res.json({ "status": 'error' });
            return;
        }
    }
});

