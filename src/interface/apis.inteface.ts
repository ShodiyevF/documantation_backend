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

    export interface IApiResponseBody {
        api_id: string;
        response_status: boolean;
        response_status_code: number;
        response_description: string;
        response_keys: IResponseKey[];
    }

    export interface IInsertApiResponse {
        responseStatus: boolean;
        responseStatusCode: number;
        responseDescription: string;
        responseOwnerId: string;
        responseApiId: string;
    }

    export interface IInsertResponseKey {
        rkName: string;
        rkTypes: string[];
        rkMockData: string;
        rkDescription: string | null;
        rkOwnerId: string;
        rkResponseId: string;
    }

    export interface IResponseKey {
        key_name: string;
        key_types: string[];
        key_mock_data: string;
        key_description: string | null;
    }
    
}

export default ApisInterface