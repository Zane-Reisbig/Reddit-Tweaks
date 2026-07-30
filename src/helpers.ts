import { RedditThing } from "./reddit-things";

async function getElement(
    selector: string,
    options?: { getAll?: boolean },
): Promise<HTMLElement | HTMLElement[]> {
    options = { getAll: false, ...options };

    let selectorFunc: (selector: string) => HTMLElement | HTMLElement[] | null =
        (
            options.getAll ? document.querySelectorAll : document.querySelector
        ).bind(document);

    return new Promise((res) => {
        let me = setInterval(() => {
            let element = selectorFunc(selector);
            if (element == null)
                console.warn(
                    `Failed to find element with selector \"${selector}\"!`,
                );

            if (options.getAll && element instanceof NodeList) {
                res(Array.from(element as HTMLElement[]));
            } else {
                res(element as HTMLElement);
            }

            clearInterval(me);
        }, 300);
    });
}

function createClickableListItem(
    innerHTML: string,
    props: { onClick?: (event: MouseEvent) => void },
) {
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
        (await getElement("div.thing:not(.reddit-link):not(.touched)", {
            getAll: true,
        })) as HTMLElement[],
    ).map((thing) => new RedditThing(thing));
}

async function getFirstRedditThing() {
    return new RedditThing(
        (await getElement(
            "div.thing:not(.reddit-link):not(.touched)",
        )) as HTMLElement,
    );
}

export {
    getElement,
    getFirstRedditThing,
    getAllRedditThings,
    createClickableListItem,
};
