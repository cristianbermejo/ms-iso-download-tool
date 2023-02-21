import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Image, mergeClasses } from "@fluentui/react-components";
import "./App.css";
import ControlsService from "./services/controls";
import useCommonStyles from "./commons/styles";
import Edition from "./views/edition";
import Language from "./views/language";
import Download from "./views/download";

// Constant values
const sessionId: string = crypto.randomUUID();

export const App: React.FunctionComponent = () => {
  // Styles
  const commonClasses = useCommonStyles();
  const verticalStackWithChildrenGap = mergeClasses(commonClasses.verticalStack, commonClasses.verticalChildrenGap);

  // Data and their default values
  const defaultDownloadLinksData: { title: string; links: { text: string; url: string }[] } = { title: "", links: [] };
  const defaultInfoMessage: string = "";
  const defaultErrorData: { title: string, message: string, hasError: boolean } = { title: "", message: "", hasError: false };

  const [languageOptions, setLanguageOptions] = useState<{ value: string; text: string; }[]>([]);
  const [donwloadLinksData, setDownloadLinksData] = useState(defaultDownloadLinksData);
  const [infoMessage, setInfoMessage] = useState(defaultInfoMessage);
  const [errorData, setErrorData] = useState(defaultErrorData);

  // Private functions
  const onEditionValueChange = () => {
    setLanguageOptions([]);
    setDownloadLinksData(defaultDownloadLinksData);
  };
  const onLanguageValueChange = () => setDownloadLinksData(defaultDownloadLinksData);
  const onErrorDialogButtonClick = () => setErrorData({
    title: errorData.title,
    message: errorData.message,
    hasError: false
  });
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

  return (
    <div>
      <div className={verticalStackWithChildrenGap}>
        <Edition onValueChange={onEditionValueChange} onClick={loadLanguages} />
        <Language infoMessage={infoMessage} options={languageOptions} onValueChange={onLanguageValueChange} onClick={loadDownloadLinks} />
        <Download title={donwloadLinksData.title} links={donwloadLinksData.links} />
      </div>
      <Dialog open={errorData.hasError} modalType="modal">
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{errorData.title}</DialogTitle>
            <DialogContent>
              <p dangerouslySetInnerHTML={{ __html: errorData.message }} />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" onClick={onErrorDialogButtonClick}>Close</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Image className={commonClasses.hidden} src={`https://vlscppe.microsoft.com/fp/clear.png?org_id=y6jn8c31&session_id=${sessionId}`} />
    </div>
  );
};