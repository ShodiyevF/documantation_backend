import DbTableSchema from "@database/schema.database";

namespace ProjectsInterface {

    export interface ICreateProjectBody {
        project_name: string;
        project_base_url?: string;
        project_authorization_type?: DbTableSchema.TProjectsProjectAuthorizationTypeEnum;
        project_description?: string;
    }

    //! UPDATE_PROJECT_START
    
    export interface IUpdateProjectBody {
        project_name?: string;
        project_base_url?: string;
        project_authorization_type?: DbTableSchema.TProjectsProjectAuthorizationTypeEnum;
        project_description?: string;
    }

    //! UPDATE_PROJECT_END


    //! TRANSFER_PROJECT_OWNERSHIP_START
    
    export interface ITransferProjectOwnershipBody {
        project_id: string;
        user_id: string;
    }

    //! TRANSFER_PROJECT_OWNERSHIP_END


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


    //! CONFIRM_PROJECT_INVITATION_START
    
    export interface IConfirmProjectInvitationBody {
        invitation_id: string;
        is_confirmed: boolean;
    }

    //! CONFIRM_PROJECT_INVITATION_END


    //! LEAVE_PROJECT_START
    
    export interface ILeaveProjectBody {
        project_id: string;
    }

    //! LEAVE_PROJECT_END


    //! REMOVE_PROJECT_USER_START
    
    export interface IRemoveProjectUserBody {
        project_id: string;
        user_id: string;
    }

    //! REMOVE_PROJECT_USER_END

}

export default ProjectsInterface