var proc = require('node:child_process');


var execLoad = (options) => {
    var install = proc.exec(options.cmd);

    process.stdout.write(options.txtStart);

    install.stdout.on('data', (chunk) => {
        process.stdout.write('.');
    });

    return new Promise((res) => {
        install.on('exit', (code) => {
            console.log(options.txtEnd);
            res(code);
        });
    });
};

execLoad({
    cmd : 'npm install',
    txtStart : 'Installing dependencies.',
    txtEnd : 'Dependencies installed.'
}).then((code) => {
    console.log('Everything is good to go!');
});