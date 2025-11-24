import GlobalInterface from "./global.interface";

namespace CodesInterface {

    //! GET_CODES_START

    export interface IGetCodesQuery extends GlobalInterface.IPagination {
        project_id: string;
    }

    export interface IGetCodesPayloads extends GlobalInterface.IPagination {
        projectId: string;
    }

    //! GET_CODES_END


    //! CREATE_CODE_START

    export interface ICreateCodeBody {
        project_id: string;
        code_value: string;
        code_description: string;
    }

    //! CREATE_CODE_END

}

export default CodesInterface