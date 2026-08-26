export interface CreateSubscriber {
    name: string
    destinationNumber: string
    status?: string
    listId: string
}



export interface UpdateSubscriber {
    name: string
    destinationNumber: string
    status?: string
    listId: string
    subscriberId: string
}

export interface DeleteRequest {
    subscriberId: string 
    subscriberName: string 
    audienceId: string

}