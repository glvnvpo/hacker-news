// @flow

export type Story = {
    id: number | string;
    title: string;
    by: string;
    time: number | string;
    score: number | string;
    kids?: Array<number | string>;
    text?: string;
    url?: string;
    descendants?: number | string;
}

export type ChildComment = {
    id: number | string;
    by: string;
    text: string;
    time: number | string;
}

export type Comment = {
    id: number | string;
    by: string;
    text: string;
    time: number | string;
    kids?: Array<number | string>;
    children?: Array<ChildComment>;
    showChildComment?: boolean;
}