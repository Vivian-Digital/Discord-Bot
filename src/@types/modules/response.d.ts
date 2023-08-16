declare module 'utils/response' {
    export type TData = 'Success' | 'Forbidden' | 'ERROR' | 'Access Denied' | object | Array<object>
    
    export interface TRes {
        success: boolean,
        data: TData
    }
}
