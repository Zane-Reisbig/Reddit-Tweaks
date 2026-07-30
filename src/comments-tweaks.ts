// ==UserScript==
// @name         Reddit Comment Tweaks
// @namespace    http://tampermonkey.net/
// @version      2026-04-03
// @description  try to take over the world!
// @author       You
// @match        https://old.reddit.com/r/*/comments/*
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

import { getFirstRedditThing } from "./helpers";
import { RedditThing } from "./reddit-things";

const rapidSaveURL = "https://sd.rapidsave.com/download.php?permalink=";
const createDownloadURL = (thing: RedditThing) =>
    `${rapidSaveURL}https://reddit.com/${thing.permalink}&video_url=${thing.url}/CMAF_480.mp4?source=fallback&audio_url=https://${thing.url}/CMAP_AUDIO_128.mp4`;

async function downloadPost(thing: RedditThing) {
    console.log("Downloading Post");

    const link = document.createElement("a");
    link.href = createDownloadURL(thing);

    document.body.appendChild(link);
    link.click();
    link.remove();
}

export default async function commentsTweaks() {
    try {
        var ourPost = await getFirstRedditThing();
    } catch {
        return;
    }

    console.log("Got post, hooking...");
    console.log(ourPost);

    ourPost.buttonBar.addListItem("download video", () =>
        downloadPost(ourPost),
    );
    ourPost.addCSSClass("touched");
}
// "https://sd.rapidsave.com/download.php?permalink=https://reddit.com/r/MadeMeSmile/comments/1vadj2x/babys_first_kiss/&video_url=https://v.redd.it/zvdqo7xtc9gh1/CMAF_480.mp4?source=fallback&audio_url=https://v.redd.it/zvdqo7xtc9gh1/CMAF_AUDIO_128.mp4"
