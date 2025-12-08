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

    
    //! UPDATE_API_START

    export interface IUpdateApiBody {
        api_name?: string;
        api_route?: string;
        api_method?: DbTableSchema.TApisApiMethodEnum;
        api_authorization?: boolean;
        api_description?: string;
    }
    
    //! UPDATE_API_END


    //! CREATE_API_PAYLOAD_START

    export interface ICreateApiPayloadBody {
        api_id: string;
        payload_type: DbTableSchema.TPayloadsPayloadTypeEnum;
        payload_schema: object;
        payload_description: string | null;
    }

    //! CREATE_API_PAYLOAD_END


    //! UPDATE_API_PAYLOAD_START

    export interface IUpdateApiPayloadBody {
        payload_type?: DbTableSchema.TPayloadsPayloadTypeEnum;
        payload_schema?: object;
        payload_description?: string | null;
    }
    
    //! UPDATE_API_PAYLOAD_END


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

    
    
}

export default ApisInterface