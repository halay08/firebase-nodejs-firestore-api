type ListResponse<T> = {
    request?: object;
    pageToken?: string;
    nextPageToken?: string;
    items: Array<T>;
};

export { ListResponse };
