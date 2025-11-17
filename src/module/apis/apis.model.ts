import ApisInterface from "@interface/apis.inteface"
import ProjectsQuery from "@query/projects.query"
import Exception from "@lib/http_exception.lib"
import ApisQuery from "@query/apis.query"
import JWT from "@lib/jwt.lib"

namespace ApisModel {

    export async function getApis(params: ApisInterface.IGetApis, token: string) {
        const {
            projectId
        } = params

        const userId = JWT.verifyJwtToken(token)

        const getProject = await ProjectsQuery.getProjectsById({
            project_id: projectId,
            user_id: userId
        })
        if (!getProject) {
            throw new Exception.HttpException(404, 'Project not found', Exception.FRONT.PROJECT_NOT_FOUND)
        }

        const checkUserProject = await ProjectsQuery.checkProjectByUserId(userId, projectId)
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You do not have access to this project', Exception.Errors.NO_ACCESS)
        }

        return await ApisQuery.getApisByProjectId(projectId)
    }

    export async function createApi(body: ApisInterface.ICreateApiBody, token: string) {
        const {
            project_id,
            api_name,
            api_route,
            api_method,
            api_description
        } = body

        const userId = JWT.verifyJwtToken(token)

        const getProject = await ProjectsQuery.getProjectsById({
            project_id: project_id,
            user_id: userId
        })
        if (!getProject) {
            throw new Exception.HttpException(404, 'Project not found', Exception.FRONT.PROJECT_NOT_FOUND)
        }

        if (getProject.project_owner.user_id !== userId) {
            throw new Exception.HttpException(404, 'You are not allowed to add api to this project!', Exception.Errors.NO_ACCESS)
        }

        await ApisQuery.insertApi({
            apiName: api_name,
            apiRoute: api_route,
            apiMethod: api_method,
            apiDescription: api_description,
            apiOwnerId: userId,
            apiProjectId: project_id
        })
    }

    export async function createApiResponse(body: ApisInterface.IApiResponseBody, token: string) {
        const {
            api_id,
            response_status,
            response_status_code,
            response_description,
            response_keys
        } = body

        const userId = JWT.verifyJwtToken(token)

        const getApi = await ApisQuery.getApiById(api_id)
        if (!getApi) {
            throw new Exception.HttpException(404, 'Api not found', Exception.FRONT.API_NOT_FOUND)
        }

        if (getApi.apiOwnerId !== userId) {
            throw new Exception.HttpException(404, 'You are not allowed to add api to this api!', Exception.Errors.NO_ACCESS)
        }

        const response = await ApisQuery.insertResponse({
            responseStatus: response_status,
            responseStatusCode: response_status_code,
            responseDescription: response_description,
            responseApiId: api_id,
            responseOwnerId: userId,
        })

        for (const key of response_keys) {
            await ApisQuery.insertResponseKey({
                rkName: key.key_name,
                rkTypes: key.key_types,
                rkMockData: key.key_mock_data,
                rkDescription: key.key_description,
                rkOwnerId: userId,
                rkResponseId: response.responseId,
            })
        }
    }

    export async function createApiPayload(body: ApisInterface.IApiPayloadBody, token: string) {
        const {
            api_id,
            payload_type,
            payload_description,
            payload_keys
        } = body

        const userId = JWT.verifyJwtToken(token)

        const getApi = await ApisQuery.getApiById(api_id)
        if (!getApi) {
            throw new Exception.HttpException(404, 'Api not found', Exception.FRONT.API_NOT_FOUND)
        }

        if (getApi.apiOwnerId !== userId) {
            throw new Exception.HttpException(404, 'You are not allowed to add api to this api!', Exception.Errors.NO_ACCESS)
        }

        const payload = await ApisQuery.insertPayload({
            payloadType: payload_type,
            payloadDescription: payload_description,
            payloadOwnerId: userId,
            payloadApiId: api_id,
        })
        
        for (const key of payload_keys) {
            await ApisQuery.insertPayloadKey({
                pkName: key.key_name,
                pkTypes: key.key_types,
                pkMockData: key.key_mock_data,
                pkDescription: key.key_description,
                pkOwnerId: userId,
                pkPayloadId: payload.payloadId,
            })
        }
    }

}

export default ApisModel