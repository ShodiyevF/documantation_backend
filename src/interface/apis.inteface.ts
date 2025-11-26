import DbTableSchema from "@database/schema.database";
import GlobalInterface from "./global.interface";

namespace ApisInterface {

    //! GET_APIS_START
    
    export interface IGetApisQuery extends GlobalInterface.IPagination {
        module_id: string;
    }
    
    export interface IGetApisPayloads extends GlobalInterface.IPagination {
        moduleId: string;
    }

    //! GET_APIS_END

    
    //! CREATE_API_START

    export interface ICreateApiBody {
        module_id: string;
        api_name: string;
        api_route: string;
        api_method: DbTableSchema.TApisApiMethodEnum;
        api_authorization: boolean;
        api_description: string;
    }
    
    //! CREATE_API_END

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
        key_name: string;
        key_types: string[];
        key_mock_data: string | null;
        key_description: string | null;
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