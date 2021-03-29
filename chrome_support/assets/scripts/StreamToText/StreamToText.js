const DOWNSAMPLING_WORKER =
  "/assets/scripts/StreamToText/downsampling_worker.js";
const SERVER_URL = "http://localhost:4000";

class StreamToText {
  constructor(mediaStream, onMessageCallback) {
    this.connected = false;
    this.recording = false;
    this.recordingStart = 0;
    this.recordingTime = 0;
    this.mediaStream = mediaStream;
    this.onMessageCallback = onMessageCallback;

    this.socket = io.connect(SERVER_URL, {});

    this.socket.on("connect", () => {
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
      this.stopRecording();
    });

    this.socket.on("recognize", (results) => {
      this.onMessageCallback(results);
    });

    this.startRecording();
  }

  createAudioProcessor(audioContext, audioSource) {
    let processor = audioContext.createScriptProcessor(1024, 1, 1);

    const sampleRate = audioSource.context.sampleRate;

    let downsampler = new Worker(DOWNSAMPLING_WORKER);
    this.downsampler = downsampler;

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
      this.downsampler.terminate();
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

  stopRecording() {
    if (this.recording) {
      this.recording = false;

      if (this.socket.connected) this.socket.emit("stream-reset");

      clearInterval(this.recordingInterval);

      if (this.mediaStream) this.mediaStream.getTracks()[0].stop();

      if (this.mediaStreamSource) this.mediaStreamSource.disconnect();

      if (this.processor) this.processor.shutdown();

      if (this.audioContext) this.audioContext.close();
    }
  }
}
