import { useParams } from "react-router-dom";
import EmailTemplateEditor from "./EmailTemlateEditor";
import { useGetSingleTemplate } from "../../features/templates/hooks/useTemplate";
const SingleEmailTemplateEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: singleTemplate, isPending: fetchingTemplateData, isError: errorFetchingTemplate } = useGetSingleTemplate((id as string));
  
  console.log("Single Template Data:", singleTemplate);

  const handleSaveTemplate = (design: any, html: string) => {
    const payload = {
      version: {
        subject: singleTemplate?.subject || "Updated Subject",
        htmlContent: html,
        designJson: JSON.stringify(design)
      }
    };

    console.log("Saving payload:", payload);
  };

  if (fetchingTemplateData) return <div>Loading template...</div>;
  if (errorFetchingTemplate) return <div>Error loading template.</div>;

  return (
    <div>
      <EmailTemplateEditor 
        initialData={singleTemplate} 
        onSave={handleSaveTemplate} 
      />
    </div>
  );
};

export default SingleEmailTemplateEdit;

