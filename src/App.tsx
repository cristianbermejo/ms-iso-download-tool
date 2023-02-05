import React, { useState } from "react";
import { Stack, Text, initializeIcons, PrimaryButton, Separator, ISeparatorStyles, ITextStyles, Dialog, DialogFooter, Image, IStackTokens, FontWeights } from '@fluentui/react';
import "./App.css";
import { Step } from "./components/step/Step";
import { ControlsService } from "./services/controls/ControlsService";

// Constant values
const sessionId: string = crypto.randomUUID();

// Styles
const boldTextStyles: Partial<ITextStyles> = { root: { fontWeight: FontWeights.bold } };
const separatorStyles: Partial<ISeparatorStyles> = { root: { width: "100%" } };

// Tokens
const stackTokens: Partial<IStackTokens> = {
  padding: 50,
  childrenGap: 15
};

export const App: React.FunctionComponent = () => {
  // Initializer function calls
  initializeIcons();

  // Data and their default values
  const defaultEditionOptions = [
    { key: "", text: "Select Download" },
    { key: "2370", text: "Windows 11, version 22H2" },
    { key: "2069", text: "Windows 11, version 21H2" },
    { key: "2377", text: "Windows 10, version 22H2" },
  ];
  const defaultLanguageOptions: { key: string; text: string; }[] = [];
  const defaultDownloadLinksData: { title: string; links: { text: string; url: string }[] } = { title: "", links: [] };
  const defaultErrorData: { title: string, message: string, hasError: boolean } = { title: "", message: "", hasError: false };

  const [editionOptions,] = useState(defaultEditionOptions);
  const [languageOptions, setLanguageOptions] = useState(defaultLanguageOptions);
  const [donwloadLinksData, setDownloadLinksData] = useState(defaultDownloadLinksData);
  const [errorData, setErrorData] = useState(defaultErrorData);

  // Private functions
  function _loadLanguages(productEditionId: string): Promise<void> {
    return ControlsService.getLanguages(sessionId, productEditionId)
      .then(languages => setLanguageOptions(languages))
      .catch(error => setErrorData(error));
  }

  function _loadDownloadLinks(languageData: string): Promise<void> {
    let key = JSON.parse(languageData);

    return ControlsService.getDownloadLinks(sessionId, key.id, key.language)
      .then(downloadLinks => {
        setDownloadLinksData({
          title: downloadLinks.title,
          links: downloadLinks.links.map(downloadLink => {
            return { text: downloadLink.text, url: downloadLink.url }
          })
        });
      }).catch(error => setErrorData(error));
  }

  // Dynamic components
  let editionsStep = <>
    <Step
      title="Download Windows Disk Image (ISO)"
      description="This option is for users that want to create a bootable installation media (USB flash drive, DVD) or create a virtual machine (.ISO file) to install Windows. This download is a multi-edition ISO which uses your product key to unlock the correct edition."
      options={editionOptions}
      defaultSelectedKey=""
      onChange={() => {
        setLanguageOptions(defaultLanguageOptions);
        setDownloadLinksData(defaultDownloadLinksData);
      }}
      errorMessage="Select an edition from the drop down menu."
      actionButton={{ text: "Download", onClick: _loadLanguages }}
    />
  </>;

  let languagesStep = languageOptions.length > 0 ? <>
    <Separator styles={separatorStyles} />
    <Step
      title="Select the product language"
      description={
        <Text>
          <Text>You'll need to choose the same language when you install Windows. To see what language you're currently using, go to </Text>
          <Text styles={boldTextStyles}>Time and language</Text>
          <Text> in PC settings or </Text>
          <Text styles={boldTextStyles}>Region</Text>
          <Text> in Control Panel.</Text>
        </Text>
      }
      options={languageOptions}
      defaultSelectedKey=""
      onChange={() => setDownloadLinksData(defaultDownloadLinksData)}
      errorMessage="Select a language from the drop down menu."
      actionButton={{ text: "Confirm", onClick: _loadDownloadLinks }}
    />
  </> : undefined;

  let downloadLinksStep = donwloadLinksData.links.length > 0 ? <>
    <Separator styles={separatorStyles} />
    <Step
      title={donwloadLinksData.title}
      linkButtons={donwloadLinksData.links}
    />
  </> : undefined;

  let errorDialog = <>
    <Dialog dialogContentProps={{ title: errorData.title }} hidden={!errorData.hasError}>
      <p dangerouslySetInnerHTML={{ __html: errorData.message }} />
      <DialogFooter>
        <PrimaryButton text="Close" onClick={() => setErrorData({ title: errorData.title, message: errorData.message, hasError: false })} />
      </DialogFooter>
    </Dialog>
  </>;

  return (
    <Stack tokens={stackTokens}>
      {editionsStep}
      {languagesStep}
      {downloadLinksStep}
      {errorDialog}
      <Image src={`https://vlscppe.microsoft.com/fp/clear.png?org_id=y6jn8c31&session_id=${sessionId}`} hidden />
    </Stack>
  );
};