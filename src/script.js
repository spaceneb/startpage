/*
Contains Code Snippets from the following:
https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
*/
var i, o, url, currentUUID;
const rssFeeds = {
  items: [
    "https://www.apple.com/newsroom/rss-feed.rss",
    "https://lukesmith.xyz/rss.xml",
    "https://hnrss.org/newest",
  ],
}; // should probably use cookies for this shit but nah
// oh yeah, VPS owners should change 127.0.0.1 to be the domain of their VPS
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let language;
if (window.navigator.languages) {
  language = window.navigator.languages[0];
} else {
  language = window.navigator.userLanguage || window.navigator.language;
}
document.body.style =
  "background: url(https://source.unsplash.com/random/3840x2160) no-repeat center center, var(--background); background-attachment: fixed; background-size: cover; box-shadow:inset 0 0 0 10000% rgba(0, 0, 0, 0.3); height: 100%;";
const searchProvider = "https://duckduckgo.com/?q="; // my definitions are all over the place, im so used to swtiching back and forth from node omfg this is a nightmare
const omniBar = document.getElementById("omniBar");
let currentElement = document.body;
function doAbstractSearch() {
  fetch("http://127.0.0.1:8080/ac?q=" + encodeURIComponent(omniBar.value), {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    }) // promises feel bloated idk why
    .then(function (json) {
      if (!document.getElementsByClassName("autosuggestion").length === 0) {
        document.getElementById("autosuggestions").innerHTML = "";
      }
      for (i = 0; i < json.length; i++) {
        const tabindex = i + 2; // ah fuck dont look down                                                                                                      //this is a real nightmare
        document.getElementById("autosuggestions").innerHTML +=
          '<div class="autosuggestion" onclick="sendToSearch(`' +
          json[i][0]
            .replace("<b>", "")
            .replace("</b>", "")
            .split(" ")
            .join(" ") +
          '`)" tabindex="' +
          tabindex +
          '">' +
          json[i][0]
            .replace("<b>", "")
            .replace("</b>", "")
            .split(" ")
            .join(" ") +
          "</div>"; // yeah I know BUT I TOLD YOU NOT TO LOOK AT THIS SHIT
      }
    });
}
function sendToSearch(text) {
  omniBar.value = text;
  doAbstractSearch();
}
function redirect() {
  if (!omniBar.value.startsWith("http")) {
    // god knows why the fuck I did this shit
    window.location.href =
      searchProvider + encodeURIComponent(omniBar.value).replace(" ", "%20");
  } else {
    url = new URL(omniBar.value);
    url.protocol = "https:"; // auto HTTPS upgrade for yah lazy muufukkas!!!!!!!111!!!
    window.location.href = url;
  }
}
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    if (
      currentElement.className === "autosuggestion" &&
      omniBar.value !== currentElement.innerText
    ) {
      omniBar.value = currentElement.innerText;
    } else {
      if (document.activeElement.id === "omniBar") {
        redirect();
      }
    }
  }
  if (event.key === "Escape") {
    event.preventDefault();
    document.getElementById("autosuggestions").style = "display: none;";
  }
  if (omniBar.value.startsWith("http")) {
    omniBar.className = "text isUrl";
    document.getElementById("autosuggestions").innerHTML = "";
  } else {
    omniBar.className = "text";
    if (event.key !== "Tab" || event.key !== "Escape") {
      doAbstractSearch();
    }
  }
});
function getClock() {
  document.getElementById("clockbox").innerText = new Date().toLocaleString(
    language,
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: timezone,
    }
  );
}
setInterval(getClock, 1000);
function focusOut(event) {
  if (currentElement.className === "") {
    document.getElementById("autosuggestions").style = "display: none;";
  }
} // fuck looking into this wish I did event handlers, it makes no difference but now the code feels bloated
function focusIn(event) {
  document.getElementById("autosuggestions").style = "display: flex;";
}
window.onmouseover = function (event) {
  currentElement = event.target;
};
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
} // credit: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
for (i = 0; i < rssFeeds.items.length; i++) {
  fetch(
    "http://127.0.0.1:8080/feed?q=" + encodeURIComponent(rssFeeds.items[i]),
    {
      method: "GET",
    }
  )
    .then(function (response) {
      return response.json();
    }) // promises feel bloated idk why
    .then(function (json) {
      for (o = 0; o < json.items.length && o < 5; o++) {
        currentUUID = uuidv4();
        document.getElementById(
          "articles"
        ).innerHTML += `<div id="${currentUUID}" class="article-container" data-aos="zoom-in"></div>`; // begin the awful code
        if (typeof json.items[o].url[1].href === "string") {
          document.getElementById(
            currentUUID
          ).innerHTML += `<img src="${json.items[o].url[1].href}" alt="${json.items[o].url[1].title}" class="article-img">`;
        }
        if (typeof json.items[o].url === "string") {
          json.items[o].url = [{ href: json.items[o].url }];
        }
        document.getElementById(
          currentUUID
        ).innerHTML += `<a href="${json.items[o].url[0].href}" target="_blank"><p class="article-title">${json.items[o].title}</p></a>`;
        if (typeof json.items[o].author === "string") {
          if (json.items[o].author !== json.title) {
            document.getElementById(
              currentUUID
            ).innerHTML += `<p class="article-author">${
              json.items[o].author + " &#183; " + json.title
            }</p>`;
          } else {
            document.getElementById(
              currentUUID
            ).innerHTML += `<p class="article-author">${json.items[o].author}</p>`;
          }
        } else {
          document.getElementById(
            currentUUID
          ).innerHTML += `<p class="article-author">${json.title}</p>`;
        }
        document.getElementById(
          currentUUID
        ).innerHTML += `<p class="article-date">${new Date(
          json.items[o].published
        ).toLocaleString(language, {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: timezone,
        })}</p>`;
      }
    }); // fuc dis shit is so messy
}
