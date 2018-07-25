'use strict';
$(function(){

/*
================================================================================
  Variables & Consts
================================================================================
*/

// Dom Elements
const convertButton   = $('.convert-button');
const downloadButton  = $('.download-button');
const progressBar     = $('.progress-bar');
const progressText    = $('.progress-text');

// Temporary
const uploadPath      = './downloads/';

// Library
const fs              = require('fs');
const ytdl            = require('ytdl-core');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg          = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
module.exports        = ffmpeg;

/*
================================================================================
  Form
================================================================================
*/

$('.convert-form').on('submit', (event) => {

  // Form variables
  let url     = $(this).find('input[name="youtube-link"]').val();
  let format  = $(this).find('select[name="format"]').val();

  try {

    // Start processing when video information is received
    $.when(ytdl.getInfo(url)).then((data) => {

      // Stream & Converter
      let stream    = ytdl(url);
      let converter = ffmpeg(stream);

      // Format
      converter.toFormat(format);

      // High quality audio
      converter.audioQuality(0);
      converter.audioChannels(2);

      // High quality video
      // converter.videoCodec((/codecs="(.*)"/).exec(data.formats[5].type)[1]);
      converter.fps(data.formats[5].fps);
      converter.videoCodec('libx264');
      converter.size(data.formats[5].size);

      // Events
      converter.on('start', () => {
        convertButton.attr("disabled", true);
      });

      stream.on('progress', (chunkLength, downloaded, total) => {

        let percent = (downloaded / total * 100).toFixed(2);
        progressText.text(percent + '% Converted');
        progressBar.css({width: percent +'%'});

      });

      converter.on('end', () => {

        // Download
        downloadButton.attr('href', (uploadPath + data.title +'.'+ format));
        downloadButton.attr('download', data.title);

        // Reset
        progressText.text('0% Converted');
        progressBar.css({width: '0%'});
        convertButton.attr("disabled", false);
        convertButton.addClass('d-none');
        downloadButton.removeClass('d-none');

      });

      downloadButton.on('click', () => {

        convertButton.removeClass('d-none');
        downloadButton.addClass('d-none');

      });

      // Save the converted file
      converter.save(uploadPath + data.title +'.'+ format);

    });

  }catch(e) {

    alert('There was a problem, please try again later...');

  }

  event.preventDefault();

});


});
