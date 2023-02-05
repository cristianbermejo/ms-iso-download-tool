import { Dropdown, FontSizes, FontWeights, IDropdown, IStackTokens, ITextStyles, PrimaryButton, Spinner, Stack, Text } from "@fluentui/react";
import React, { useState } from "react";
import { StepProps } from "./StepProps";

export const Step: React.FunctionComponent<StepProps> = (props) => {
  // Styles
  const xxLargeTextStyles: Partial<ITextStyles> = { root: { fontSize: FontSizes.xxLarge, fontWeight: FontWeights.semibold } };

  // Tokens
  const tokens: Partial<IStackTokens> = { childrenGap: 15 };

  // Stateful variables
  let [loading, isLoading] = useState(false);
  let [validationError, showValidationError] = useState(false);

  // Component references
  let dropdownRef = React.createRef<IDropdown>();

  // Handler functions
  function _onClick(): void {
    if (dropdownRef.current?.selectedOptions[0].key === props.defaultSelectedKey) {
      showValidationError(true);
    } else {
      isLoading(true);
      props.actionButton!.onClick!(dropdownRef.current?.selectedOptions[0].key)
        .finally(() => isLoading(false));
    }
  }

  // Dynamic components
  let spinner = loading ? <>
    <Spinner />
  </> : undefined;
  let description = typeof props.description === "string" ? <>
    <Text>{props.description}</Text>
  </> : props.description;
  let dropdownStack = (props.options && props.options!.length > 0) ? <>
    <Stack horizontal tokens={tokens}>
      <Dropdown
        options={props.options!}
        defaultSelectedKey={props.defaultSelectedKey}
        dropdownWidth="auto"
        onChange={() => props.onChange!()}
        errorMessage={validationError ? props.errorMessage : undefined}
        componentRef={dropdownRef}
      />
      {spinner}
    </Stack>
  </> : undefined;
  let buttons = props.actionButton ? <>
    <PrimaryButton text={props.actionButton.text} onClick={_onClick} disabled={loading} />
  </> : props.linkButtons ? props.linkButtons!.map((button) =>
    <React.Fragment key={button.text}>
      <PrimaryButton text={button.text} onClick={() => window.open(button.url)} />
    </React.Fragment>
  ) : undefined;

  return (
    <Stack tokens={tokens} horizontalAlign="start">
      <Text styles={xxLargeTextStyles}>{props.title}</Text>
      {description}
      {dropdownStack}
      {buttons}
    </Stack>
  );
}