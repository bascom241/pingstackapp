import EmailEditor from "react-email-editor";
import { useRef, useState, useEffect } from "react";

interface EmailTemplateEditorProps {
    initialData: any;
    onSave: (design: any, html: string) => void;
}

const EmailTemplateEditor = ({ initialData, onSave }: EmailTemplateEditorProps) => {
    const emailEditorRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    const onReady = () => {
        setIsReady(true);
    };

    useEffect(() => {
        // Fix: Access designJson directly from root level of initialData
        if (isReady && initialData?.designJson && emailEditorRef.current) {
            try {
                const parsedDesign = JSON.parse(initialData.designJson);
                emailEditorRef.current.editor.loadDesign(parsedDesign);
            } catch (e) {
                console.error("Failed to parse designJson:", e);
            }
        }
    }, [isReady, initialData]);

    const handleExport = () => {
        emailEditorRef.current?.editor.exportHtml((data: any) => {
            const { design, html } = data;
            onSave(design, html);
        });
    };

    return (
        <div className="flex flex-col gap-2">

            <div className="flex items-end">
                <button onClick={handleExport} className="mb-4 bg-[#004aad] text-white p-2 rounded mt-4 flex items-end">
                    Save Template
                </button>
            </div>

            <EmailEditor
                ref={emailEditorRef}
                onReady={onReady}
                minHeight="600px"
            />


        </div>
    );
};

export default EmailTemplateEditor;