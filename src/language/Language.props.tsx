export declare type LanguageProps = {
    options: { value: string; text: string; }[];
    onValueChange: () => void;
    onClick: (value: string) => Promise<void>;
};