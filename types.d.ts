export type ListsResult = { lists: { name: string, id: string }[]};

export type Element = JSX.Element | JSX.Element[] | Element;

export type BlogEntry = {
    url: string,
    pretty: string,
    content: Element,
    featured: boolean
};