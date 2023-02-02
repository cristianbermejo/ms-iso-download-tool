import React from 'react';
import { Stack, Text, IStackTokens, IStackStyles, Dropdown, IDropdownOption, IDropdownStyles, initializeIcons, PrimaryButton, IDropdown, Separator, ISeparatorStyles, ITextStyles, Spinner, Dialog, DialogType, IDialogContentProps, DialogFooter, IImageProps, Image } from '@fluentui/react';
import './App.css';
import { useBoolean } from "@fluentui/react-hooks";

const sessionId: string = crypto.randomUUID();

const boldTextStyle: Partial<ITextStyles> = { root: { fontWeight: "bold" } };
const stackTokens: IStackTokens = { childrenGap: 15 };
const stackStyles: Partial<IStackStyles> = {
  root: {
    width: "960px",
    minHeight: "720px",
    margin: "50px auto 0 auto",
  }
};
const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };
const separatorStyles: Partial<ISeparatorStyles> = { root: { width: "100%" } };

const productEditionOptions: IDropdownOption[] = [
  { key: "", text: "Select Download"},
  { key: "2370", text: "Windows 11, version 22H2"},
  { key: "2069", text: "Windows 11, version 21H2"},
  { key: "2377", text: "Windows 10, version 22H2"},
]
const productLanguagesOptions: IDropdownOption[] = [ {key: "", text: "Choose one"} ];

const productEditionDropdownRef = React.createRef<IDropdown>();
const productLanguagesDropdownRef = React.createRef<IDropdown>();

const errorDialogProps: IDialogContentProps = {
  type: DialogType.normal,
  title: "Error"
}

const clearProps: Partial<IImageProps> = {
  src: `https://vlscppe.microsoft.com/fp/clear.png?org_id=y6jn8c31&session_id=${sessionId}`
};


let downloadHeader: string = "";
let errorMessage: string = "";
let downloadLinks: { text: string; url: string; }[] = [];

initializeIcons();

