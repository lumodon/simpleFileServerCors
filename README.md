# Simple CORS File Server

This is a simple file server for use with Speed Test tool locally. Python's SimpleHTTPServer doesn't offer ability to customize CORS settings and handle uploads for testing out nginx's file size limits. This does.

# Installation

* Ensure Node 8 or higher is installed on your system.

```sh
git clone https://github.com/lumodon/simpleFileServerCors.git
cd simpleFileServerCors
npm install
npm start
```

* Navigate to http://localhost:7776
* Alternatively, make a post request to http://localhost:7776/upload from http://localhost:5000

Not intended for production use, only for local development, customize `app.js` with alternative allowed origins.

# Roadmap

NONE! This is a small simple project for personal dev use. You could add settings or dotenv I suppose to read origins from a file... This is just a file uploader for testing Speed Test tools.