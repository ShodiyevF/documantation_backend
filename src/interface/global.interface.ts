namespace GlobalInterface {

    export interface IGetAll {
        term: string;
    }

    export interface IPagination {
        page: number;
        limit: number;
    }
    
}

export default GlobalInterface