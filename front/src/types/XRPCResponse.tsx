export type XRPCResponse = {
    data : {
        cursor: string,
        feed: [],
    }
    
    headers: {
        'content-length': string, 
        'content-type': string
    },
    success: boolean,
}