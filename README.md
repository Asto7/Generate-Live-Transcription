# Generate-Live-Transcription

## Setup

- #### Clone project
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; `git clone https://github.com/Asto7/Generate-Live-Transcription.git`


- #### Install dependencies
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; `npm install`


- #### Download the following files and paste it in the root directory:  <br />
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [deepspeech-0.9.3-models.pbmm](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm)  <br />
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [deepspeech-0.9.3-models.scorer](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.scorer)  <br />


- #### Start development server
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ` npm run start-dev `


- #### To use Live Transcription Generator in Chrome, you need to add this extension.
1. In the address bar on a new tab, type <b>chrome://extensions</b> to open the Extensions page. Select the <b>Developer mode</b> check box to enable loading extensions from a folder.

2. Click <b>Load unpacked extension</b> or drag the <b>chrome_support</b> folder with extension onto the page to load the extension. The new extension will be displayed on the page.
 
## Screen Recording

<a target = _blank href="https://youtu.be/pqKPrE-BTAs?t=9s"> 
 <img src="https://user-images.githubusercontent.com/49583145/113033295-7d73a500-91ae-11eb-873a-25ccd43a568d.png" width="900"/>
</a>

## TODO

- [x] Make it responsive
- [x] Make it more real-time
- [x] Add Worker.js to do the heavy lifting task in the browser
- [ ] Add support for other languages
- [ ] Add support for other browsers
- [ ] Improvement in processing audio for large scale use
- [ ] Add option to let user select colour combination for **Caption Div Element**
- [ ] Add a feature to download the **Complete Caption** (Useful in making notes during classes :wink:)


## References!
1. https://github.com/mozilla/DeepSpeech
2. https://developer.chrome.com/docs/extensions/reference/
3. https://github.com/mozilla/DeepSpeech-examples
