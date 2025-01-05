namespace ApisInterface {

    //! APIS_START
    
    export interface IGetApis {
        projectId: string;
    }

    export interface IGetApiByRoute {
        projectId: string;
        apiRoute: string;
    }

    export interface ICreateApiBody {
        project_id: string;
        api_name: string;
        api_route: string;
        api_method: string;
        api_description: string;
    }

    export interface IInsertApi {
        apiName: string;
        apiMethod: string;
        apiRoute: string;
        apiDescription: string;
        apiOwnerId: string;
        apiProjectId: string;
    }

    //! APIS_END


    //! RESPONSE_START
    
    export interface IResponseKey {
        key_name: string;
        key_types: string[];
        key_mock_data: string;
        key_description: string | null;
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
    
    //! RESPONSE_END

    
    //! PAYLOAD_START

    export interface IPayloadKey {
        pk_name: string;
        pk_types: string[];
        pk_mock_data: string | null;
        pk_description: string | null;
        pk_owner_id: string;
        pk_payload_id: string;
    }

    export interface IApiPayloadBody {
        api_id: string;
        payload_type: string;
        payload_description: string | null;
        payload_keys: IPayloadKey[];
    }

    export interface IInsertPayload {
        payloadType: string;
        payloadDescription: string | null;
        payloadOwnerId: string;
        payloadApiId: string;
    }

    export interface IInsertPayloadKey {
        pkName: string;
        pkTypes: string[];
        pkMockData: string | null;
        pkDescription: string | null;
        pkOwnerId: string;
        pkPayloadId: string;
    }

    //! PAYLOAD_END
    
}

export default ApisInterface