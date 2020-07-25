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
      controller.enqueue(e.data);
    });
    
    btn.addEventListener("click", async () => {
      controller.close();
      
      const res = await fetch(`/receive?key=${key}`);
      console.log(res.body.toString());
    })
  },
}).pipeThrough(new TextEncoderStream());
fetch(`/send?key=${key}`, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: stream,
});