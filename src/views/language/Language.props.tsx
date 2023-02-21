export declare type LanguageProps = {
    infoMessage?: string;
    options: { value: string; text: string; }[];
    onValueChange: () => void;
    onClick: (value: string) => Promise<void>;
};