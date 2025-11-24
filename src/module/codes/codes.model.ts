import DatabaseFunctions from '@database/functions.database'
import CodesInterface from '@interface/codes.interface'
import Exception from '@lib/http_exception.lib'
import CodesQuery from '@query/codes.query'
import FinderLib from '@lib/finder.lib'

namespace CodesModel {
    
    export async function getCodes(query: CodesInterface.IGetCodesQuery, token: string) {
        const {
            limit,
            page,
            project_id
        } = query
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const project = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: project_id,
                projectIsDeleted: false
            }
        });
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }
        
        const checkProjectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: project_id,
                puUserId: userId
            }
        })
        if (!checkProjectUser) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        const result = await CodesQuery.getCodes({
            projectId: project_id,
            limit: limit,
            page: page
        })
        const totalPages = Math.ceil(result.count / limit);

        return {
            total_page: totalPages,
            current_page: page,
            data: result.data
        }
    }
    
    export async function getCodeById(code_id: string, token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const code = await DatabaseFunctions.select({
            tableName: 'codes',
            filter: {
                codeId: code_id,
                codeIsDeleted: false
            }
        });
        if (!code) {
            throw new Exception.HttpException(404, 'Code not found', Exception.Errors.CODE_NOT_FOUND)
        }
        
        const checkProjectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: code.codeProjectId,
                puUserId: userId
            }
        })
        if (!checkProjectUser) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }

        return await CodesQuery.getCodeById(code_id)
    }
    
    export async function createCode(body: CodesInterface.ICreateCodeBody, token: string) {
        const {
            project_id,
            code_value,
            code_description
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const project = await DatabaseFunctions.select({
            tableName: 'projects',
            filter: {
                projectId: project_id,
                projectIsDeleted: false
            }
        });
        if (!project) {
            throw new Exception.HttpException(404, 'Project not found', Exception.Errors.PROJECT_NOT_FOUND)
        }
        
        const checkProjectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: project_id,
                puUserId: userId
            }
        })
        if (!checkProjectUser) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        const checkCode = await DatabaseFunctions.select({
            tableName: 'codes',
            filter: {
                codeValue: code_value
            }
        })
        if (checkCode) {
            throw new Exception.HttpException(409, 'Code already exists', Exception.Errors.CODE_ALREADY_EXISTS)
        }

        await DatabaseFunctions.insert({
            tableName: 'codes',
            data: {
                codeValue: code_value,
                codeDescription: code_description,
                codeProjectId: project_id,
                codeUserId: userId
            }
        })
    }
    
    export async function updateCode(body: CodesInterface.IUpdateCodeBody, code_id: string, token: string) {
        const {
            code_value,
            code_description
        } = body
        
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const code = await DatabaseFunctions.select({
            tableName: 'codes',
            filter: {
                codeId: code_id,
                codeIsDeleted: false
            }
        });
        if (!code) {
            throw new Exception.HttpException(404, 'Code not found', Exception.Errors.CODE_NOT_FOUND)
        }
        
        const codeValue = code_value ? code_value : code.codeValue
        const codeDescription = code_description ? code_description : code.codeDescription
        
        const checkCodeValue = await DatabaseFunctions.select({
            tableName: 'codes',
            filter: {
                codeValue: codeValue
            }
        });
        if (checkCodeValue && checkCodeValue.codeId !== code_id) {
            throw new Exception.HttpException(409, 'Code value already exists', Exception.Errors.CODE_ALREADY_EXISTS)
        }

        await DatabaseFunctions.update({
            tableName: 'codes',
            data: {
                codeValue: codeValue,
                codeDescription: codeDescription,
            },
            targets: [
                {
                    targetColumn: 'codeId',
                    targetValue: code_id
                }
            ]
        })
    }
    
    export async function deleteCode(code_id: string, token: string) {
        const userId = await FinderLib.findUser(token)
        if (userId === 'ERROR') {
            throw new Exception.HttpException(401, 'Authorization error', Exception.Errors.AUTHORIZATION_ERROR)
        }
        
        const code = await DatabaseFunctions.select({
            tableName: 'codes',
            filter: {
                codeId: code_id,
                codeIsDeleted: false
            }
        })
        if (!code) {
            throw new Exception.HttpException(404, 'Code not found', Exception.Errors.CODE_NOT_FOUND)
        }
        
        const checkProjectUser = await DatabaseFunctions.select({
            tableName: 'projectUsers',
            filter: {
                puProjectId: code.codeProjectId,
                puUserId: userId
            }
        })
        if (!checkProjectUser) {
            throw new Exception.HttpException(404, 'You are not a project user', Exception.Errors.PROJECT_USER_NOT_FOUND)
        }
        
        await DatabaseFunctions.update({
            tableName: 'codes',
            data: {
                codeIsDeleted: true
            },
            targets: [
                {
                    targetColumn: 'codeId',
                    targetValue: code_id
                }
            ]
        })
    }
    
}

export default CodesModel