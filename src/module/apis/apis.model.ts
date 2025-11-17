import DatabaseFunctions from "@database/functions.database"
import DbTableSchema from "@database/schema.database"
import ApisInterface from "@interface/apis.inteface"
import Exception from "@lib/http_exception.lib"
import ApisQuery from "@query/apis.query"
import FinderLib from "@lib/finder.lib"

namespace ApisModel {
    
    export async function getApis(params: ApisInterface.IGetApis, token: string) {
        const {
            projectId
        } = params
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const getProject = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: projectId,
                projectOwnerId: userId
            }
        })
        if (!getProject) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: projectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You do not have access to this project', Exception.Errors.NO_ACCESS_TO_THIS_PROJECT)
        }
        
        return await ApisQuery.getApisByProjectId(projectId)
    }
    
    export async function createApi(body: ApisInterface.ICreateApiBody, token: string) {
        const {
            project_id,
            module_id,
            api_name,
            api_route,
            api_method,
            api_description
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const getProject = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: project_id,
                projectOwnerId: userId
            }
        })
        if (!getProject) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }
        
        if (getProject.projectOwnerId !== userId) {
            throw new Exception.HttpException(404, 'You are not allowed to add api to this project!', Exception.Errors.NO_ACCESS_TO_THIS_PROJECT)
        }
        
        await DatabaseFunctions.insert({
            tableName: 'apis',
            data: {
                apiName: api_name,
                apiRoute: api_route,
                apiMethod: api_method as DbTableSchema.TApisApiMethodEnum,
                apiDescription: api_description,
                apiOwnerId: userId,
                apiModuleId: module_id,
                apiProjectId: project_id
            }
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
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const getApi = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiId: api_id
            }
        })
        if (!getApi) {
            throw new Exception.HttpException(404, 'Api not found', Exception.Errors.API_NOT_FOUND)
        }
        
        if (getApi.apiOwnerId !== userId) {
            throw new Exception.HttpException(404, 'You are not allowed to add api to this api!', Exception.Errors.NO_ACCESS_TO_THIS_API)
        }
        
        const response = await DatabaseFunctions.insert({
            tableName: 'responses',
            data: {
                responseStatus: response_status,
                responseStatusCode: response_status_code,
                responseDescription: response_description,
                responseApiId: api_id,
                responseOwnerId: userId,
            }
        })
        
        for (const key of response_keys) {
            await DatabaseFunctions.insert({
                tableName: 'responseKeys',
                data: {
                    rkName: key.key_name,
                    rkTypes: key.key_types,
                    rkMockData: key.key_mock_data,
                    rkDescription: key.key_description,
                    rkOwnerId: userId,
                    rkResponseId: response.responseId,
                }
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
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const getApi = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiId: api_id
            }
        })
        if (!getApi) {
            throw new Exception.HttpException(404, 'Api not found', Exception.Errors.API_NOT_FOUND)
        }
        
        if (getApi.apiOwnerId !== userId) {
            throw new Exception.HttpException(404, 'You are not allowed to add api to this api!', Exception.Errors.NO_ACCESS_TO_THIS_API)
        }
        
        const payload = await DatabaseFunctions.insert({
            tableName: 'payloads',
            data: {
                payloadType: payload_type,
                payloadDescription: payload_description,
                payloadOwnerId: userId,
                payloadApiId: api_id,
            }
        })
        
        for (const key of payload_keys) {
            await DatabaseFunctions.insert({
                tableName: 'payloadKeys',
                data: {
                    pkName: key.key_name,
                    pkTypes: key.key_types,
                    pkMockData: key.key_mock_data,
                    pkDescription: key.key_description,
                    pkOwnerId: userId,
                    pkPayloadId: payload.payloadId,
                }
            })
        }
    }
    
}

export default ApisModel