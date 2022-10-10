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