namespace ProjectsInterface {

    export interface IGetProjectByName {
        project_name: string;
        user_id: string;
    }

    export interface IGetProjectById {
        project_id: string;
        user_id: string;
    }

    export interface ICreateProjectBody {
        project_name: string;
        project_description: string;
    }

    export interface ICreateProject {
        projectName: string;
        projectDescription: string;
        projectOwnerId: string;
    }

    export interface IAttachUserToProject {
        puProjectId: string;
        puUserId: string;
    }

}

export default ProjectsInterface