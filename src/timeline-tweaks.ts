import { getAllRedditThings } from "./helpers";
import { RedditThing } from "./reddit-things";

async function filterSubreddit(redditThing: RedditThing) {
    const res = await fetch(
        `https://old.reddit.com/api/filter/user/${window.r.config.logged}/f/all/r/${encodeURIComponent(redditThing.subreddit)}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Modhash": window.r.config.modhash,
                "X-Requested-With": "XMLHttpRequest",
            },
            body: `model=${encodeURIComponent(
                JSON.stringify({
                    name: redditThing.subreddit,
                }),
            )}`,
        },
    );

    return await res.json();
}

export default async function timelineTweaks(): Promise<void> {
    let untouchedThings = await getAllRedditThings();

    if (untouchedThings.length === 0) return;

    console.log(`Found ${untouchedThings.length} new posts!\nHooking...`);

    untouchedThings.forEach((thing) => {
        thing.buttonBar.addListItem("filter subreddit", () => {
            filterSubreddit(thing);
        });
        thing.addCSSClass("touched");
    });

    console.log("Done!");
}
