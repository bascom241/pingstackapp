import { useEffect, useMemo, useState } from "react";
import {
    X,
    Mail,
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
} from "../icons";

interface CreateEmailTemplateModalProps {
    open: boolean;
    isCreating?: boolean;
    onClose: () => void;
    onCreate: (data: {
        name: string;
        slug: string;
        category: "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";
        description: string;
        subject: string;
    }) => void;
}

type Category = "TRANSACTIONAL" | "MARKETING" | "LIFECYCLE";

const categories: {
    value: Category;
    title: string;
    description: string;
}[] = [
    {
        value: "TRANSACTIONAL",
        title: "Transactional",
        description: "Login, receipts, alerts and notifications.",
    },
    {
        value: "MARKETING",
        title: "Marketing",
        description: "Promotions, announcements and campaigns.",
    },
    {
        value: "LIFECYCLE",
        title: "Lifecycle",
        description: "Onboarding, engagement and user journeys.",
    },
];

const CreateEmailTemplateModal = ({
    open,
    isCreating = false,
    onClose,
    onCreate,
}: CreateEmailTemplateModalProps) => {
    const [step, setStep] = useState(1);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [category, setCategory] =
        useState<Category>("TRANSACTIONAL");

    useEffect(() => {
        if (!open) {
            setStep(1);
            setName("");
            setDescription("");
            setSubject("");
            setCategory("TRANSACTIONAL");
        }
    }, [open]);

    const createSlug = (value: string) =>
        value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const slug = useMemo(() => createSlug(name), [name]);

    const stepOneValid =
        name.trim().length > 0 &&
        description.trim().length > 0;

    const stepTwoValid = !!category;

    const stepThreeValid = subject.trim().length > 0;

    const canContinue =
        step === 1
            ? stepOneValid
            : step === 2
              ? stepTwoValid
              : stepThreeValid;

    const handleNext = () => {
        if (!canContinue) return;

        if (step < 3) {
            setStep((current) => current + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((current) => current - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!stepThreeValid || isCreating) return;

        onCreate({
            name: name.trim(),
            slug,
            description: description.trim(),
            subject: subject.trim(),
            category,
        });
    };

    if (!open) return null;

    const selectedCategory = categories.find(
        (item) => item.value === category
    );

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
            <div
                className="
                    flex
                    h-dvh
                    w-full
                    flex-col
                    bg-white

                    sm:absolute
                    sm:left-1/2
                    sm:top-1/2
                    sm:h-auto
                    sm:max-h-[90vh]
                    sm:w-[calc(100%-2rem)]
                    sm:max-w-xl
                    sm:-translate-x-1/2
                    sm:-translate-y-1/2
                    sm:rounded-2xl
                    sm:shadow-2xl
                "
            >
                {/* HEADER */}
                <header
                    className="
                        shrink-0
                        border-b
                        border-gray-100
                        bg-white
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            px-4
                            py-4
                            sm:px-6
                            sm:py-5
                        "
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                "
                            >
                                <Mail
                                    size={19}
                                    className="text-[#004aad]"
                                />
                            </div>

                            <div className="min-w-0">
                                <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                                    Create an email
                                </h2>

                                <p className="mt-0.5 truncate text-sm text-gray-500">
                                    Set up your email template
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isCreating}
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-gray-500
                                transition
                                hover:bg-gray-100
                                hover:text-gray-700
                                disabled:opacity-50
                            "
                        >
                            <X size={19} />
                        </button>
                    </div>

                    {/* PROGRESS */}
                    <div className="px-4 pb-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            {/* STEP 1 */}
                            <div
                                className={`
                                    h-1.5
                                    flex-1
                                    rounded-full
                                    ${
                                        step >= 1
                                            ? "bg-[#004aad]"
                                            : "bg-gray-200"
                                    }
                                `}
                            />

                            {/* STEP 2 */}
                            <div
                                className={`
                                    h-1.5
                                    flex-1
                                    rounded-full
                                    ${
                                        step >= 2
                                            ? "bg-[#004aad]"
                                            : "bg-gray-200"
                                    }
                                `}
                            />

                            {/* STEP 3 */}
                            <div
                                className={`
                                    h-1.5
                                    flex-1
                                    rounded-full
                                    ${
                                        step >= 3
                                            ? "bg-[#004aad]"
                                            : "bg-gray-200"
                                    }
                                `}
                            />
                        </div>

                        <div className="mt-2 flex justify-between">
                            <span
                                className={`
                                    text-xs font-semibold
                                    ${
                                        step === 1
                                            ? "text-[#004aad]"
                                            : "text-gray-500"
                                    }
                                `}
                            >
                                Basics
                            </span>

                            <span
                                className={`
                                    text-xs font-semibold
                                    ${
                                        step === 2
                                            ? "text-[#004aad]"
                                            : "text-gray-500"
                                    }
                                `}
                            >
                                Type
                            </span>

                            <span
                                className={`
                                    text-xs font-semibold
                                    ${
                                        step === 3
                                            ? "text-[#004aad]"
                                            : "text-gray-500"
                                    }
                                `}
                            >
                                Details
                            </span>
                        </div>
                    </div>
                </header>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* SCROLLABLE CONTENT */}
                    <main
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            overscroll-contain
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full
                                max-w-lg
                                px-4
                                py-6
                                sm:px-6
                                sm:py-8
                            "
                        >
                            {/* ================= STEP 1 ================= */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-gray-900">
                                            Basic information
                                        </h3>

                                        <p className="mt-1.5 text-base leading-6 text-gray-500">
                                            Give your email a name and explain
                                            what it will be used for.
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        {/* NAME */}
                                        <div>
                                            <label
                                                htmlFor="template-name"
                                                className="mb-2 block text-base font-semibold text-gray-800"
                                            >
                                                Email name
                                            </label>

                                            <input
                                                id="template-name"
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                placeholder="e.g. Welcome email"
                                                disabled={isCreating}
                                                autoFocus
                                                className="
                                                    block
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-gray-200
                                                    bg-white
                                                    px-4
                                                    py-3.5
                                                    text-base
                                                    text-gray-900
                                                    outline-none
                                                    transition
                                                    placeholder:text-gray-500
                                                    focus:border-[#004aad]
                                                    focus:ring-4
                                                    focus:ring-[#004aad]/10
                                                "
                                            />

                                            <p className="mt-2 text-sm leading-5 text-gray-500">
                                                Choose a recognizable name for
                                                your team.
                                            </p>
                                        </div>

                                        {/* DESCRIPTION */}
                                        <div>
                                            <label
                                                htmlFor="template-description"
                                                className="mb-2 block text-base font-semibold text-gray-800"
                                            >
                                                What is this email for?
                                            </label>

                                            <textarea
                                                id="template-description"
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g. Sent to new users after they create an account."
                                                rows={5}
                                                disabled={isCreating}
                                                className="
                                                    block
                                                    w-full
                                                    resize-none
                                                    rounded-xl
                                                    border
                                                    border-gray-200
                                                    bg-white
                                                    px-4
                                                    py-3.5
                                                    text-base
                                                    leading-6
                                                    text-gray-900
                                                    outline-none
                                                    transition
                                                    placeholder:text-gray-500
                                                    focus:border-[#004aad]
                                                    focus:ring-4
                                                    focus:ring-[#004aad]/10
                                                "
                                            />

                                            <p className="mt-2 text-sm leading-5 text-gray-500">
                                                Describe when or why this
                                                template should be used.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ================= STEP 2 ================= */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-gray-900">
                                            Choose an email type
                                        </h3>

                                        <p className="mt-1.5 text-base leading-6 text-gray-500">
                                            This helps organize your templates
                                            and identify how they are used.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {categories.map((item) => {
                                            const selected =
                                                category === item.value;

                                            return (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    disabled={isCreating}
                                                    onClick={() =>
                                                        setCategory(
                                                            item.value
                                                        )
                                                    }
                                                    className={`
                                                        flex
                                                        w-full
                                                        items-start
                                                        gap-3
                                                        rounded-2xl
                                                        border
                                                        p-4
                                                        text-left
                                                        transition-all
                                                        active:scale-[0.99]
                                                        ${
                                                            selected
                                                                ? "border-[#004aad] bg-blue-50/70 ring-2 ring-[#004aad]/10"
                                                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                                        }
                                                    `}
                                                >
                                                    <div
                                                        className={`
                                                            mt-0.5
                                                            flex
                                                            h-5
                                                            w-5
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            ${
                                                                selected
                                                                    ? "border-[#004aad] bg-[#004aad]"
                                                                    : "border-gray-300"
                                                            }
                                                        `}
                                                    >
                                                        {selected && (
                                                            <Check
                                                                size={12}
                                                                className="text-white"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p
                                                            className={`
                                                                text-base
                                                                font-bold
                                                                ${
                                                                    selected
                                                                        ? "text-[#004aad]"
                                                                        : "text-gray-900"
                                                                }
                                                            `}
                                                        >
                                                            {item.title}
                                                        </p>

                                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ================= STEP 3 ================= */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-gray-900">
                                            Email details
                                        </h3>

                                        <p className="mt-1.5 text-base leading-6 text-gray-500">
                                            Set the subject recipients will see
                                            in their inbox.
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="template-subject"
                                            className="mb-2 block text-base font-semibold text-gray-800"
                                        >
                                            Email subject
                                        </label>

                                        <input
                                            id="template-subject"
                                            type="text"
                                            value={subject}
                                            onChange={(e) =>
                                                setSubject(e.target.value)
                                            }
                                            placeholder="e.g. Welcome to our platform"
                                            disabled={isCreating}
                                            autoFocus
                                            className="
                                                block
                                                w-full
                                                rounded-xl
                                                border
                                                border-gray-200
                                                bg-white
                                                px-4
                                                py-3.5
                                                text-base
                                                text-gray-900
                                                outline-none
                                                transition
                                                placeholder:text-gray-500
                                                focus:border-[#004aad]
                                                focus:ring-4
                                                focus:ring-[#004aad]/10
                                            "
                                        />

                                        <p className="mt-2 text-sm leading-5 text-gray-500">
                                            This is what recipients will see
                                            before opening the email.
                                        </p>
                                    </div>

                                    {/* SUMMARY */}
                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                        <div className="mb-4 flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                                                <Check
                                                    size={14}
                                                    className="text-[#004aad]"
                                                />
                                            </div>

                                            <p className="text-base font-bold text-gray-900">
                                                Ready to create
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Name
                                                </p>

                                                <p className="mt-0.5 break-words text-base font-medium text-gray-800">
                                                    {name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Type
                                                </p>

                                                <p className="mt-0.5 text-base font-medium text-gray-800">
                                                    {selectedCategory?.title}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Subject
                                                </p>

                                                <p className="mt-0.5 break-words text-base font-medium text-gray-800">
                                                    {subject}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* FOOTER */}
                    <footer
                        className="
                            shrink-0
                            border-t
                            border-gray-100
                            bg-white
                            px-4
                            py-3
                            pb-[max(0.75rem,env(safe-area-inset-bottom))]
                            sm:px-6
                            sm:py-4
                        "
                    >
                        <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3">
                            {/* BACK */}
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={step === 1 || isCreating}
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    gap-1.5
                                    rounded-xl
                                    px-3
                                    text-base
                                    font-semibold
                                    text-gray-600
                                    transition
                                    hover:bg-gray-50
                                    hover:text-gray-900
                                    disabled:invisible
                                "
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>

                            {/* MOBILE STEP COUNT */}
                            <span className="text-sm font-medium text-gray-500 sm:hidden">
                                Step {step} of 3
                            </span>

                            {/* CONTINUE */}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={
                                        !canContinue || isCreating
                                    }
                                    className="
                                        inline-flex
                                        h-10
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-[#004aad]
                                        px-5
                                        text-base
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#003985]
                                        active:scale-[0.98]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Continue
                                    <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={
                                        !canContinue || isCreating
                                    }
                                    className="
                                        inline-flex
                                        h-10
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-[#004aad]
                                        px-5
                                        text-base
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#003985]
                                        active:scale-[0.98]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create email
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CreateEmailTemplateModal;