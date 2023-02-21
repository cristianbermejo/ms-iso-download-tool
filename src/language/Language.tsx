import { Button, Divider, Dropdown, DropdownProps, Label, mergeClasses, Option, Spinner, Text, Title2, useId } from "@fluentui/react-components";
import React from "react";
import { useState } from "react";
import { useCommonStyles } from "../commons/CommonStyles";
import { LanguageProps } from "./Language.props";

export const Language: React.FunctionComponent<LanguageProps> = (props) => {
  // Styles
  const commonClasses = useCommonStyles();
  const verticalStackWithChildrenGap = mergeClasses(commonClasses.verticalStack, commonClasses.verticalChildrenGap);
  const horizontalStackWithChildrenGap = mergeClasses(commonClasses.horizontalStack, commonClasses.horizontalChildrenGap);

  // IDs
  const dropdownId = useId();

  // Stateful values
  const [selectedOptions, setSelectedOptions] = useState([""]);
  const [value, setValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState(false);

  // Private functions
  const onOptionSelect: DropdownProps["onOptionSelect"] = (event, data) => {
    setSelectedOptions(data.selectedOptions);
    setValue(data.optionValue || "");

    props.onValueChange();
  };
  const onClick = () => {
    if (value.length > 0) {
      setError(false);
      setLoading(true);

      props.onClick(value).finally(() => setLoading(false));
    } else {
      setError(true);
    }
  };

  return (
    <>
      {props.options.length > 0 &&
        <div className={verticalStackWithChildrenGap}>
          <Divider />
          <Title2>Select the product language</Title2>
          <Text>
            <Text>You'll need to choose the same language when you install Windows. To see what language you're currently using, go to </Text>
            <Text weight="bold">Time and language</Text>
            <Text> in PC settings or </Text>
            <Text weight="bold">Region</Text>
            <Text> in Control Panel.</Text>
          </Text>
          {props.infoMessage && <Text>{props.infoMessage}</Text>}
          <div className={commonClasses.verticalStack}>
            <Label htmlFor={dropdownId} className={commonClasses.errorText}>{hasError && "Select a language from the drop down menu."}</Label>
            <Dropdown id={dropdownId}
              selectedOptions={selectedOptions}
              defaultSelectedOptions={[""]}
              defaultValue="Choose one"
              onOptionSelect={onOptionSelect}
            >
              {props.options.map(option => {
                return (
                  <React.Fragment key={option.value}>
                    <Option value={option.value}>{option.text}</Option>
                  </React.Fragment>
                )
              })}
            </Dropdown>
          </div>
          <div className={horizontalStackWithChildrenGap}>
            <Button appearance="primary" onClick={onClick} disabled={isLoading}>Confirm</Button>
            {isLoading && <Spinner size="tiny" />}
          </div>
        </div>
      }
    </>
  );
};