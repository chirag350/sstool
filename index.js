// ONLY WORKS WITH PXL.BLUE
// Copyright © 2021 Chirag.#0001
const axios = require('axios')
const clipboardy = require('clipboardy');
const fs = require('fs');
const FormData = require('form-data');
const shelljs = require('shelljs');
// config start
const keyfrompxl = '' // get your upload key from pxl.blue
const hostfrompxl = '' // the domain you want, like everything.is-bannable.xyz, must be a valid one
// config end
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
let data = new FormData();
const filename = makeid(20)
const dir = `/home/$HOME/images/` + filename + '.png'
shelljs.exec(`gnome-screenshot -a -f ${dir}`)
data.append('file', fs.createReadStream(dir), `${filename}.png`)
data.append('key', keyfrompxl)
data.append('host', hostfrompxl)
axios.post('https://api.pxl.blue/upload/extra', data, {
    headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        "User-Agent": "ShareX/13.4.0",
    }
})
    .then(function (response) {
        shelljs.exec(`rm ${dir}`)
        axios.post('https://api.pxl.blue/upload/shorten', {
            key: keyfrompxl,
            host: hostfrompxl,
            destination: response.data.url,
        }, {
            headers: {
                "Content-Type": `application/json`,
            }
        })
            .then(function (res) {
                clipboardy.writeSync(res.data.url);
            })
    })
    .catch(function (response) {
        //handle error
        console.log(response);
    });
