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

    fetch(`/receive?channel=${channel}`).then(async res => {
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        var video = document.querySelector('video');
        video.srcObject = value;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      }
    });
  },
  (error) => {
    console.error(error);
  }
);