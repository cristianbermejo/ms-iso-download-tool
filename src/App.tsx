import React, { useState } from "react";
import { PrimaryButton, Separator, ISeparatorStyles, Dialog, DialogFooter, Image } from '@fluentui/react';
import { makeStyles, Text } from "@fluentui/react-components";
import "./App.css";
import { Step } from "./components/step/Step";
import { ControlsService } from "./services/controls/ControlsService";
import importedEditionOptions from "./res/editionOptions.json";

// Constant values
const sessionId: string = crypto.randomUUID();

// Styles
const separatorStyles: Partial<ISeparatorStyles> = { root: { width: "100%" } };
const useStyles = makeStyles({
  columnBlock: {
    paddingTop: "50px",
    paddingRight: "50px",
    paddingBottom: "50px",
    paddingLeft: "50px",
    display: "flex",
    flexDirection: "column"
  }
});

export const App: React.FunctionComponent = () => {
  // Styles
  const classes = useStyles();

  // Data and their default values
  const defaultEditionOption: { value: string, text: string, disabled?: boolean, title?: string } = { value: "", text: "Select Download" };
  const defaultLanguageOption: { value: string; text: string; } = { value: "", text: "Choose one" };
  const defaultDownloadLinksData: { title: string; links: { text: string; url: string }[] } = { title: "", links: [] };
  const defaultInfoMessage: string = "";
  const defaultErrorData: { title: string, message: string, hasError: boolean } = { title: "", message: "", hasError: false };

  const [editionOptions,] = useState([defaultEditionOption].concat(importedEditionOptions));
  const [languageOptions, setLanguageOptions] = useState([defaultLanguageOption]);
  const [donwloadLinksData, setDownloadLinksData] = useState(defaultDownloadLinksData);
  const [infoMessage, setInfoMessage] = useState(defaultInfoMessage);
  const [errorData, setErrorData] = useState(defaultErrorData);

  // Private functions
  function _loadLanguages(productEditionId: string): Promise<void> {
    if (editionOptions.find(option => option.value === productEditionId)) {
      return ControlsService.getLanguages(sessionId, productEditionId)
        .then(languagesData => {
          setLanguageOptions(languagesData.languages);

          if (languagesData.info) {
            setInfoMessage(languagesData.info);
          }
        }).catch(error => setErrorData(error));
    } else {
      return ControlsService.GetSkuInformationByKey(sessionId, productEditionId)
        .then(languagesData => {
          setLanguageOptions(languagesData.languages);

          if (languagesData.info) {
            setInfoMessage(languagesData.info);
          }
        }).catch(error => setErrorData(error));
    }
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
      defaultSelectedOption={defaultEditionOption}
      placeholder="Enter product key"
      onChange={() => {
        setLanguageOptions([defaultLanguageOption]);
        setDownloadLinksData(defaultDownloadLinksData);
      }}
      errorMessages={{ dropdown: "Select an edition from the drop down menu.", textfield: "Your license key must contain 25 letters and numbers and no special characters: ()[].-#*/" }}
      actionButton={{ text: "Download", onClick: _loadLanguages }}
    />
  </>;
  let languagesStep = languageOptions.length > 1 ? <>
    <Separator styles={separatorStyles} />
    <Step
      title="Select the product language"
      description={
        <Text>
          <Text>You'll need to choose the same language when you install Windows. To see what language you're currently using, go to </Text>
          <Text weight="bold">Time and language</Text>
          <Text> in PC settings or </Text>
          <Text weight="bold">Region</Text>
          <Text> in Control Panel.</Text>
        </Text>
      }
      options={languageOptions}
      defaultSelectedOption={defaultLanguageOption}
      onChange={() => setDownloadLinksData(defaultDownloadLinksData)}
      infoMessage={infoMessage}
      errorMessages={{ dropdown: "Select a language from the drop down menu." }}
      actionButton={{ text: "Confirm", onClick: _loadDownloadLinks }}
    />
  </> : undefined;

  let downloadLinksStep = donwloadLinksData.links.length > defaultDownloadLinksData.links.length ? <>
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
    <div className={classes.columnBlock}>
      {editionsStep}
      {languagesStep}
      {downloadLinksStep}
      {errorDialog}
      <Image src={`https://vlscppe.microsoft.com/fp/clear.png?org_id=y6jn8c31&session_id=${sessionId}`} hidden />
    </div>
  );
};