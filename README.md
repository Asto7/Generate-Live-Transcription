# Generate-Live-Transcription

## Setup
- ##### Clone project
- 1. `git clone https://github.com/Asto7/Generate-Live-Transcription.git`
 
- ##### Install dependencies
```bash
npm install
```

- ##### Download the following files and paste it in the root directory:  <br />
- [deepspeech-0.9.3-models.pbmm](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm)  <br />
- [deepspeech-0.9.3-models.scorer](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.scorer)  <br />

- ##### Start development server
 ```bash
 npm run start-dev
 ```
- ##### To use Live Transcription Generator in Chrome, you need to add this extension.

- 1. In the address bar on a new tab, type **chrome://extensions** to open the Extensions page. Select the **Developer mode** check box to enable loading extensions from a folder.

- 2. Click **Load unpacked extension** or drag the **chrome_support** folder with extension onto the page to load the extension. The new extension will be displayed on the page.


## TODO

- [x] Make it responsive
- [x] Make it more real-time
- [x] Add Worker.js to do the heavy lifting task in the browser
- [ ] Add support for other languages
- [ ] Add support for other browsers
- [ ] Improvement in processing audio for large scale use
- [ ] Add option to let user select colour combination for **Caption Div Element**
