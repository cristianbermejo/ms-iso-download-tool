import { ITextComponent, IDropdownOption } from "@fluentui/react";
import { ReactElement } from "react";

export type StepProps = {
    title: string;
    description?: string | ReactElement<ITextComponent>;
    options?: IDropdownOption<string>[];
    defaultSelectedKey?: string;
    onChange?: Function;
    errorMessage?: string;
    actionButton?: { text: string, onClick: Function };
    linkButtons?: { text: string, url: string }[];
};