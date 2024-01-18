const { promisify } = require('node:util')
const exec = promisify(require('node:child_process').exec);

async function up (composeInfo) {
    console.log(composeInfo)
    const result = exec('docker -v');

    return result;
}

function down (composeInfo) {
    console.log(composeInfo)
}

module.exports = {up, down};