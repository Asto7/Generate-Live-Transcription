const io = require("socket.io-client");
const DOWNSAMPLING_WORKER = "./assets/scripts/downsampling_worker.js";
const SERVER_URL = "http://localhost:4000";

class StreamToText {
  constructor(mediaStream, onMessageCallback) {
    this.connected = false;
    this.recording = false;
    this.recordingStart = 0;
    this.recordingTime = 0;
    this.recognitionOutput = [];
    this.mediaStream = mediaStream;
    this.onMessageCallback = onMessageCallback;
    let recognitionCount = 0;

    this.socket = io.connect(SERVER_URL, {});

    this.socket.on("connect", () => {
      console.log("socket connected");
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("socket disconnected");
      this.connected = false;
      this.stopRecording();
    });

    this.socket.on("recognize", (results) => {
      console.log("recognized:", results);
      const recognitionOutput = this.recognitionOutput;
      results.id = recognitionCount++;
      recognitionOutput.unshift(results);
      this.recognitionOutput = recognitionOutput;
      this.renderRecognitionOutput();
      this.onMessageCallback(this.recognitionOutput);
    });

    this.startRecording();
  }

  createAudioProcessor(audioContext, audioSource) {
    let processor = audioContext.createScriptProcessor(4096, 1, 1);

    const sampleRate = audioSource.context.sampleRate;

    let downsampler = new Worker(DOWNSAMPLING_WORKER);
    downsampler.postMessage({ command: "init", inputSampleRate: sampleRate });
    downsampler.onmessage = (e) => {
      if (this.socket.connected) {
        this.socket.emit("stream-data", e.data.buffer);
      }
    };

    processor.onaudioprocess = (event) => {
      var data = event.inputBuffer.getChannelData(0);
      downsampler.postMessage({ command: "process", inputFrame: data });
    };

    processor.shutdown = () => {
      processor.disconnect();
      this.onaudioprocess = null;
    };

    processor.connect(audioContext.destination);

    return processor;
  }

  startRecording(e) {
    if (!this.recording) {
      this.recordingInterval = setInterval(() => {
        let recordingTime = new Date().getTime() - this.recordingStart;
        this.recordingTime = recordingTime;
      }, 100);

      this.recording = true;
      this.recordingStart = new Date().getTime();
      this.recordingTime = 0;

      let stream = this.mediaStream;
      this.audioContext = new AudioContext();

      this.mediaStreamSource = this.audioContext.createMediaStreamSource(
        stream
      );
      this.processor = this.createAudioProcessor(
        this.audioContext,
        this.mediaStreamSource
      );

      this.mediaStreamSource.connect(this.processor);
    }
  }

  stopRecording(e) {
    if (this.recording) {
      if (this.socket.connected) {
        this.socket.emit("stream-reset");
      }
      clearInterval(this.recordingInterval);
      this.recording = false;
      this.stopMicrophone();
    }
  }

  stopMicrophone() {
    if (this.mediaStream) {
      this.mediaStream.getTracks()[0].stop();
    }
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
    }
    if (this.processor) {
      this.processor.shutdown();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default StreamToText;
