const express = require("express");
const path = require("path");
const Feed = require("rss-to-json"); // fuck this feels so mufkin bloated
const { exec } = require("child_process");
const app = express();
const port = 8080;
// VPS Users: change the Access-Control-Allow-Origin header to the domain of your server
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "src/index.html"));
});
app.get("/style.css", function (req, res) {
  res.sendFile(path.join(__dirname, "src/style.css")); // bruh what the actual fuck is this code
}); // ive seen shitty code but come on
app.get("/script.js", function (req, res) {
  res.sendFile(path.join(__dirname, "src/script.js"));
});
app.get("/logo.svg", function (req, res) {
  res.sendFile(path.join(__dirname, "src/logo.svg"));
});
app.get("/globe.svg", function (req, res) {
  res.sendFile(path.join(__dirname, "src/globe.svg"));
});
app.get("/search.svg", function (req, res) {
  res.sendFile(path.join(__dirname, "src/search.svg"));
});
app.get("/ac", function (req, res) {
  // bascially no-cors but less bloated, that muhfucka is so bloated, you only need like 20 lines max to do this shit xdxdxd
  exec(
    "curl 'https://www.google.com/complete/search?q={{QUERY}}&cp=3&client=gws-wiz&xssi=t&gs_ri=gws-wiz&hl=en&authuser=0&psi=Y22hYJftKqPn5NoPxc2UuAc.1621192036071&dpr=2' \
    -H 'authority: www.google.com' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36' \
    -H 'accept: */*' \
    -H 'sec-fetch-site: same-origin' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-dest: empty' \
    -H 'referer: https://www.google.com/' \
    -H 'accept-language: en-US,en;q=0.9' \
    --compressed".replace(
      "{{QUERY}}",
      encodeURIComponent(req.query.q)
    ),
    (error, stdout, stderr) => {
      try {
        res.set("Access-Control-Allow-Origin", "*");
        res.json(JSON.parse(stdout.replace(")]}'", ""))[0]);
      } catch (e) {
        console.error(e);
        res.json([["Sorry, Nothing Here"]]);
      }
    }
  );
});
app.get("/feed", function (req, res) {
  try {
    if (typeof req.query.q === "string") {
      Feed.load(req.query.q, function (err, rss) {
        res.set("Access-Control-Allow-Origin", "*"); // mfw IE didn't support this shit until  version 10, 2 years after Chrome 4 xdxdxd
        res.json(rss); // I fuckin hate promises, but, I need them // where was that comment going?
      });
    }
  } catch (e) {
    console.error(e);
    res.json({ items: [] });
  }
});
app.listen(port);
console.log("Server started at http://127.0.0.1:" + port);
