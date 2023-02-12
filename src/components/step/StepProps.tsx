import { ReactElement } from "react";

export type StepProps = {
    title: string;
    description?: string | ReactElement<Text>;
    options?: { value: string, text: string, title?: string, disabled?: boolean }[];
    defaultSelectedOption?: { value: string, text: string, title?: string, disabled?: boolean };
    placeholder?: string;
    onChange?: Function;
    infoMessage?: string;
    errorMessages?: { dropdown?: string, textfield?: string };
    actionButton?: { text: string, onClick: Function };
    linkButtons?: { text: string, url: string }[];
};