export const App: React.FunctionComponent = () => {
  const [editionSelected, {
    setTrue: setEditionSelectedToTrue,
    setFalse: setEditionSelectedToFalse
  }] = useBoolean(false);
  const [downloadReady, {
    setTrue: downloadIsReady,
    setFalse: downloadIsNotReady
  }] = useBoolean(false);
  const [shouldShowProductEditionError, {
    setTrue: showProductEditionError,
    setFalse: hideProductEditionError
  }] = useBoolean(false);
  const [shouldShowProductLanguagesError, {
    setTrue: showProductLanguagesError,
    setFalse: hideProductLanguagesError
  }] = useBoolean(false);
  const [shouldShowProductEditionSpinner, {
    setTrue: showProductEditionSpinner,
    setFalse: hideProductEditionSpinner
  }] = useBoolean(false);
  const [shouldShowProductLanguagesSpinner, {
    setTrue: showProductLanguagesSpinner,
    setFalse: hideProductLanguagesSpinner
  }] = useBoolean(false);
  const [errorDialogHidden, {
    setTrue: hideErrorDialog,
    setFalse: showErrorDialog
  }] = useBoolean(true);

  let productEditionSpinner = shouldShowProductEditionSpinner ? <Spinner /> : undefined;
  let productLanguagesSpinner = shouldShowProductLanguagesSpinner ? <Spinner /> : undefined;

  let productLanguagesBlock = editionSelected ? <>
    <Separator styles={separatorStyles} />
    <Text variant="xxLarge">Select the product language</Text>
    <Text>
      <Text>You'll need to choose the same language when you install Windows. To see what language you're currently using, go to </Text>
      <Text styles={boldTextStyle}>Time and language</Text>
      <Text> in PC settings or </Text>
      <Text styles={boldTextStyle}>Region</Text>
      <Text> in Control Panel.</Text>
    </Text>
    <Stack horizontal tokens={stackTokens}>
      <Dropdown
          componentRef={productLanguagesDropdownRef}
          defaultSelectedKey={""}
          options={productLanguagesOptions}
          styles={dropdownStyles}
          errorMessage={shouldShowProductLanguagesError ? "Select a language from the drop down menu." : undefined}
          onChange={onProductLanguagesDropdownChange} />
      {productLanguagesSpinner}
    </Stack>
    <PrimaryButton
      text="Confirm"
      onClick={onConfirmButtonClick}
      disabled={shouldShowProductLanguagesSpinner ? true : false} />
  </> : undefined;

  let downloadBlock = editionSelected && downloadReady ? <>
    <Separator styles={separatorStyles} />
    <Text variant="xxLarge">Download</Text>
    <Text variant="xxLarge">{downloadHeader}</Text>
    {downloadLinks.map((link) => <React.Fragment key={link.url}>
      <PrimaryButton text={link.text} onClick={() => window.open(link.url)} />
    </React.Fragment>)}
  </> : undefined;

  function onProductEditionDropdownChange(
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number): void {
      setEditionSelectedToFalse();
      downloadIsNotReady();
      productLanguagesOptions.length = 1;
  }

  function onProductLanguagesDropdownChange(
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number): void {
      downloadIsNotReady();
  }

  function onDownloadButtonClick(): void {
    if (productEditionDropdownRef.current?.selectedOptions[0].key === "") {
      showProductEditionError();
    } else {
      hideProductEditionError();
      showProductEditionSpinner();

      fetch("https://www.microsoft.com/en-us/api/controls/contentinclude/html" + 
            "?pageId=a8f8f489-4c7f-463a-9ca6-5cff94d8d041" +
            "&host=www.microsoft.com" +
            "&segments=software-download%2cwindows11" +
            "&query=" +
            "&action=GetSkuInformationByProductEdition" +
            `&sessionId=${sessionId}` +
            `&productEditionId=${productEditionDropdownRef.current?.selectedOptions[0].key}` +
            "&sdVersion=2", { method: "POST"})
        .then(res => res.text())
        .then(result => {
          let div = document.createElement("div");
          div.innerHTML = result;

          console.log(div.querySelector("#errorModalTitle"));
          if (div.querySelector("#errorModalTitle")) {
            throw(div.querySelector("#errorModalMessage")?.textContent || "Unknown error");
          }

          let options = div.querySelectorAll("option");

          for (let i = 0; i < options.length; i++) {
            if (options[i].value !== "") {
              productLanguagesOptions.push({
                key: options[i].value,
                text: options[i].text
              });
            }
          }

          hideProductEditionSpinner();
          setEditionSelectedToTrue();
        }).catch(error => {
          errorMessage = error;
          hideProductEditionSpinner();
          showErrorDialog();
        });
    }
  }

  function onConfirmButtonClick(): void {
    if (productLanguagesDropdownRef.current?.selectedOptions[0].key === "") {
      showProductLanguagesError();
    } else {
      hideProductLanguagesError();
      showProductLanguagesSpinner();

      let key = JSON.parse(productLanguagesDropdownRef.current!.selectedOptions[0]!.key.toString());
      let skuId = key.id;
      let skuLanguage = key.language;

      fetch("https://www.microsoft.com/en-us/api/controls/contentinclude/html" +
            "?pageId=6e2a1789-ef16-4f27-a296-74ef7ef5d96b" +
            "&host=www.microsoft.com" +
            "&segments=software-download%2cwindows11" +
            "&query=" +
            "&action=GetProductDownloadLinksBySku" +
            `&sessionId=${sessionId}` +
            `&skuId=${skuId}` +
            `&language=${skuLanguage}` +
            "&sdVersion=2", { method: "POST" })
        .then(res => res.text())
        .then(result => {
          let div = document.createElement("div");
          div.innerHTML = result;

          if (div.querySelector("#errorModalTitle")) {
            throw(div.querySelector("#errorModalMessage")?.textContent || "Unknown error");
          }

          let headers = div.querySelectorAll("h2");
          downloadHeader = headers[headers.length - 1].textContent!;

          let buttons = div.querySelectorAll("a.button");
          for (let i = 0; i < buttons.length; i++) {
            downloadLinks.push({ text: buttons[i]!.textContent!, url: buttons[i].getAttribute("href")!})
          }

          hideProductLanguagesSpinner();
          downloadIsReady();
        }).catch(error => {
          errorMessage = error;
          hideProductLanguagesSpinner();
          showErrorDialog();
        });
    }
  }

  return (
    <Stack horizontalAlign="start" verticalAlign="start" verticalFill styles={stackStyles} tokens={stackTokens}>
      <Text variant="xxLarge">
        Download Windows Disk Image (ISO)
      </Text>
      <Text>This option is for users that want to create a bootable installation media (USB flash drive, DVD) or create a virtual machine (.ISO file) to install Windows. This download is a multi-edition ISO which uses your product key to unlock the correct edition.</Text>
      <Stack horizontal tokens={stackTokens}>
        <Dropdown
          componentRef={productEditionDropdownRef}
          defaultSelectedKey={""}
          options={productEditionOptions}
          styles={dropdownStyles}
          errorMessage={shouldShowProductEditionError ? "Select an edition from the drop down menu." : undefined}
          onChange={onProductEditionDropdownChange}
        />
        {productEditionSpinner}
      </Stack>
      <PrimaryButton
        text="Download"
        onClick={onDownloadButtonClick}
        disabled={shouldShowProductEditionSpinner ? true : false} />
      {productLanguagesBlock}
      {downloadBlock}
      <Dialog
        hidden={errorDialogHidden}
        onDismiss={hideErrorDialog}
        dialogContentProps={errorDialogProps}
      >
        <Text>{errorMessage}</Text>

        <DialogFooter>
          <PrimaryButton text="Close" onClick={hideErrorDialog} />
        </DialogFooter>
      </Dialog>
      <Image {...clearProps} hidden />
    </Stack>
  );
};
