type IPaginationInfo = {
    lastRef: string;

    totalItemOfPage?: number;
};

type IPaginationResponse<T> = {
    pagination: IPaginationInfo;

    items: T[];

    filter?: any;

    sort?: any;
};

export { IPaginationInfo, IPaginationResponse };
