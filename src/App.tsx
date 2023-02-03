import React, { useState } from 'react';
import { Stack, Text, IDropdownOption, initializeIcons, PrimaryButton, Separator, ISeparatorStyles, ITextStyles, Dialog, DialogType, IDialogContentProps, DialogFooter, IImageProps, Image, IStackStyles, IStackTokens } from '@fluentui/react';
import './App.css';
import { useBoolean } from "@fluentui/react-hooks";
import { Step } from './components/step/Step';
import { ControlsService } from './services/controls/ControlsService';

// Constant values
const sessionId: string = crypto.randomUUID();

// Styles
const boldTextStyle: Partial<ITextStyles> = { root: { fontWeight: "bold" } };
const stackStyles: Partial<IStackStyles> = {
  root: {
    maxWidth: "960px",
    margin: "0 auto",
    paddingTop: "50px",
  }
};
const separatorStyles: Partial<ISeparatorStyles> = { root: { width: "100%" } };

// Tokens
const tokens: Partial<IStackTokens> = { childrenGap: 15 };

const editionOptions: IDropdownOption[] = [
  { key: "", text: "Select Download" },
  { key: "2370", text: "Windows 11, version 22H2" },
  { key: "2069", text: "Windows 11, version 21H2" },
  { key: "2377", text: "Windows 10, version 22H2" },
]

const errorDialogProps: IDialogContentProps = {
  type: DialogType.normal,
  title: "Error"
}

const clearProps: Partial<IImageProps> = {
  src: `https://vlscppe.microsoft.com/fp/clear.png?org_id=y6jn8c31&session_id=${sessionId}`
};

let errorMessage: string = "";
let downloadsHeader: string = "";

initializeIcons();

export const App: React.FunctionComponent = () => {
  const [errorDialogHidden, {
    setTrue: hideErrorDialog,
    setFalse: showErrorDialog
  }] = useBoolean(true);

  // Data lists
  const [languageOptions, setLanguageOptions] = useState<{ key: string, text: string }[]>([]);
  const [downloadLinkButtons, setDownloadLinkButtons] = useState<{ text: string, onClick?: Function, url?: string }[]>([]);

  function loadLanguages(productEditionId: string): Promise<void> {
    return ControlsService.getProductEditionLanguages(sessionId, productEditionId)
      .then(productEditionLanguages => {
        setLanguageOptions(productEditionLanguages);
      }).catch(error => {
        errorMessage = error;
        showErrorDialog();
      });
  }

  function loadDownloadLinks(languageData: string): Promise<void> {
    let key = JSON.parse(languageData);

    return ControlsService.getDownloadLinks(sessionId, key.id, key.language)
      .then(downloadLinks => {
        downloadsHeader = downloadLinks.title;
        setDownloadLinkButtons(downloadLinks.links.map(downloadLink => {
          return { text: downloadLink.text, url: downloadLink.url }
        }));
      }).catch(error => {
        errorMessage = error;
        showErrorDialog();
      });
  }

  function clearLanguagesAndDownloadLinks() {
    setLanguageOptions([]);
    setDownloadLinkButtons([]);
  }

  function clearDownloadLinks() {
    setDownloadLinkButtons([]);
  }

  let productLanguagesStep = languageOptions.length > 0 ? <>
    <Separator styles={separatorStyles} />
    <Step
      title="Select the product language"
      description={
        <Text>
          <Text>You'll need to choose the same language when you install Windows. To see what language you're currently using, go to </Text>
          <Text styles={boldTextStyle}>Time and language</Text>
          <Text> in PC settings or </Text>
          <Text styles={boldTextStyle}>Region</Text>
          <Text> in Control Panel.</Text>
        </Text>
      }
      options={languageOptions}
      defaultSelectedKey=""
      onChange={clearDownloadLinks}
      errorMessage="Select a language from the drop down menu."
      actionButton={{ text: "Confirm", onClick: loadDownloadLinks }}
    /> </> : undefined;

  let downloadLinksStep = downloadLinkButtons.length > 0 ? <>
    <Separator styles={separatorStyles} />
    <Step
      title={downloadsHeader}
      linkButtons={downloadLinkButtons}
    />
  </> : undefined;

  return (
    <Stack styles={stackStyles} tokens={tokens}>
      <Step
        title="Download Windows Disk Image (ISO)"
        description="This option is for users that want to create a bootable installation media (USB flash drive, DVD) or create a virtual machine (.ISO file) to install Windows. This download is a multi-edition ISO which uses your product key to unlock the correct edition."
        options={editionOptions}
        defaultSelectedKey=""
        onChange={clearLanguagesAndDownloadLinks}
        errorMessage="Select an edition from the drop down menu."
        actionButton={{ text: "Download", onClick: loadLanguages }}
      />
      {productLanguagesStep}
      {downloadLinksStep}
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