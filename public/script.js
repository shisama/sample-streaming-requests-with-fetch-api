const input = document.querySelector("#txt");
const output = document.querySelector("#output");
const key = location.hash;

const stream = new ReadableStream({
  start(controller) {
    input.addEventListener('input', (event) => {
      event.preventDefault();
      controller.enqueue(input.value);
      input.value = '';
    });
  }
}).pipeThrough(new TextEncoderStream());

fetch(`/send?key=${key}`, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: stream,
  allowHTTP1ForStreamingUpload: true,
});

fetch(`/receive?key=${key}`).then(async res => {
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    output.append(value);
  }
});