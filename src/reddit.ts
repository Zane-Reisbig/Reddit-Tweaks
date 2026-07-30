import commentsTweaks from "./comments-tweaks";
import timelineTweaks from "./timeline-tweaks";

declare global {
    interface Window {
        r: {
            config: {
                modhash: any;
                logged: any;
            };
        };
    }
}

(function () {
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
