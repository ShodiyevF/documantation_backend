import DatabaseFunctions from "@database/functions.database"
import UsefulfunctionsUtil from "@util/usefulfunctions.util"
import ApisInterface from "@interface/apis.inteface"
import Exception from "@lib/http_exception.lib"
import ApisQuery from "@query/apis.query"
import FinderLib from "@lib/finder.lib"

namespace ApisModel {
    
    export async function getApis(query: ApisInterface.IGetApisQuery, token: string) {
        const {
            limit,
            page,
            module_id
        } = query
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const module = await DatabaseFunctions.select({
            tableName: 'modules',
            filter: {
                moduleId: module_id,
                moduleIsDeleted: false
            }
        })
        if (!module) {
            throw new Exception.HttpException(404, 'Module not found', Exception.Errors.MODULE_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: module.moduleProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        const result = await ApisQuery.getApisByModuleId({
            limit: limit,
            page: page,
            moduleId: module_id
        })
        const totalPages = Math.ceil(result.count / limit);

        return {
            total_page: totalPages,
            current_page: page,
            data: result.data
        } 
    }
    
    export async function createApi(body: ApisInterface.ICreateApiBody, token: string) {
        const {
            module_id,
            api_name,
            api_route,
            api_method,
            api_authorization,
            api_description,
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const module = await DatabaseFunctions.select({
            tableName: 'modules',
            filter: {
                moduleId: module_id,
                moduleOwnerId: userId
            }
        })
        if (!module) {
            throw new Exception.HttpException(404, 'Module not found', Exception.Errors.MODULE_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: module.moduleProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        const checkApi = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiRoute: api_route,
                apiMethod: api_method,
                apiProjectId: module.moduleProjectId
            }
        })
        if (checkApi) {
            throw new Exception.HttpException(404, 'Api already exists', Exception.Errors.API_ALREADY_EXISTS)
        }
        
        await DatabaseFunctions.insert({
            tableName: 'apis',
            data: {
                apiName: api_name,
                apiRoute: api_route,
                apiMethod: api_method,
                apiAuthorization: api_authorization,
                apiDescription: api_description,
                apiOwnerId: userId,
                apiModuleId: module_id,
                apiProjectId: module.moduleProjectId
            }
        })
    }
    
    export async function updateApi(body: ApisInterface.IUpdateApiBody, api_id: string, token: string) {
        const {
            api_name,
            api_route,
            api_method,
            api_authorization,
            api_description,
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const api = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiId: api_id,
                apiOwnerId: userId
            }
        })
        if (!api) {
            throw new Exception.HttpException(404, 'Api not found', Exception.Errors.API_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: api.apiProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        const apiName = api_name ? api_name : api.apiName
        const apiRoute = api_route ? api_route : api.apiRoute
        const apiMethod = api_method ? api_method : api.apiMethod
        const apiAuthorization = api_authorization ? api_authorization : api.apiAuthorization
        const apiDescription = UsefulfunctionsUtil.isNullableData(api_description, api.apiDescription)
        
        const checkApi = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiRoute: apiRoute,
                apiMethod: apiMethod,
                apiProjectId: api.apiProjectId
            }
        })
        if (checkApi && checkApi.apiId !== api_id) {
            throw new Exception.HttpException(404, 'Api already exists', Exception.Errors.API_ALREADY_EXISTS)
        }
        
        await DatabaseFunctions.update({
            tableName: 'apis',
            data: {
                apiName: apiName,
                apiRoute: apiRoute,
                apiMethod: apiMethod,
                apiAuthorization: apiAuthorization,
                apiDescription: apiDescription,
            },
            targets: [
                {
                    targetColumn: 'apiId',
                    targetValue: api_id
                }
            ]
        })
    }
    
    export async function deleteApi(api_id: string, token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const api = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiId: api_id,
                apiIsDeleted: false
            }
        })
        if (!api) {
            throw new Exception.HttpException(404, 'Api not found', Exception.Errors.API_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: api.apiProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        await DatabaseFunctions.update({
            tableName: 'apis',
            data: {
                apiIsDeleted: true
            },
            targets: [
                {
                    targetColumn: 'apiId',
                    targetValue: api_id
                }
            ]
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
        
        // const response = await DatabaseFunctions.insert({
        //     tableName: 'responses',
        //     data: {
        //         responseStatus: response_status,
        //         responseStatusCode: response_status_code,
        //         responseDescription: response_description,
        //         responseApiId: api_id,
        //         responseOwnerId: userId,
        //     }
        // })
        
        // for (const key of response_keys) {
        //     await DatabaseFunctions.insert({
        //         tableName: 'responseKeys',
        //         data: {
        //             rkName: key.key_name,
        //             rkTypes: key.key_types,
        //             rkMockData: key.key_mock_data,
        //             rkDescription: key.key_description,
        //             rkOwnerId: userId,
        //             rkResponseId: response.responseId,
        //         }
        //     })
        // }
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
        
        // const payload = await DatabaseFunctions.insert({
        //     tableName: 'payloads',
        //     data: {
        //         payloadType: payload_type,
        //         payloadDescription: payload_description,
        //         payloadOwnerId: userId,
        //         payloadApiId: api_id,
        //     }
        // })
        
        // for (const key of payload_keys) {
        //     await DatabaseFunctions.insert({
        //         tableName: 'payloadKeys',
        //         data: {
        //             pkName: key.key_name,
        //             pkTypes: key.key_types,
        //             pkMockData: key.key_mock_data,
        //             pkDescription: key.key_description,
        //             pkOwnerId: userId,
        //             pkPayloadId: payload.payloadId,
        //         }
        //     })
        // }
    }
    
}

export default ApisModel