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
    
    export async function getApiById(api_id: string, token: string) {
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
        
        return await ApisQuery.getApiById(api_id)
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
                apiUserId: userId,
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

        const apiName = api_name || api.apiName
        const apiRoute = api_route || api.apiRoute
        const apiMethod = api_method || api.apiMethod
        const apiAuthorization = api_authorization || api.apiAuthorization
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

    export async function createApiPayload(body: ApisInterface.ICreateApiPayloadBody, token: string) {
        const {
            api_id,
            payload_type,
            payload_schema,
            payload_description
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const api = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiId: api_id
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
        
        await DatabaseFunctions.insert({
            tableName: 'payloads',
            data: {
                payloadType: payload_type,
                payloadSchema: payload_schema,
                payloadDescription: payload_description,
                payloadApiId: api_id,
                payloadUserId: userId,
                payloadProjectId: api.apiProjectId,
            }
        });
    }

    export async function updateApiPayload(body: ApisInterface.IUpdateApiPayloadBody, payload_id: string, token: string) {
        const {
            payload_type,
            payload_schema,
            payload_description
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const payload = await DatabaseFunctions.select({
            tableName: 'payloads',
            filter: {
                payloadId: payload_id,
                payloadIsDeleted: false
            }
        })
        if (!payload) {
            throw new Exception.HttpException(404, 'Payload not found', Exception.Errors.PAYLOAD_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: payload.payloadProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        const payloadType = payload_type || payload.payloadType
        const payloadSchema = payload_schema || payload.payloadSchema
        const payloadDescription = UsefulfunctionsUtil.isNullableData(payload_description, payload.payloadDescription)
        
        await DatabaseFunctions.update({
            tableName: 'payloads',
            data: {
                payloadType: payloadType,
                payloadSchema: payloadSchema,
                payloadDescription: payloadDescription
            },
            targets: [
                {
                    targetColumn: 'payloadId',
                    targetValue: payload.payloadId
                }
            ]
        });
    }

    export async function deleteApiPayload(payload_id: string, token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const payload = await DatabaseFunctions.select({
            tableName: 'payloads',
            filter: {
                payloadId: payload_id,
                payloadIsDeleted: false
            }
        })
        if (!payload) {
            throw new Exception.HttpException(404, 'Payload not found', Exception.Errors.PAYLOAD_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: payload.payloadProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        await DatabaseFunctions.update({
            tableName: 'payloads',
            data: {
                payloadIsDeleted: true
            },
            targets: [
                {
                    targetColumn: 'payloadId',
                    targetValue: payload.payloadId
                }
            ]
        });
    }
    
    export async function createApiResponse(body: ApisInterface.ICreateApiResponseBody, token: string) {
        const {
            api_id,
            response_type,
            response_schema,
            response_description
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const api = await DatabaseFunctions.select({
            tableName: 'apis',
            filter: {
                apiId: api_id
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
        
        await DatabaseFunctions.insert({
            tableName: 'responses',
            data: {
                responseType: response_type,
                responseSchema: response_schema,
                responseDescription: response_description,
                responseUserId: userId,
                responseApiId: api_id,
                responseProjectId: api.apiProjectId
            }
        })
    }
    
    export async function updateApiResponse(body: ApisInterface.IUpdateApiResponseBody, response_id: string, token: string) {
        const {
            response_type,
            response_schema,
            response_description
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const response = await DatabaseFunctions.select({
            tableName: 'responses',
            filter: {
                responseId: response_id,
                responseIsDeleted: false
            }
        })
        if (!response) {
            throw new Exception.HttpException(404, 'Response not found', Exception.Errors.RESPONSE_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: response.responseProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        const responseType = response_type || response.responseType
        const responseSchema = response_schema || response.responseSchema
        const responseDescription = UsefulfunctionsUtil.isNullableData(response_description, response.responseDescription)
        
        await DatabaseFunctions.update({
            tableName: 'responses',
            data: {
                responseType: responseType,
                responseSchema: responseSchema,
                responseDescription: responseDescription
            },
            targets: [
                {
                    targetColumn: 'responseId',
                    targetValue: response.responseId
                }
            ]
        });
    }

    export async function deleteApiResponse(response_id: string, token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const response = await DatabaseFunctions.select({
            tableName: 'responses',
            filter: {
                responseId: response_id,
                responseIsDeleted: false
            }
        })
        if (!response) {
            throw new Exception.HttpException(404, 'Response not found', Exception.Errors.RESPONSE_NOT_FOUND)
        }
        
        const checkUserProject = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puUserId: userId,
                puProjectId: response.responseProjectId
            }
        })
        if (!checkUserProject) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        await DatabaseFunctions.update({
            tableName: 'responses',
            data: {
                responseIsDeleted: true
            },
            targets: [
                {
                    targetColumn: 'responseId',
                    targetValue: response.responseId
                }
            ]
        });
    }
    
}

export default ApisModel