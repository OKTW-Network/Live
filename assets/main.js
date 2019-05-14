const autoIndexURL = "https://live.oktw.one/record/"

cheet('k k', function() {
    Array.from(document.getElementsByClassName("streamerName")).forEach(el => {
        el.innerHTML = el.innerHTML.replace("jim", "jik")
    })
});

const streamDivHTML = `
            <div id="streamerDiv" class="streamerDiv">
                <h2 id="streamerName" class="streamerName">{{streamerName}}</h2>
                <div id="streamerVideos" class="videosDiv">
                    
                </div>
            </div>
        `;

const videoDivHTML = `
            <div id="video" class="video">
                <img id="videoPreview" class="videoPreview" src="{{videoPreview}}">
                <div id="videoDuration" class="videoDuration">{{videoDuration}}</div>
                <div id="videoTime" class="videoTime">{{videoTime}}</div>
            </div>
        `

var videoElement = document.getElementById('player');
var flvPlayer = null;

function twoNum(num) {
    if (num.toString().length == 1) {
        return ("0" + num)
    } else {
        return (num)
    }
}

function playVideo(video) {
    if (flvPlayer != null) {
        flvPlayer.destroy();
    }
    flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: video.url,
        filesize: video.size,
        duration: Array.from(document.getElementsByClassName("video")).filter((videoEl) => {
            if (videoEl.getElementsByClassName("videoPreview")[0].src.includes(video.url.replace(".flv", ""))) {
                return (true)
            } else {
                return (false)
            }
        }).map((videoEl) => {
            var second = parseInt(videoEl.getElementsByClassName("videoDuration")[0].innerHTML.split(":")[0]) * 3600;
            second = second + parseInt(videoEl.getElementsByClassName("videoDuration")[0].innerHTML.split(":")[1]) * 60;
            second = second + parseInt(videoEl.getElementsByClassName("videoDuration")[0].innerHTML.split(":")[2]);
            return (second * 1000)
        })[0]
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
    console.log(video);
    document.getElementById("playerDiv").getElementsByTagName("h1")[0].innerText = `${video.streamer}`
    document.getElementById("playerDiv").getElementsByTagName("h3")[0].innerText = `${twoNum(video.publishTime.getFullYear())}-${twoNum(video.publishTime.getMonth() + 1)}-${twoNum(video.publishTime.getDate())} ${twoNum(video.publishTime.getHours())}:${twoNum(video.publishTime.getMinutes())}:${twoNum(video.publishTime.getSeconds())}`
    window.scrollTo(0, 0)
}

function strToEl(str) {
    var el = document.createElement("div");
    el.innerHTML = str.trim();
    return (el.firstChild)
}

function getVideoData(url) {
    return ({
        duration: "20:77"
    })
}

function getVideoEl(video) {
    var videoEl = strToEl(videoDivHTML
        .replace("{{videoPreview}}", video.preivew)
        .replace("{{videoDuration}}", video.duration)
        .replace("{{videoTime}}", `${twoNum(video.publishTime.getFullYear())}-${twoNum(video.publishTime.getMonth() + 1)}-${twoNum(video.publishTime.getDate())} ${twoNum(video.publishTime.getHours())}:${twoNum(video.publishTime.getMinutes())}:${twoNum(video.publishTime.getSeconds())}`));
    videoEl.onclick = () => {
        playVideo(video);
    }
    return (videoEl)
}

function setVideoDuration(videoEl) {
    const jsonXHR = new XMLHttpRequest();
    jsonXHR.open("GET", videoEl.getElementsByClassName("videoPreview")[0].src.replace(".png", ".json"));
    jsonXHR.onreadystatechange = (e) => {
        if (jsonXHR.readyState == 4 && jsonXHR.status == 200) {
            var duration = JSON.parse(jsonXHR.response).format.duration;
            videoEl.getElementsByClassName("videoDuration")[0].innerHTML = `${moment("2018-01-01").startOf('day').seconds(duration).format('H:mm:ss')}`
        }
    }
    jsonXHR.send()
}

window.onload = () => {
    const autoIndexXHR = new XMLHttpRequest();
    autoIndexXHR.open("GET", autoIndexURL);
    autoIndexXHR.onreadystatechange = (e) => {
        if (autoIndexXHR.readyState == 4 && autoIndexXHR.status == 200) {
            var videos = autoIndexXHR.response.split("\n").filter((video) => {
                return ((video.includes("<a href") && video.includes(".flv") && !video.includes(`a href="../">../</a>`)) ? true : false)
            }).map((video) => {
                return ([...video.matchAll(/\<a href="(.+)-(.+)\.flv">.+<\/a>[ ]+(.+:..)[ ]+([0-9]+)/g)][0])
            }).map((video) => {
                return ({
                    streamer: video[1],
                    videoID: video[2],
                    publishTime: new Date(video[3]),
                    size: video[4],
                    preivew: autoIndexURL + video[1] + "-" + video[2] + ".png",
                    duration: "",
                    url: autoIndexURL + video[1] + "-" + video[2] + ".flv"
                })
            }).filter((video) => {
                return ((video.size === "0" ? false : true))
            }).reverse();

            var streamers = {};
            videos.forEach((video) => {
                if (video.streamer in streamers) {
                    streamers[video.streamer].videos.push(video)
                } else {
                    streamers[video.streamer] = {
                        name: video.streamer,
                        videos: [video]
                    }
                }
            })

            for (var name in streamers) {
                const streamer = streamers[name]
                var streamerDiv = strToEl(streamDivHTML
                    .replace("{{streamerName}}", streamer.name));
                streamerDiv.id = streamer.name + "Records";
                document.getElementsByClassName("container")[0].appendChild(streamerDiv);
                streamer.videos.forEach((video) => {
                    document.querySelector(`div#${streamer.name}Records > #streamerVideos`).appendChild(getVideoEl(video));
                })
                document.getElementsByClassName("container")[0].appendChild(document.getElementsByClassName("line")[0].cloneNode());
            }

            setTimeout(() => {
                Array.from(document.getElementsByClassName("video")).forEach((video) => {
                    setVideoDuration(video);
                })
            }, 500)
        }
    }
    autoIndexXHR.send();
}