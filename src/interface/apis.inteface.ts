namespace ApisInterface {

    export interface IGetApis {
        projectId: string;
    }

    export interface ICreateApiBody {
        project_id: string;
        api_route: string;
        api_method: string;
    }

    export interface IGetApiByRoute {
        projectId: string;
        apiRoute: string;
    }

    export interface IInsertApi {
        apiMethod: string;
        apiRoute: string;
        apiOwnerId: string;
        apiProjectId: string;
    }
    
}

export default ApisInterface