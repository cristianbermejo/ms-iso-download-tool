import { ITextComponent, IDropdownOption } from "@fluentui/react";
import { ReactElement } from "react";
import { StepButtonProps } from "./StepButtonProps";

export interface StepProps {
    title: string;
    description?: string | ReactElement<ITextComponent>;
    options?: IDropdownOption<string>[];
    defaultSelectedKey?: string;
    onChange?: Function;
    errorMessage?: string;
    actionButton?: StepButtonProps;
    linkButtons?: StepButtonProps[];
};