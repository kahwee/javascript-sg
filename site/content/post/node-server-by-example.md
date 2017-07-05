---
date: 2017-07-03T00:00:00Z
published: true
title: Node server by example
tags:
- example
- tutorial
- beginner
- server
---

## Introduction

We are going to create a simple web server to serve some dyanmic content. In here you will also learn some error handling basics that can be helpful in your journey in using node.js.

You are encouraged to use node.js 8.1.3 or above.

## Level 01: The minimal server

We want to start of with a server that that contains the most basic set of code:

```js
const http = require('http')
const server = http.createServer((req, res) => {
  res.write('Hello world')
  res.end()
})
server.listen(3001)
```

Copy the code and save it in your directory as `index.js`.

Start the server using:

```sh
node index.js
```

Now open your browser and go to http://localhost:3001 to see your page.

Notice how we pass an argument into the `http.createServer` function. That is the `requestListener` which is a function that will be called when a request is made to the server:

```js
(req, res) => {
  res.write('Hello world')
  res.end()
}
```

Both `req` and `res` are commonly used variable names and using them helps others understand your code better.

### What is req?

`req` stands of "request" and it contains the [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object.

The object will contain an abstraction of what the client, your browser, sends.

When you view http://localhost:3001 on your browser, it reaches the web server and sends these request headers.

```
GET / HTTP/1.1
Host: localhost:3001
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
DNT: 1
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.8,en-GB;q=0.6
```

### What is res?

`res` stands of "response" and it contains the [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) object.

The response the browser receives is:

```
HTTP/1.1 200 OK
Date: Wed, 05 Jul 2017 04:16:35 GMT
Connection: keep-alive
Transfer-Encoding: chunked

Hello world
```

The browser will receive HTTP status 200 which means the request made is successful. The contents "Hello world" is also returned and displayed in the browser window.

### Listening to the port

HTTP and HTTPS websites are hosted on port 80 and 443 respectively as a default. However in our example, we chose to use port 3001. This allows us to have different servers to coexist in one server instance so long as they are listening to different ports. For example, if I have an process (or app) listening to port 80, I cannot have another process that is listening to the same port.

A typical setup for a node.js server is to run it on a port other than port 80 and have it fronted with `nginx`. We shall see how to do this as we continue this tutorial.

## Level 02: A little more dynamism

Next we are going to attempt to serve an HTML file. Here's what we can start with. We replace "Hello world" we had previously with some HTML.

```js
const http = require('http')
const server = http.createServer((req, res) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Level 02</title>
</head>
<body>
  <h1>Level 02</h1>
  <p>Hello World</p>
</body>
</html>`
  res.write(html)
  res.end()
})
server.listen(3001)
```

Unfortunately this gets unwieldly when you get larger HTML files. Let's place this in a file and call it `index.html`.

### index.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Level 02</title>
</head>
<body>
  <h1>Level 02</h1>
  <p>Hello World</p>
</body>
</html>
```

### Opening a file with node.js

A few things are going on here, we are using the `fs` and `path` module to assist us with file operations.

The new `index.js`:

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), (err, body) => {
    res.write(body)
    res.end()
  })
})
server.listen(3001)
```

Save it, run `node index.js` and view http://localhost:3001 in your browser again.

In this case we need to open a file with a given path. Let's break it down.

### Constructing the path

```js
path.join(__dirname, 'index.html')
```

We are using `path.join` to put together two segements of the path today. `__dirname` is a special variable that holds the full path of your directory. In my case `__dirname` returns `/Users/kahwee/node-server-by-example/level-02`.

Joining adds the directory separator and resolves the remaining path. If it were to be a relative path, `path.join` takes care of it too.

### Introducing fs.readFile

`fs.readFile` is going to be a function we are going to need pretty often. This asynchronous function will receive a callback when the file contents are read.

This is the callback:

```js
(err, body) => {
  res.write(body)
  res.end()
}
```

In above function signature shows a common node.js pattern where the first parameter is `err` and it returns the error if any. Errors will occur if the file didn't exist. It's recommended that you do error checking such as this:

```js
(err, body) => {
  if (err) {
    console.log(err)
  } else {
    res.write(body)
  }
  res.end()
}
```

If there's no error, the response is written. As usual, we use `res.end()` to finish a connection.

### The final code

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), (err, body) => {
    if (err) {
      console.log(err)
    } else {
      res.write(body)
    }
    res.end()
  })
})
server.listen(3001)
```

## Level 03: What about URL paths

These are tiny steps to writing a web server. It is only practical to have web servers support multiple URL paths.

For example, http://localhost:3001/path1.html should display contents that are different from http://localhost/.

We are going to start with 2 HTMLs and make the web server load different pages for each of the URLs.

### Our index.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Level 03</title>
</head>
<body>
  <h1>Level 03</h1>
  <p>index.html</p>
</body>
</html>
```

### Our path1.html

The `<p>` now writes `path1.html`.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Level 03</title>
</head>
<body>
  <h1>Level 03</h1>
  <p>path1.html</p>
</body>
</html>
```

### What we want

1. http://localhost:3001/path1.html open `./path1.html`
2. http://localhost:3001/path1.html?foo=bar opens `./path1.html`
3. http://localhost:3001/ opens `./index.html`
4. http://localhost:3001/index.html opens `./index.html`
5. http://localhost:3001/invalid.html returns a HTTP status 404 error to signify "Not found"

Let's tackle 1 to 4 first.

