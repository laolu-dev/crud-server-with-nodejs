import http from "node:http";
import fs from "node:fs";

type User = {
    name: string;
    age: number;
}

const server = http.createServer((request, response) => {
    let users: User[] = []


    // Landing Page
    if (request.url == "/") {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("Welcome to the homepage!");
    }

    // Creating a user
    if (request.url == "/users/create" && request.method == "POST") {
        let body: string = '';

        request.on("data", (data) => {
            body += data.toString();
        });

        request.on("end", () => {
            const newUser: User = JSON.parse(body);

            fs.readFile("user.json", "utf8", (err, data) => {
                users = JSON.parse(data);
                users.push(newUser);
                fs.writeFile("user.json", JSON.stringify(users), (err) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(500, { "Content-Type": "application/json" });
                        response.end("Unable to create user");
                    } else {
                        response.writeHead(201, { "Content-Type": "application/json" });
                        response.end(JSON.stringify(users));
                    }
                });
            });
        });
    }

    // Fetching all users
    if (request.url == "/users" && request.method == "GET") {
        fs.readFile("user.json", "utf8", (err, data) => {
            users = JSON.parse(data);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(users));
        });
    }

    // Updating a user (The first user in the list)
    if (request.url == "/users/update" && request.method == "PATCH") {
        let body: string = '';

        request.on("data", (data) => {
            body += data.toString();
        });

        request.on("end", () => {
            fs.readFile("user.json", "utf8", (err, data) => {
                users = JSON.parse(data);
                users[0].age = JSON.parse(body).age;

                fs.writeFile("user.json", JSON.stringify(users), (err) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(500, { "Content-Type": "application/json" });
                        response.end("Unable to update first user");
                    } else {
                        response.writeHead(200, { "Content-Type": "application/json" });
                        response.end(JSON.stringify(users[0]));
                    }
                });
            });
        });

    }

    // Deleting all users
    if (request.url == "/users/delete" && request.method == "DELETE") {
        users = [];
        fs.readFile("user.json", "utf8", (err, data) => {
            fs.writeFile("user.json", JSON.stringify(users), (err) => {
                if (err) {
                    console.log(err);
                    response.writeHead(500, { "Content-Type": "application/json" });
                    response.end("Unable to delete user");
                } else {
                    response.writeHead(200, { "Content-Type": "application/json" });
                    response.end(JSON.stringify(users));
                }
            });
        });
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
