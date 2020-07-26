function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const txt = document.querySelector("#txt");
const btn = document.querySelector("#btn");
const output = document.querySelector("#output");
const key = Math.random();

const stream = new ReadableStream({
  async start(controller) {
    txt.addEventListener("input", async (e) => {
      const txt = e.data || "";
      controller.enqueue(txt);
    });
    
    btn.addEventListener("click", async () => {
      const res = await fetch(`/receive?key=${key}`);
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      while(true) {
        const {done, value} = await reader.read();
        if (done) {
          return;
        }
        output.textContent = value;
      }
    })
  },
}).pipeThrough(new TextEncoderStream());
fetch(`/send?key=${key}`, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: stream,
  allowHTTP1ForStreamingUpload: true,
});