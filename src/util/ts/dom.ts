export function getEl<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap>(
    query: string
): HTMLElementTagNameMap[T] {
    return document.querySelector(query)!;
}

export function createEl<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    options: {
        properties?: {
            [K in keyof HTMLElementTagNameMap[T]]?:
                HTMLElementTagNameMap[T][K];
        };
        attributes?: Record<string, string>;
        on?: {
            [E in keyof HTMLElementEventMap]?: (
                this: HTMLElementTagNameMap[T],
                event: HTMLElementEventMap[E]
            ) => any;
        };
        once?: {
            [E in keyof HTMLElementEventMap]?: (
                this: HTMLElementTagNameMap[T],
                event: HTMLElementEventMap[E]
            ) => any;
        };
        children?: (string | Node)[];
    }
): HTMLElementTagNameMap[T] {
    const element = document.createElement(tagName);

    if (options.attributes)
        Object.entries(options.attributes).forEach(([key, value]) =>
            element.setAttribute(key, value)
        );
    if (options.properties)
        Object.entries(options.properties).forEach(([key, value]) =>
            element[key as keyof typeof element] = value
        );

    const bindEvents = (eventsObject: any, once: boolean) =>
        eventsObject && Object.entries(eventsObject).forEach(([key, value]) =>
            element.addEventListener(
                key,
                value as EventListenerOrEventListenerObject,
                once
            )
        );

    bindEvents(options.on, false);
    bindEvents(options.once, true);

    if (options.children)
        element.replaceChildren(...options.children);

    return element;
}
