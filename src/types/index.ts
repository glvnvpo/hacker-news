// @flow

export type ID = number | string;

export type URL = string;

export type Story = {
    id: ID;
    title: string;
    by: string;
    time: number | string;
    score: number | string;
    kids?: Array<ID>;
    text?: string;
    url?: string;
    descendants?: number | string;
}

export type Comment = {
    id: ID;
    by?: string;
    text: string;
    time: number | string;
    deleted?: boolean;
    dead?: boolean;
    kids?: Array<ID>;
    children?: Array<Comment>;
    showChildComment?: boolean;
    isLoadingChildren?: boolean;
}