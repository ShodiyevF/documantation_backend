namespace ApisInterface {

    export interface IGetApis {
        projectId: string;
    }

    export interface ICreateApiBody {
        project_id: string;
        api_name: string;
        api_route: string;
        api_method: string;
        api_description: string;
    }

    export interface IGetApiByRoute {
        projectId: string;
        apiRoute: string;
    }

    export interface IInsertApi {
        apiName: string;
        apiMethod: string;
        apiRoute: string;
        apiDescription: string;
        apiOwnerId: string;
        apiProjectId: string;
    }
    
}

export default ApisInterface