const { setupServer } = require("msw/node");
const { http, HttpResponse } = require("msw");

const encoder = new TextEncoder();

const server = setupServer(
  http.get("https://api.example.com/stream", () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("hello"));
        controller.enqueue(encoder.encode("world"));
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  })
);

server.listen();

fetch("https://api.example.com/stream")
  .then((response) => response.text())
  .then((text) => console.log("text", text))
  .then(() => {
    server.resetHandlers();
    server.close();
  });
