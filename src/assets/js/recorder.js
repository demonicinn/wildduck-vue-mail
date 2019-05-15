(function (window) {
  // compatible
  window.URL = window.URL || window.webkitURL;
  // Get the media stream MediaStream object instance
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  const Recorder = function (stream, config) {
    config = config || {};
    config.sampleBits = config.sampleBits || 16;            // Output sample digit 8, 16
    config.sampleRate = config.sampleRate || (44100 / 1);   // Output sampling rate (need to balance the recording file size 44100/6)

    const context = new AudioContext();
    //Need to pass in a MediaStream object
    const audioInput = context.createMediaStreamSource(stream);
    //Create a ScriptProcessorNode for handling audio directly via JavaScript
    const recorder = context.createScriptProcessor(4096, 1, 1);

    const audioData = {
      size: 0,                                    // Recording file length
      buffer: [],                                 // Recording buffer
      inputSampleRate: context.sampleRate,        // Input sampling rate
      inputSampleBits: 16,                        // Input sample digit 8, 16
      outputSampleRate: config.sampleRate,        // Output sampling rate
      oututSampleBits: config.sampleBits,         // Output sample digit 8, 16
      input: function (data) {
        this.buffer.push(new Float32Array(data));
        this.size += data.length;
      },
      compress: function () { // Merge compression
        // merge
        const data = new Float32Array(this.size);
        let offset = 0;
        for (let i = 0; i < this.buffer.length; i++) {
          data.set(this.buffer[i], offset);
          offset += this.buffer[i].length;
        }
        // compression
        const compression = parseInt(this.inputSampleRate / this.outputSampleRate);
        const length = data.length / compression;
        const result = new Float32Array(length);
        let index = 0, j = 0;
        while (index < length) {
          result[index] = data[j];
          j += compression;
          index++;
        }
        return result;
      },
      encodeWAV: function () {
        const sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
        const sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
        const bytes = this.compress();
        const dataLength = bytes.length * (sampleBits / 8);
        const buffer = new ArrayBuffer(44 + dataLength);
        const data = new DataView(buffer);

        const channelCount = 1;   // Mono
        let offset = 0;

        const writeString = function (str) {
          for (let i = 0; i < str.length; i++) {
            data.setUint8(offset + i, str.charCodeAt(i));
          }
        };

        // Resource exchange file identifier
        writeString('RIFF');
        offset += 4;
        // The total number of bytes from the beginning of the next address to the end of the file,File size-8
        data.setUint32(offset, 36 + dataLength, true);
        offset += 4;
        // WAV file logo
        writeString('WAVE');
        offset += 4;
        // Waveform format flag
        writeString('fmt ');
        offset += 4;
        // Filter byte,Generally 0x10 = 16
        data.setUint32(offset, 16, true);
        offset += 4;
        // Format category (PCM form sampled data)
        data.setUint16(offset, 1, true);
        offset += 2;
        // Number of channels
        data.setUint16(offset, channelCount, true);
        offset += 2;
// sample rate, number of samples per second, indicating the playback speed of each channel        data.setUint32(offset, sampleRate, true);
        offset += 4;
// Waveform data transfer rate (average number of bytes per second) Mono × Data bits per second × Data bits per sample / 8        data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
        offset += 4;
// Fast data adjustment number Number of bytes occupied at the time of sampling Mono × Number of data bits per sample / 8        data.setUint16(offset, channelCount * (sampleBits / 8), true);
        offset += 2;
        // Number of data per sample
        data.setUint16(offset, sampleBits, true);
        offset += 2;
        // Data identifier
        writeString('data');
        offset += 4;
        // Total sampled data,The total size of the data-44
        data.setUint32(offset, dataLength, true);
        offset += 4;
        // Write sampled data
        if (sampleBits === 8) {
          for (let i = 0; i < bytes.length; i++ , offset++) {
            const s = Math.max(-1, Math.min(1, bytes[i]));
            let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
            val = parseInt(255 / (65535 / (val + 32768)));
            data.setInt8(offset, val, true);
          }
        } else {
          for (let i = 0; i < bytes.length; i++ , offset += 2) {
            const s = Math.max(-1, Math.min(1, bytes[i]));
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          }
        }

        return new Blob([data], { type: 'audio/wav' });
      }
    };

    // start recording
    this.start = function () {
      audioInput.connect(recorder);
      recorder.connect(context.destination);
    };

    // stop
    this.stop = function () {
      recorder.disconnect();
      context.close();
    };

    // Get audio files
    this.getBlob = function () {
      return audioData.encodeWAV();
    };

    // Playback
    this.play = function (audio) {
      audio.src = window.URL.createObjectURL(this.getBlob());
    };

    // Upload
    this.upload = function (url, callback, audio, uploadName) {
      const fd = new FormData();
      audio = audio || this.getBlob();
      uploadName = uploadName || 'audioData';
      fd.append(uploadName, audio);
      const xhr = new XMLHttpRequest();
      if (callback) {
        xhr.upload.addEventListener('progress', function (e) {
          callback('uploading', e);
        }, false);
        xhr.addEventListener('load', function (e) {
          callback('ok', e);
        }, false);
        xhr.addEventListener('error', function (e) {
          callback('error', e);
        }, false);
        xhr.addEventListener('abort', function (e) {
          callback('cancel', e);
        }, false);
      }
      xhr.open('POST', url);
      xhr.send(fd);
    };

    // Audio collection
    recorder.onaudioprocess = function (e) {
      audioData.input(e.inputBuffer.getChannelData(0));
    }
  };

  // Throw an exception
  Recorder.throwError = function (message) {
    alert(message);
    throw new function () {
      this.toString = function () {
        return message;
      }
    }
  };

  // Whether to support recording
  Recorder.canRecording = navigator.getUserMedia != null;

  // Get the recorder
  Recorder.get = function (callback, config) {
    if (callback) {
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { audio: true }, // Enable audio only
          function (stream) {
            const rec = new Recorder(stream, config);
            callback(rec);
          },
          function (error) {
            switch (error.code || error.name) {
              case 'PERMISSION_DENIED':
              case 'PermissionDeniedError':
                Recorder.throwError('The user refused to use the recording.');
                break;
              case 'NOT_SUPPORTED_ERROR':
              case 'NotSupportedError':
                Recorder.throwError('The browser does not support hardware devices.');
                break;
              case 'MANDATORY_UNSATISFIED_ERROR':
              case 'MandatoryUnsatisfiedError':
                Recorder.throwError('The specified hardware device could not be discovered.');
                break;
              default:
                Recorder.throwError('Unable to open the microphone. Exception information:' + (error.code || error.name));
                break;
            }
          });
      } else {
        // Recorder.throwError('当前浏览器不支持录音功能。');
        alert('当前浏览器不支持录音功能。');
        return Recorder;
      }
    }
  };

  window.Recorder = Recorder;

})(window);
