import { ITextComponent, IDropdownOption } from "@fluentui/react";
import { ReactElement } from "react";

export type StepProps = {
    title: string;
    description?: string | ReactElement<ITextComponent>;
    options?: IDropdownOption<string>[];
    defaultSelectedKey?: string;
    placeholder?: string;
    onChange?: Function;
    infoMessage?: string;
    errorMessages?: { dropdown?: string, textfield?: string };
    actionButton?: { text: string, onClick: Function };
    linkButtons?: { text: string, url: string }[];
};