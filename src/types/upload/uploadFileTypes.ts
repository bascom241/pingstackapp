export interface UploadFileRequest<T extends Record<string, unknown> = {}> { 
    file: File
    fields: T 
}