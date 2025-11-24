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

}

export default CodesInterface