import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Image, mergeClasses, Text } from "@fluentui/react-components";
import "./App.css";
import { Step } from "./components/step/Step";
import { ControlsService } from "./services/controls/ControlsService";
import { useStyles } from "./commons/Styles";
import Edition from "./edition";

// Constant values
const sessionId: string = crypto.randomUUID();

export const App: React.FunctionComponent = () => {
  // Styles
  const classes = useStyles();

  // Data and their default values
  const defaultLanguageOption: { value: string; text: string; } = { value: "", text: "Choose one" };
  const defaultDownloadLinksData: { title: string; links: { text: string; url: string }[] } = { title: "", links: [] };
  const defaultInfoMessage: string = "";
  const defaultErrorData: { title: string, message: string, hasError: boolean } = { title: "", message: "", hasError: false };

  const [languageOptions, setLanguageOptions] = useState([defaultLanguageOption]);
  const [donwloadLinksData, setDownloadLinksData] = useState(defaultDownloadLinksData);
  const [infoMessage, setInfoMessage] = useState(defaultInfoMessage);
  const [errorData, setErrorData] = useState(defaultErrorData);

  // Private functions
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

  const onEditionValueChange = () => {
    setLanguageOptions([defaultLanguageOption]);
    setDownloadLinksData(defaultDownloadLinksData);
  };
  const loadLanguages = (value: string, isProductKey: boolean): Promise<void> => {
    let promise;
    if (isProductKey) {
      promise = ControlsService.GetSkuInformationByKey(sessionId, value);
    } else {
      promise = ControlsService.getLanguages(sessionId, value);
    }

    return promise.then(languagesData => {
      setLanguageOptions(languagesData.languages);

      if (languagesData.info) {
        setInfoMessage(languagesData.info);
      }
    }).catch(error => setErrorData(error));
  }

  // Dynamic components
  let languagesStep = languageOptions.length > 1 ? <>
    <Divider />
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
    <Divider />
    <Step
      title={donwloadLinksData.title}
      linkButtons={donwloadLinksData.links}
    />
  </> : undefined;

  let errorDialog = <>
    <Dialog open={errorData.hasError} modalType="modal">
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{errorData.title}</DialogTitle>
          <DialogContent>
            <p dangerouslySetInnerHTML={{ __html: errorData.message }} />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary"
                onClick={() => setErrorData({
                  title: errorData.title,
                  message: errorData.message,
                  hasError: false
                }
                )}>
                Close
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  </>;

  return (
    <div className={mergeClasses(classes.flexColumn, classes.topGap, classes.fiftyPadding)}>
      <Edition onValueChange={onEditionValueChange} onClick={loadLanguages} />
      {languagesStep}
      {downloadLinksStep}
      {errorDialog}
      <Image className={classes.hidden} src={`https://vlscppe.microsoft.com/fp/clear.png?org_id=y6jn8c31&session_id=${sessionId}`} />
    </div>
  );
};