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

    
    //! CHANGE_API_MODULE_START

    export interface IChangeApiModuleBody {
        api_id: string;
        module_id: string;
    }
    
    //! CHANGE_API_MODULE_END

    
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


    //! CREATE_RESPONSE_START
    
    export interface ICreateApiResponseBody {
        api_id: string;
        response_type: DbTableSchema.TResponsesResponseTypeEnum;
        response_schema: object;
        response_description: string | null;
    }

    //! CREATE_RESPONSE_END


    //! UPDATE_API_RESPONSE_START

    export interface IUpdateApiResponseBody {
        response_type?: DbTableSchema.TResponsesResponseTypeEnum;
        response_schema?: object;
        response_description?: string | null;
    }
    
    //! UPDATE_API_RESPONSE_END
    
}

export default ApisInterface