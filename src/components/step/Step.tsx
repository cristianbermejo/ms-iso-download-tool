import { Dropdown, IDropdown, IDropdownStyles, IStackTokens, PrimaryButton, Spinner, Stack, Text } from "@fluentui/react";
import React, { useState } from "react";
import { StepProps } from "./StepProps";

export const Step: React.FunctionComponent<StepProps> = (props, ref) => {
  // Styles
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: {
      width: "25em"
    }
  }

  // Tokens
  const tokens: Partial<IStackTokens> = { childrenGap: 15 };

  // Component references
  let dropdownRef = React.createRef<IDropdown>();

  // Stateful variables
  let [loading, isLoading] = useState(false);
  let [validationError, showValidationError] = useState(false);

  // Handler functions
  function onClick(): void {
    if (dropdownRef.current?.selectedOptions[0].key === props.defaultSelectedKey) {
      showValidationError(true);
    } else {
      isLoading(true);
      props.actionButton!.onClick!(dropdownRef.current?.selectedOptions[0].key)
        .finally(() => isLoading(false));
    }
  }

  // Elements with conditional rendering
  let spinner = loading ? <Spinner /> : undefined;
  let description = typeof props.description === "string" ? <Text>{props.description}</Text> : props.description;
  let dropdownStack = (props.options && props.options!.length > 0) ?
    <Stack horizontal tokens={tokens}>
      <Dropdown
        componentRef={dropdownRef}
        styles={dropdownStyles}
        options={props.options!}
        defaultSelectedKey={props.defaultSelectedKey}
        onChange={() => props.onChange!()}
        errorMessage={validationError ? props.errorMessage : undefined}
      />
      {spinner}
    </Stack> : undefined;
  let buttons = props.actionButton ?
    <PrimaryButton text={props.actionButton.text} onClick={onClick} disabled={loading} /> :
    props.linkButtons ? props.linkButtons!.map((button) =>
      <React.Fragment key={button.text}>
        <PrimaryButton text={button.text} onClick={() => window.open(button.url)} />
      </React.Fragment>
    ) : undefined;

  return (
    <Stack tokens={tokens} horizontalAlign="start" itemRef={ref}>
      <Text variant="xxLarge">{props.title}</Text>
      {description}
      {dropdownStack}
      {buttons}
    </Stack>
  );
}