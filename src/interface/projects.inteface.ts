import DbTableSchema from "@database/schema.database";

namespace ProjectsInterface {

    export interface ICreateProjectBody {
        project_name: string;
        project_base_url?: string;
        project_authorization_type?: DbTableSchema.TProjectsProjectAuthorizationTypeEnum;
        project_description?: string;
    }

}

export default ProjectsInterface