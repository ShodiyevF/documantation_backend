import DbTableSchema from "@database/schema.database";

namespace ProjectsInterface {

    export interface ICreateProjectBody {
        project_name: string;
        project_base_url?: string;
        project_authorization_type?: DbTableSchema.TProjectsProjectAuthorizationTypeEnum;
        project_description?: string;
    }

    //! CREATE_PROJECT_INVITATIONS_START
    
    export interface ICreateProjectInvitationBody {
        project_id: string;
        user_ids: string[];
    }

    export interface IGetProjectInvitationsByUserIdsQuery {
        projectId: string;
        userIds: string[];
    }

    //! CREATE_PROJECT_INVITATIONS_END

}

export default ProjectsInterface