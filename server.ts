import http from "node:http";

const server = http.createServer((request, response) => {
    console.log(request.url);
    response.end("Hello World!");
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
