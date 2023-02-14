import { MessageBar } from "@fluentui/react";
import { Button, Dropdown, DropdownProps, Input, InputProps, Label, mergeClasses, Option, Spinner, Text, Title2, useId } from "@fluentui/react-components";
import React, { useState } from "react";
import { useStyles } from "../../commons/Styles";
import { StepProps } from "./StepProps";

export const Step: React.FunctionComponent<StepProps> = (props) => {
  // Styles
  const classes = useStyles();

  // Stateful values
  const [loading, isLoading] = useState(false);
  const [validationError, showValidationError] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([props.defaultSelectedOption?.value || ""]);
  const [value, setValue] = useState(props.defaultSelectedOption?.value || "");

  // Component IDs
  const dropdownId = useId("step-dropdown");
  const inputId = useId("step-input");

  // Handler functions
  function _onClick(): void {
    if (value.length > 0) {
      showValidationError(false);
      isLoading(true);

      props.actionButton!.onClick!(value).finally(() => isLoading(false));
    } else {
      showValidationError(true);
    }
  }

  const onChange: InputProps["onChange"] = (event, data) => {
    setValue(data.value);
    props.onChange!();
  }

  const onOptionSelect: DropdownProps["onOptionSelect"] = (event, data) => {
    setSelectedOptions(data.selectedOptions);
    setValue(data.optionValue!);
    props.onChange!();
  }

  // Dynamic components
  let spinner = loading ? <>
    <Spinner size="tiny" />
  </> : undefined;

  let description = typeof props.description === "string" ? <>
    <Text>{props.description}</Text>
  </> : props.description;

  let messageBar = props.infoMessage ? <>
    <MessageBar>{props.infoMessage}</MessageBar>
  </> : undefined;

  let dropdownStack = (props.options && props.options!.length > 0) ? <>
    <div className={mergeClasses(classes.flexRow, classes.leftGap)}>
      <div className={classes.flexColumn}>
        <Label htmlFor={dropdownId} className={classes.errorText}>
          {validationError ? props.errorMessages?.dropdown : undefined}
        </Label>
        <Dropdown
          className={validationError ? classes.errorFormField : undefined}
          id={dropdownId}
          selectedOptions={selectedOptions}
          defaultSelectedOptions={[props.defaultSelectedOption!.value]}
          defaultValue={props.defaultSelectedOption!.text}
          onOptionSelect={onOptionSelect}
        >
          {props.options.map(option => {
            return <React.Fragment key={option.value}>
              <Option value={option.value} title={option.title} disabled={option.disabled}>{option.text}</Option>
            </React.Fragment>
          })}
        </Dropdown>
      </div>
    </div>
  </> : undefined;

  let textField = props.errorMessages?.textfield ? <>
    <Text className={classes.verticallyAligned}>or</Text>
    <div className={classes.flexColumn}>
      <Label htmlFor={inputId} className={classes.errorText}>
        {validationError ? props.errorMessages.textfield : undefined}
      </Label>
      <Input
        className={validationError ? mergeClasses(classes.errorFormField, classes.twentyEmWide) : classes.twentyEmWide}
        id={inputId}
        placeholder={props.placeholder}
        onChange={onChange}
      />
    </div>
  </> : undefined;

  let dataInputStack = <>
    <div className={mergeClasses(classes.flexRow, classes.leftGap)}>
      {dropdownStack}
      {textField}
    </div>
  </>;

  let buttons = props.actionButton ? <>
    <Button appearance="primary" onClick={_onClick} disabled={loading}>{props.actionButton.text}</Button>
  </> : props.linkButtons ? props.linkButtons!.map((button) =>
    <React.Fragment key={button.text}>
      <Button appearance="primary" onClick={() => window.open(button.url)}>{button.text}</Button>
    </React.Fragment>
  ) : undefined;

  let buttonsStack = <>
    <div className={props.actionButton ?
        mergeClasses(classes.flexRow, classes.leftGap) :
        mergeClasses(classes.flexColumn, classes.topGap)
      }>
      {buttons}
      {spinner}
    </div>
  </>;

  return (
    <div className={mergeClasses(classes.flexColumn, classes.topGap)}>
      <Title2>{props.title}</Title2>
      {description}
      {messageBar}
      {dataInputStack}
      {buttonsStack}
    </div>
  );
}