navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

// check if streaming requests with fetch API is available
const supportsRequestStreams = !new Request('', {
  body: new ReadableStream(),
  method: 'POST',
}).headers.has('Content-Type');


const channel = Math.random();

if (!navigator.getUserMedia) {
  console.error('This browser doesn\'t support navigator.getUserMedia()')
}
navigator.getUserMedia({ audio: true, video: { width: 800, height: 600 } },
  (stream) => {
    fetch(`/send?channel=${channel}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: stream,
      allowHTTP1ForStreamingUpload: true,
    });
    const video = document.querySelector('video');
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  },
  (error) => {
    console.error(error);
  }
);