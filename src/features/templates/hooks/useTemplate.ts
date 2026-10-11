import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getTemplates,
    getSingleTemplate,
    createTemplate,
    updateTemplate,
} from "../api/templateService";

export const TEMPLATE_KEY = ["email-templates"];

export const useGetTemplateForUser = () => {
    return useQuery({
        queryKey: TEMPLATE_KEY,
        queryFn: getTemplates,
    });
};

export const useGetSingleTemplate = (id: string) => {
    return useQuery({
        queryKey: [...TEMPLATE_KEY, "single", id],
        queryFn: () => getSingleTemplate(id),
        enabled: Boolean(id),
    });
};
export const useCreateTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTemplate,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TEMPLATE_KEY,
            });
        },
    });
};

export const useUpdateTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            templateId,
            data,
        }: {
            templateId: string;
            data: {
                designJson: string;
                subject: string;
                htmlContent: string;
            };
        }) => updateTemplate(templateId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [...TEMPLATE_KEY, "single", variables.templateId],
            });

            queryClient.invalidateQueries({
                queryKey: TEMPLATE_KEY,
            });
        },
    });
};