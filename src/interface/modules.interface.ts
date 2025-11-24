import GlobalInterface from "./global.interface";

namespace ModulesInterface {

    //! GET_MODULES_START

    export interface IGetModulesQuery extends GlobalInterface.IPagination {
        project_id: string;
    }

    export interface IGetModulesPayloads extends GlobalInterface.IPagination {
        projectId: string;
    }

    //! GET_MODULES_END

}

export default ModulesInterface