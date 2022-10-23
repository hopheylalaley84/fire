const express = require('express');
const app = express();
const path = require('path');
var morgan = require('morgan');
var Api2Pdf = require('api2pdf');
var mkdirp = require('mkdirp');
var a2pClient = new Api2Pdf('ed231e48-a5f1-4644-abe1-71e9f22e88dd');
const download = require('download');
const PORT = 3000;
const chalk = require('chalk');
const { db } = require('./firebase.js');

// const createPath = (page) => path.resolve(__dirname,'files', `${page}.html`);
// http://localhost:3000/file?userId=3&fileId=fileid&fileurl=fileurl

const errorMsg = chalk.bgKeyword('white').redBright;
const sucessMsg = chalk.bgKeyword('green').white;


app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

async function docConvert(fileUrl) {
    try {
        const fin2 = await a2pClient.libreOfficeAnyToPdf(`${fileUrl}`);

        return fin2['Success'] == true ? fin2['FileUrl'] : 'error';
    } catch (error) {
        return 'error';
    }
};

async function docDownload(url, userId, fileId) {
    try {
        const file = url;
        const filePath = `${__dirname}/files`;
        const dirPath = await mkdirp(`${filePath}/${userId}/${fileId}/`);
        console.log(dirPath);
        await download(file, dirPath);
        return 'oky';
    } catch (error) {
        console.log(error);
        return 'err';
    }
};

async function fileUpdate(userId, fileId) {
    try {
        
        return 'oky';
    } catch (error) {
        console.log(error);
        return 'err';
    }
};


app.get('/file', async (req, res) => {

    let fileUrl = req.query.fileurl;
    let userID = req.query.userid;
    let fileID = req.query.fileid

    const res11 = await docConvert(fileUrl);
    if (res11 != 'error') {
        const resDownload = await docDownload(res11, `${userID}`, `${fileID}`);
        resDownload == 'oky' ? res.status(200).send('Download OK') : res.status(500).send('bad1');
    } else {
        res.status(500).send('bad2');
    }
    // console.log(res11);

});


