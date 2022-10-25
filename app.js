const express = require('express');
const app = express();
const path = require('path');
var Api2Pdf = require('api2pdf');
var mkdirp = require('mkdirp');
var a2pClient = new Api2Pdf('ed231e48-a5f1-4644-abe1-71e9f22e88dd');
const download = require('download');
const PORT = 3000;
const { db } = require('./firebase.js');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var ip = require("ip");
console.dir ( ip.address() );

// const createPath = (page) => path.resolve(__dirname,'files', `${page}.html`);
// http://localhost:3000/file?userId=3&fileId=fileid&fileurl=fileurl

var jsonParser = bodyParser.json();



async function docConvert(fileUrl) {
    try {
        const fin2 = await a2pClient.libreOfficeAnyToPdf(`${fileUrl}`);

        return fin2['Success'] == true ? fin2['FileUrl'] : 'error';
    } catch (error) {
        console.log(error);
        return 'error';
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


app.post('/upload', fileUpload({createParentPath : true}), async (req, res) => {

    const file = req.files;
    console.log(file);
    console.dir ( ip.address() );

    res.json({'status' : 'ok'});

    // console.log(req.body['FirstName']);
    // res.json('req.body');
    //     let fileUrl = req.query.fileurl;
    //     let userID = req.query.userid;
    //     let fileID = req.query.fileid
    //     // let fileUrl1 = 'https://firebasestorage.googleapis.com/v0/b/fireprint-e7649.appspot.com/o/xenNlA24glaqqlms6OJ8VSLcoxx2%2Ffiles%2F%D1%81%D1%87%D0%B5%D1%82.xls?alt=media&token=265965c8-92b4-441b-b244-a480fedcbb46';


    //    var  a = fileUrl.replace("---", "&token");
ß
    // const res11 = await docConvert('https://firebasestorage.googleapis.com/v0/b/fireprint-e7649.appspot.com/o/xenNlA24glaqqlms6OJ8VSLcoxx2%2Ffiles%2F%D1%81%D1%87%D0%B5%D1%82.xls?alt=media&token=265965c8-92b4-441b-b244-a480fedcbb46');
    // if (res11 != 'error') {
    //     const resDownload = await docDownload(res11, `${userID}`, `${fileID}`);
    //     resDownload == 'oky' ? res.status(200).send('Download OK') : res.status(500).send('bad1');
    // } else {
    //     res.status(500).send('bad2');
    // }
    // console.log(res11);

});

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});