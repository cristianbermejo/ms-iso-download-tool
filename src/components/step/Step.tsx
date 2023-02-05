import { Dropdown, FontSizes, FontWeights, IDropdown, IStackTokens, ITextField, ITextFieldStyles, ITextStyles, MessageBar, PrimaryButton, Spinner, Stack, Text, TextField } from "@fluentui/react";
import React, { useState } from "react";
import { StepProps } from "./StepProps";

export const Step: React.FunctionComponent<StepProps> = (props) => {
  // Styles
  const xxLargeTextStyles: Partial<ITextStyles> = { root: { fontSize: FontSizes.xxLarge, fontWeight: FontWeights.semibold } };
  const verticallyAlignedTextStyles: Partial<ITextStyles> = { root: { margin: "auto 0" } }
  const textFieldStyles: Partial<ITextFieldStyles> = { root: { width: "20em" } };

  // Tokens
  const tokens: Partial<IStackTokens> = { childrenGap: 15 };

  // Stateful variables
  let [loading, isLoading] = useState(false);
  let [validationError, showValidationError] = useState(false);

  // Component references
  let dropdownRef = React.createRef<IDropdown>();
  let textFieldRef = React.createRef<ITextField>();

  // Handler functions
  function _onClick(): void {
    if (textFieldRef.current && textFieldRef.current.value!.length > 0) {
      showValidationError(false);
      isLoading(true);

      props.actionButton!.onClick!(textFieldRef.current?.value)
        .finally(() => isLoading(false));
    } else if (dropdownRef.current && dropdownRef.current.selectedOptions[0].key !== props.defaultSelectedKey) {
      showValidationError(false);
      isLoading(true);

      props.actionButton!.onClick!(dropdownRef.current?.selectedOptions[0].key)
        .finally(() => isLoading(false));
    } else {
      showValidationError(true);
    }
  }

  // Dynamic components
  let spinner = loading ? <>
    <Spinner />
  </> : undefined;

  let description = typeof props.description === "string" ? <>
    <Text>{props.description}</Text>
  </> : props.description;

  let messageBar = props.infoMessage ? <>
    <MessageBar>{props.infoMessage}</MessageBar>
  </> : undefined;

  let dropdownStack = (props.options && props.options!.length > 0) ? <>
    <Stack horizontal tokens={tokens}>
      <Dropdown
        options={props.options!}
        defaultSelectedKey={props.defaultSelectedKey}
        dropdownWidth="auto"
        onChange={() => props.onChange!()}
        errorMessage={validationError ? props.errorMessages?.dropdown : undefined}
        componentRef={dropdownRef}
      />
    </Stack>
  </> : undefined;

  let textField = props.errorMessages?.textfield ? <>
    <Text styles={verticallyAlignedTextStyles}>or</Text>
    <TextField
      placeholder={props.placeholder}
      styles={textFieldStyles}
      onChange={() => props.onChange!()}
      errorMessage={validationError ? props.errorMessages.textfield : undefined}
      componentRef={textFieldRef}
    />
  </> : undefined;

  let dataInputStack = <>
    <Stack horizontal tokens={tokens}>
      {dropdownStack}
      {textField}
    </Stack>
  </>;

  let buttons = props.actionButton ? <>
    <PrimaryButton text={props.actionButton.text} onClick={_onClick} disabled={loading} />
  </> : props.linkButtons ? props.linkButtons!.map((button) =>
    <React.Fragment key={button.text}>
      <PrimaryButton text={button.text} onClick={() => window.open(button.url)} />
    </React.Fragment>
  ) : undefined;

  let buttonsStack = <>
    <Stack horizontal={props.actionButton !== undefined} tokens={tokens}>
      {buttons}
      {spinner}
    </Stack>
  </>;

  return (
    <Stack tokens={tokens} horizontalAlign="start">
      <Text styles={xxLargeTextStyles}>{props.title}</Text>
      {description}
      {messageBar}
      {dataInputStack}
      {buttonsStack}
    </Stack>
  );
}