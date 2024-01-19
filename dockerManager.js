const fs = require('fs');
const { promisify } = require('node:util')
const exec = promisify(require('node:child_process').exec);

async function up (composeInfo) {
    fs.writeFileSync('docker_compose.yaml', composeInfo);
    const command = `docker compose -f docker_compose.yaml up`;
    const result = exec(command);

    return result;
}

function down () {
    const command = 'docker compose -f docker_compose.yaml down';
    const result = exec(command);

    return result;
}

module.exports = {up, down};