### Opening the right file

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url)
  let filename = ''
  if (reqUrl.pathname === '/path1.html') {
    filename = 'path1.html'
  } else if (reqUrl.pathname === '/' || reqUrl.pathname === '/index.html') {
    filename = 'index.html'
  }
  fs.readFile(path.join(__dirname, filename), (err, body) => {
    if (err) {
      console.log(err)
    } else {
      res.write(body)
    }
    res.end()
  })
})
server.listen(3001)
```

The above code introduces the `url` module. `url.parse` parses the request URL and returns the `pathname`.

Here's a diagram to help you understand what is `pathname`:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            href                                             │
├──────────┬──┬─────────────────────┬─────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │        host         │           path            │ hash  │
│          │  │                     ├──────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │   hostname   │ port │ pathname │     search     │       │
│          │  │                     │              │      │          ├─┬──────────────┤       │
│          │  │                     │              │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │   hostname   │ port │          │                │       │
│          │  │          │          ├──────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │        host         │          │                │       │
├──────────┴──┼──────────┴──────────┼─────────────────────┤          │                │       │
│   origin    │                     │       origin        │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴─────────────────────┴──────────┴────────────────┴───────┤
│                                            href                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
(all spaces in the "" line should be ignored -- they are purely for formatting)
```

We want a condition to extract the `pathname` and ignore the `search` portion of the URL. This lets us match these:

* http://localhost:3001/path1.html
* http://localhost:3001/path1.html?foo=bar
* http://localhost:3001/path1.html?foo=bar#top

...all to `/path1.html`.

These set of conditionals are determining which file to load:

```js
if (reqUrl.pathname === '/path1.html') {
  filename = 'path1.html'
} else if (reqUrl.pathname === '/' || reqUrl.pathname === '/index.html') {
  filename = 'index.html'
}
```

### Error handling

What happens with the user loads:

```
http://localhost:3001/invalid.html
```

We do not have an HTML page that correspond to this URL, so we have to respond with an indication.

Modifying `index.js`

```js
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url)
  let filename = ''
  if (reqUrl.pathname === '/path1.html') {
    filename = 'path1.html'
  } else if (reqUrl.pathname === '/' || reqUrl.pathname === '/index.html') {
    filename = 'index.html'
  }
  if (filename) {
    fs.readFile(path.join(__dirname, filename), (err, body) => {
      if (err) {
        console.log(err)
      } else {
        res.write(body)
      }
      res.end()
    })
  } else {
    res.writeHead(404)
    res.end()
  }
})
server.listen(3001)
```

We added `res.writeHead(404)` which returns 404 to the browser.

What the browser sees:

```
HTTP/1.1 404 Not Found
Date: Wed, 05 Jul 2017 06:06:28 GMT
Connection: keep-alive
Transfer-Encoding: chunked
```

As we did not send any body content, the browser will display a blank page to the user.

## Level 04: Supporting complex requests from the browser

Let's recap what we've went through:

* **Level 01**: we did a simple server using the `http` module
* **Level 02**: we loaded a HTML file to the user
* **Level 03**: we loaded a different HTML file when the user request from different URL paths

It looks like our code is getting longer and this seems like a set of really trivial operations. While it's useful to understand the underlying `http` functions in node.js, there's a tradeoff of code readability and maintenance.

Most node.js developers therefore use a package called `express` and related plugins to reduce some of these code. The recommended method of installing these is via the `npm` package manager. `npm` comes preinstalled when you install node.js.

## Level 05: Converting to express

We are going to give some structure to our work. Firstly, `index.html` and `path1.html` should be in its own directory called `./public`. We will also put our server code into `./server`. This is largely my opinion, however I recommend you follow through first.

The directory structure:

```
.
├── public
│   ├── index.html
│   └── path1.html
└── server
    └── index.js
```

### Creating package.json

Start by initializing npm's package.json:

```sh
npm init -y
```

You will see that the `package.json` to added in your current working directory. Its contents:

```json
{
  "name": "level-05",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Let's install express:

```sh
npm i --save express
```

After the installation, look at the changes in the directory, you will notice a new directory called `node_modules`.

Here's the new structure (truncated):

```
.
├── node_modules
│   ├── accepts
│   ├── array-flatten
│   ├── content-disposition
│   ├── content-type
│   ├── ...
│   ├── express
│   ├── ...
│   └── vary
├── package.json
├── public
│   ├── index.html
│   └── path1.html
└── server
    └── index.js
```

Also take a look at the `package.json`:

```json
{
  "name": "level-04",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.15.3"
  }
}
```

Notice that `npm` has installed `express` and its dependencies in `./node_modules`. That's great, however if you are committed your code, you should leave out the `./node_modules` directory since your collaborators can run `npm install` to get the modules they need easily.

### Convert our code to express

Your new `./server/index.js` file:

```js
const express = require('express')
const app = express()
app.use(express.static('public'))
app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})
```

The `./public/index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Level 05</title>
</head>
<body>
  <h1>Level 05</h1>
  <p>index.html</p>
</body>
</html>
```

The `./public/path1.html` file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Level 05</title>
</head>
<body>
  <h1>Level 05</h1>
  <p>path1.html</p>
</body>
</html>
```

Now run your code with:

```sh
node server/index.js
```

Try going to the following URLs:

1. http://localhost:3001/path1.html
2. http://localhost:3001/path1.html?foo=bar
3. http://localhost:3001/
4. http://localhost:3001/index.html
5. http://localhost:3001/invalid.html

Notice that going to an invalid URL results in `express` server responding:

```
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 151
Date: Wed, 05 Jul 2017 06:42:29 GMT
Connection: keep-alive
```

There is also a default body message that reads `Cannot GET /invalid.html` to inform the user the static file is not found.

Moving on this should be how to develop your web servers -- using `express`.
