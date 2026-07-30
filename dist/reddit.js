(() => {
  // src/reddit-things.ts
  var RedditThing = class _RedditThing {
    static isRedditThing(element) {
      return element.tagName === "DIV" && element.classList.contains("thing") && (element.classList.contains("odd") || element.classList.contains("even"));
    }
    src;
    buttonBar;
    get self() {
      if (!this.src.isConnected)
        throw new Error("Thing no longer visible in DOM!");
      return this.src;
    }
    get author() {
      return this.queryDataTag("author");
    }
    get subreddit() {
      return this.queryDataTag("subreddit");
    }
    get subreddit_prefixed() {
      return this.queryDataTag("subreddit-prefixed");
    }
    get url() {
      return this.queryDataTag("url");
    }
    get permalink() {
      return this.queryDataTag("permalink");
    }
    get promoted() {
      return this.queryDataTag("promoted");
    }
    get nsfw() {
      return this.queryDataTag("nsfw");
    }
    constructor(rootElement) {
      if (!_RedditThing.isRedditThing(rootElement))
        throw new Error("Element not Reddit Thing!");
      this.src = rootElement;
      this.buttonBar = new RedditThingButtonBar(this);
    }
    addCSSClass(className) {
      this.self.classList.add(className);
    }
    queryDataTag(tagName, props = { isData: true }) {
      let attrName = props.isData ? `data-${tagName}` : tagName;
      return this.self.getAttribute(attrName);
    }
  };
  var RedditThingButtonBar = class {
    src;
    get self() {
      if (!this.src.isConnected)
        throw new Error("Button Bar no longer in DOM Tree!");
      return this.src;
    }
    constructor(parent) {
      this.src = parent.self.querySelector(
        "ul.flat-list.buttons"
      );
    }
    addListItem(textContent, onClick) {
      this.self.appendChild(
        createClickableListItem(textContent, {
          onClick
        })
      );
    }
  };

  // src/helpers.ts
  async function getElement(selector, options) {
    options = { getAll: false, ...options };
    let selectorFunc = (options.getAll ? document.querySelectorAll : document.querySelector).bind(document);
    return new Promise((res) => {
      let me = setInterval(() => {
        let element = selectorFunc(selector);
        if (element == null)
          console.warn(
            `Failed to find element with selector "${selector}"!`
          );
        if (options.getAll && element instanceof NodeList) {
          res(Array.from(element));
        } else {
          res(element);
        }
        clearInterval(me);
      }, 300);
    });
  }
  function createClickableListItem(innerHTML, props) {
    const hyperlink = document.createElement("a");
    hyperlink.style.cursor = "pointer";
    hyperlink.innerHTML = innerHTML;
    hyperlink.href = "javascript: void 0;";
    const listItem = document.createElement("li");
    if (props.onClick) listItem.addEventListener("click", props.onClick);
    listItem.appendChild(hyperlink);
    return listItem;
  }
  async function getAllRedditThings() {
    return Array.from(
      await getElement("div.thing:not(.reddit-link):not(.touched)", {
        getAll: true
      })
    ).map((thing) => new RedditThing(thing));
  }
  async function getFirstRedditThing() {
    return new RedditThing(
      await getElement(
        "div.thing:not(.reddit-link):not(.touched)"
      )
    );
  }

  // src/comments-tweaks.ts
  var rapidSaveURL = "https://sd.rapidsave.com/download.php?permalink=";
  var createDownloadURL = (thing) => `${rapidSaveURL}https://reddit.com/${thing.permalink}&video_url=${thing.url}/CMAF_480.mp4?source=fallback&audio_url=https://${thing.url}/CMAP_AUDIO_128.mp4`;
  async function downloadPost(thing) {
    console.log("Downloading Post");
    const link = document.createElement("a");
    link.href = createDownloadURL(thing);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  async function commentsTweaks() {
    try {
      var ourPost = await getFirstRedditThing();
    } catch {
      return;
    }
    console.log("Got post, hooking...");
    console.log(ourPost);
    ourPost.buttonBar.addListItem(
      "download video",
      () => downloadPost(ourPost)
    );
    ourPost.addCSSClass("touched");
  }

  // src/timeline-tweaks.ts
  async function filterSubreddit(redditThing) {
    const res = await fetch(
      `https://old.reddit.com/api/filter/user/${window.r.config.logged}/f/all/r/${encodeURIComponent(redditThing.subreddit)}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Modhash": window.r.config.modhash,
          "X-Requested-With": "XMLHttpRequest"
        },
        body: `model=${encodeURIComponent(
          JSON.stringify({
            name: redditThing.subreddit
          })
        )}`
      }
    );
    return await res.json();
  }
  async function timelineTweaks() {
    let untouchedThings = await getAllRedditThings();
    if (untouchedThings.length === 0) return;
    console.log(`Found ${untouchedThings.length} new posts!
Hooking...`);
    untouchedThings.forEach((thing) => {
      thing.buttonBar.addListItem("filter subreddit", () => {
        filterSubreddit(thing);
      });
      thing.addCSSClass("touched");
    });
    console.log("Done!");
  }

  // src/reddit.ts
  (function() {
    "use strict";
    console.log("Reddit Tweaks Loaded!");
    setInterval(async () => {
      switch (window.location.toString().includes("comments")) {
        case true:
          await commentsTweaks();
          break;
        case false:
          await timelineTweaks();
          break;
      }
    }, 500);
  })();
})();
//# sourceMappingURL=reddit.js.map
