import type{ UpdateDomainRequest, BrevoDomainDto } from "../../../../types/email/EmailConfigDto";
import { axiosInstance } from "../../../../api/axios";



export const createDomain = async (data: UpdateDomainRequest): Promise<BrevoDomainDto> => {
    const res = await axiosInstance.post("/email-config/register", data); 
    return res.data;
}

export const getAllDomains = async (): Promise<BrevoDomainDto []> => {
    const res = await axiosInstance.get("/email-config/domain"); 
    return res.data; 
}
export const getSingleDomain = async (domainId: string | undefined   ):  Promise<BrevoDomainDto>  => { 
    const response = await axiosInstance.get(`email-config/domain/${domainId}`);
    return response.data; 

}

export const makePrimary = async (domainId:string ): Promise<BrevoDomainDto>=> {
    console.log(domainId)
    const response = await axiosInstance.put(`email-config/domain/${domainId}`)
    return response.data;
}

export const deleteDomain = async (domainId: string): Promise<void> => {
  await axiosInstance.delete(`/email-config/domain/${domainId}`);
};