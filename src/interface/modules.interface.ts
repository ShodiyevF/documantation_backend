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


    //! CREATE_MODULE_START

    export interface ICreateModuleBody {
        project_id: string;
        module_name: string;
        module_description?: string;
    }

    //! CREATE_MODULE_END

}

export default ModulesInterface