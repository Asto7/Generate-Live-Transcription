# Generate-Live-Transcription

## Example Demo

<a target = "_blank" href="https://youtu.be/pqKPrE-BTAs?t=4s"> 
 <img src="https://user-images.githubusercontent.com/49583145/113033295-7d73a500-91ae-11eb-873a-25ccd43a568d.png" width="1000"/>
</a>

## Setup

- #### Clone project

 ```bash
     git clone https://github.com/Asto7/Generate-Live-Transcription.git
 ```

- #### Install dependencies

 ```bash
     npm install
 ```

- #### Download the following pre-trained English model files and paste them into the root directory <br />
     [deepspeech-0.9.3-models.pbmm](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm)</br>
     [deepspeech-0.9.3-models.scorer](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.scorer) 

- #### Start development server

 ```bash
     npm run start-dev
 ```

- #### To use Live Transcription Generator in Browser, you need to add this extension. 
     Follow the tutorial [here](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)

## TODO

- [x] Make it responsive
- [x] Make it more real-time
- [x] Add Worker.js to do the heavy lifting task in the browser
- [ ] Add support for other languages
- [ ] Add support for different browsers
- [ ] Improvement in processing audio for large scale use
- [ ] Add option to let user select colour combination for **Caption Div Element**
- [ ] Add a feature to download the **Complete Caption** (Useful in making notes during classes :wink:)

## Support

Currently the extension is only supported for

- Google Chrome
- Edge

## References!

1. https://github.com/mozilla/DeepSpeech
2. https://developer.chrome.com/docs/extensions/reference/
3. https://github.com/mozilla/DeepSpeech-examples
