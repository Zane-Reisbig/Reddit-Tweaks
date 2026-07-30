import { createClickableListItem } from "./helpers";

class RedditThing {
    static isRedditThing(element: HTMLElement): boolean {
        return (
            element.tagName === "DIV" &&
            element.classList.contains("thing") &&
            (element.classList.contains("odd") ||
                element.classList.contains("even"))
        );
    }

    src: HTMLElement;
    buttonBar: RedditThingButtonBar;

    get self() {
        if (!this.src.isConnected)
            throw new Error("Thing no longer visible in DOM!");

        return this.src;
    }

    get author(): string {
        return this.queryDataTag("author") as string;
    }
    get subreddit() {
        return this.queryDataTag("subreddit") as string;
    }
    get subreddit_prefixed() {
        return this.queryDataTag("subreddit-prefixed") as string;
    }
    get url() {
        return this.queryDataTag("url") as string;
    }
    get permalink() {
        return this.queryDataTag("permalink") as string;
    }
    get promoted() {
        return this.queryDataTag("promoted") as string;
    }
    get nsfw() {
        return this.queryDataTag("nsfw") as string;
    }

    constructor(rootElement: HTMLElement) {
        if (!RedditThing.isRedditThing(rootElement))
            throw new Error("Element not Reddit Thing!");

        this.src = rootElement;
        this.buttonBar = new RedditThingButtonBar(this);
    }

    public addCSSClass(className: string) {
        this.self.classList.add(className);
    }

    public queryDataTag(
        tagName: string,
        props: { isData?: boolean } = { isData: true },
    ): string | null {
        let attrName = props.isData ? `data-${tagName}` : tagName;

        return this.self.getAttribute(attrName);
    }
}

class RedditThingButtonBar {
    src: HTMLElement;

    get self() {
        if (!this.src.isConnected)
            throw new Error("Button Bar no longer in DOM Tree!");

        return this.src;
    }

    constructor(parent: RedditThing) {
        this.src = parent.self.querySelector(
            "ul.flat-list.buttons",
        ) as HTMLButtonElement;
    }

    public addListItem(textContent: string, onClick: (e: MouseEvent) => void) {
        this.self.appendChild(
            createClickableListItem(textContent, {
                onClick,
            }),
        );
    }
}

export { RedditThing, RedditThingButtonBar };
