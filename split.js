/// <reference types="node" />

"use strict";

const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const FfmpegCommand = require('fluent-ffmpeg');
const sanitizeFilename = require('sanitize-filename');

function formatNumber(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
}

function splitTrack(filepath, outdir, data, trackIdx) {
  console.log(`Splitting track ${trackIdx}...`)

  const track = data.tracks[trackIdx];
  const nextTrack = data.tracks[trackIdx + 1];

  const filename = sanitizeFilename(`${formatNumber(track.number)} - ${track.title}.mp3`);

  const outpath = path.join(outdir, filename);

  const command = new FfmpegCommand(filepath)
    .audioCodec('libmp3lame')
    .seekInput(track.seconds)
    .outputOptions('-write_xing 0');

  if (nextTrack) {
    const duration = nextTrack.seconds - track.seconds;
    command.duration(duration);
  }

  command.outputOptions('-metadata', `title="${track.title}"`)
  command.outputOptions('-metadata', `artist="${data.artist}"`)
  command.outputOptions('-metadata', `album="${data.album}"`)
  command.outputOptions('-metadata', `track="${track.number}/${data.tracks.length}"`)

  command.save(outpath);
}

function main() {
  const argv = minimist(process.argv.slice(2));

  const dataFilename = argv['d'] || argv.data;
  const outputPath = argv['o'] || argv.out;
  const audioFilename = argv._[0];

  if (!dataFilename) {
    console.error('no data file specified')
    process.exit(1);
  }

  if (!outputPath) {
    console.error('no output path specified');
    process.exit(1);
  }

  if (!audioFilename) {
    console.error('no audio file specified');
    process.exit(1);
  }

  const jsonData = fs.readFileSync(dataFilename, {encoding: 'utf8'});
  const data = JSON.parse(jsonData);

  for (let idx = 0; idx < data.tracks.length; idx++) {
    splitTrack(audioFilename, outputPath, data, idx);
  }
}

main();