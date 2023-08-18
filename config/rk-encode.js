const spawn = require('child_process').spawn;
const rkmppenc = process.env.RKMPPENC;

const input = process.env.INPUT;
const output = process.env.OUTPUT;
const preset = 'medium';
const crf = 23;

const args = ['--avhw', '--codec', 'h264', '--output-format', 'mp4'];

// Audio 設定
Array.prototype.push.apply(args, ['--audio-codec' ,'aac:aac_coder=twoloop', '--audio-stream', ":stereo"]);
Array.prototype.push.apply(args, ['--audio-bitrate' ,'128', '--audio-samplerate', "48000"]);

// input 設定
Array.prototype.push.apply(args,['-i', input]);

// video filter 設定
Array.prototype.push.apply(args,['--interlace', 'tff', '--vpp-yadif', 'mode=auto']);
Array.prototype.push.apply(args,['--output-res', '1280x720']);

// その他設定
Array.prototype.push.apply(args,[
    '--preset', preset,
    '--cqp', crf,
    '-o', output
]);

let str = '';
for (let i of args) {
    str += ` ${ i }`
}
console.error(str);

const child = spawn(rkmppenc, args);

child.stderr.on('data', (data) => { console.error(String(data)); });

child.on('error', (err) => {
    console.error(err);
    throw new Error(err);
});

process.on('SIGINT', () => {
    child.kill('SIGINT');
});
