import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Image, mergeClasses } from "@fluentui/react-components";
import "./App.css";
import { Step } from "./components/step/Step";
import { ControlsService } from "./services/controls/ControlsService";
import { useStyles } from "./commons/Styles";
import Edition from "./edition";
import Language from "./language";

// Constant values
const sessionId: string = crypto.randomUUID();

export const App: React.FunctionComponent = () => {
  // Styles
  const classes = useStyles();

  // Data and their default values
  const defaultDownloadLinksData: { title: string; links: { text: string; url: string }[] } = { title: "", links: [] };
  const defaultInfoMessage: string = "";
  const defaultErrorData: { title: string, message: string, hasError: boolean } = { title: "", message: "", hasError: false };

  const [languageOptions, setLanguageOptions] = useState<{ value: string; text: string; }[]>([]);
  const [donwloadLinksData, setDownloadLinksData] = useState(defaultDownloadLinksData);
  const [, setInfoMessage] = useState(defaultInfoMessage);
  const [errorData, setErrorData] = useState(defaultErrorData);

  // Private functions
  const onEditionValueChange = () => {
    setLanguageOptions([]);
    setDownloadLinksData(defaultDownloadLinksData);
  };
  const onLanguageValueChange = () => setDownloadLinksData(defaultDownloadLinksData);
  const loadLanguages = (value: string, isProductKey: boolean): Promise<void> => {
    let promise;
    if (isProductKey) {
      promise = ControlsService.GetSkuInformationByKey(sessionId, value);
    } else {
      promise = ControlsService.getSkuInformationByProductEdition(sessionId, value);
    }

    return promise.then(languagesData => {
      setLanguageOptions(languagesData.languages);

      if (languagesData.info) {
        setInfoMessage(languagesData.info);
      }
    }).catch(error => setErrorData(error));
  };
  const loadDownloadLinks = (languageData: string): Promise<void> => {
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
  };

  // Dynamic components
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
      <Language options={languageOptions} onValueChange={onLanguageValueChange} onClick={loadDownloadLinks} />
      {downloadLinksStep}
      {errorDialog}
      <Image className={classes.hidden} src={`https://vlscppe.microsoft.com/fp/clear.png?org_id=y6jn8c31&session_id=${sessionId}`} />
    </div>
  );
};