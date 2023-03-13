import { Button, Dropdown, DropdownProps, Input, InputProps, Label, mergeClasses, Option, Spinner, Text, useId } from "@fluentui/react-components";
import React from "react";
import { useState } from "react";
import { useCommonStyles } from "../../commons/styles/CommonStyles";
import { Options } from "./Edition.options";
import { EditionProps } from "./Edition.props";
import { useStyles } from "./Edition.styles";

export const Edition: React.FunctionComponent<EditionProps> = (props) => {
  // Styles
  const commonClasses = useCommonStyles();
  const classes = useStyles();
  const verticalStackWithChildrenGap = mergeClasses(commonClasses.verticalStack, commonClasses.verticalChildrenGap);
  const horizontalStackWithChildrenGap = mergeClasses(commonClasses.horizontalStack, commonClasses.horizontalChildrenGap);

  // IDs
  const dropdownId = useId();
  const inputId = useId();

  // Stateful values
  const [selectedOptions, setSelectedOptions] = useState([""]);
  const [value, setValue] = useState("");
  const [isProductKey, setProductKey] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);

  // Private functions
  const onOptionSelect: DropdownProps["onOptionSelect"] = (event, data) => {
    setSelectedOptions(data.selectedOptions);
    setValue(data.optionValue || "");
    setProductKey(false);

    props.onValueChange();
  };
  const onChange: InputProps["onChange"] = (ev, data) => {
    setValue(data.value);
    setProductKey(true);

    props.onValueChange();
  };
  const onClick = () => {
    if (value.length > 0) {
      setError(false);
      setLoading(true);

      props.onClick(value, isProductKey).finally(() => setLoading(false));
    } else {
      setError(true);
    }
  };

  return (
    <div className={verticalStackWithChildrenGap}>
      <Text>This option is for users that want to create a bootable installation media (USB flash drive, DVD) or create a virtual machine (.ISO file) to install Windows. This download is a multi-edition ISO which uses your product key to unlock the correct edition.</Text>
      <div className={horizontalStackWithChildrenGap}>
        <div className={commonClasses.verticalStack}>
          <Label htmlFor={dropdownId} className={commonClasses.errorText}>{hasError && "Select an edition from the drop down menu."}</Label>
          <Dropdown id={dropdownId}
            selectedOptions={selectedOptions}
            defaultSelectedOptions={[""]}
            defaultValue="Select Download"
            onOptionSelect={onOptionSelect}
            positioning="after"
          >
            {Options.map(option => {
              return (
                <React.Fragment key={option.value}>
                  <Option value={option.value} title={option.title} disabled={option.disabled}>{option.text}</Option>
                </React.Fragment>
              )
            })}
          </Dropdown>
        </div>
        <Text className={classes.verticallyAligned}>or</Text>
        <div className={commonClasses.verticalStack}>
          <Label htmlFor={inputId} className={commonClasses.errorText}>{hasError && "Your license key must contain 25 letters and numbers and no special characters: ()[].-#*/"}</Label>
          <Input
            className={classes.productKeyInput}
            id={inputId}
            placeholder="Enter product key"
            maxLength={29}
            onChange={onChange}
          />
        </div>
      </div>
      <div className={horizontalStackWithChildrenGap}>
        <Button appearance="primary" onClick={onClick} disabled={isLoading}>Download</Button>
        {isLoading && <Spinner size="tiny" />}
      </div>
    </div>
  );
};