/*
Contains Code Snippets from the following:
https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
*/
var rssFeeds = {
    "items": [
        'https://www.apple.com/newsroom/rss-feed.rss',
        'https://lukesmith.xyz/rss.xml'
    ]
}; // should probably use cookies for this shit but nah
    // oh yeah, VPS owners should change 127.0.0.1 to be the domain of their VPS




var searchProvider = "https://duckduckgo.com/?q="; // my definitions are all over the place, im so used to swtiching back and forth from node omfg this is a nightmare
var omniBar = document.getElementById('omniBar');
var currentElement = document.body;
function doAbstractSearch() {
    fetch('http://127.0.0.1:8080/ac?q=' + encodeURIComponent(omniBar.value), { 
  method: 'GET'
    })
    .then(function(response) { return response.json(); }) // promises feel bloated idk why
    .then(function(json) {
        if (!document.getElementsByClassName('autosuggestion').length == 0) {
            document.getElementById('autosuggestions').innerHTML = ''
        }
        for (i = 0; i < json.length; i++) {
            var tabindex = i + 2; // ah fuck dont look down                                                                                                      //this is a real nightmare
            document.getElementById('autosuggestions').innerHTML += '<div class="autosuggestion" onclick="sendToSearch(`' + json[i][0].replace('<b>','').replace('</b>','').split(' ').join(' ') + '`)" tabindex="' + tabindex + '">' + json[i][0].replace('<b>','').replace('</b>','').split(' ').join(' ') +'</div>'; // yeah I know BUT I TOLD YOU NOT TO LOOK AT THIS SHIT
        }
    });
}
function sendToSearch(text) {
    omniBar.value = text;
    doAbstractSearch();
}
function redirect() {
    if(!omniBar.value.startsWith('http')) {  // god knows why the fuck I did this shit
        window.location.href = searchProvider + encodeURIComponent(omniBar.value).replace(' ','%20');
    } else {
        url = new URL(omniBar.value)
        url.protocol = 'https:' // auto HTTPS upgrade for yah lazy muufukkas!!!!!!!111!!!
        window.location.href = url;
    }
}
document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        if (currentElement.className == 'autosuggestion' && omniBar.value != currentElement.innerText) {
            omniBar.value = currentElement.innerText;
        } else {
            if (document.activeElement.id == "omniBar") {
                redirect();
            }
        }
    }
    if (event.key === 'Escape') {
        event.preventDefault();
        document.getElementById('autosuggestions').style = 'display: none;';
    }
    if (omniBar.value.startsWith('http')) {
        omniBar.className = "text isUrl";
        document.getElementById('autosuggestions').innerHTML = '';
    } else {
        omniBar.className = "text";
        if (event.key !== 'Tab' || event.key !== 'Escape') {
            doAbstractSearch();
        }
    }
});
var tday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var tmonth=["January","February","March","April","May","June","July","August","September","October","November","December"];
function GetClock(){
    var d=new Date(); //haha 69 lines LOL
    var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getFullYear();
    var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;
    if(nhour==0){ap=" AM";nhour=12;}
    else if(nhour<12){ap=" AM";}
    else if(nhour==12){ap=" PM";}
    else if(nhour>12){ap=" PM";nhour-=12;} // yeah this was copy and pasted from a generator
    if(nmin<=9) nmin="0"+nmin;
    if(nsec<=9) nsec="0"+nsec;
    var clocktext=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
    document.getElementById('clockbox').innerHTML=clocktext;
}
GetClock();
setInterval(GetClock,1000);
function focusOut(event) {
    if (currentElement.className == '') {
        document.getElementById('autosuggestions').style = 'display: none;';
    }
} //fuck looking into this wish I did event handlers, it makes no difference but now the code feels bloated
function focusIn(event) {
    document.getElementById('autosuggestions').style = 'display: flex;';
}
window.onmouseover = function(event) {
    currentElement = event.target;
}
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
} // credit: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
for (i = 0; i < rssFeeds.items.length; i++) {
    fetch('http://127.0.0.1:8080/feed?q=' + encodeURIComponent(rssFeeds.items[i]), { 
        method: 'GET'
            })
            .then(function(response) { return response.json(); }) // promises feel bloated idk why
            .then(function(json) {
            for  (o = 0; o < json.items.length && o < 5; o++) {
                currentUUID = uuidv4();                                    //begin the awful code
                document.getElementById('articles').innerHTML += `<div id="${currentUUID}" class="article-container"></div>`;
                document.getElementById(currentUUID).innerHTML += `<p class="article-title">${json.items[o].title}</p>`
            }
        }); //fuc dis shit is so messy
}