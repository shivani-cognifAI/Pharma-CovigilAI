import { Utils } from '../../../../../utils/utils';
import { IGetE2BR2Data } from '../../r2/types';
import { IGetE2BR3Data, INodeTypes } from '../../r3/types';
import { generateE2br2XML, generateE2br3XML } from '../xml-generation';

const downloadXML = (xmlContent: string, articleId: string) => {
  const xmlBlob = new Blob([xmlContent], { type: 'application/xml' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(xmlBlob);
  URL.createObjectURL(xmlBlob);
  anchor.style.display = 'inline-block';
  const fileName = articleId
    ? `xml_report_ArticleID_${articleId}_${Utils.getCurrentDateAndTime()}.xml`
    : `xml_report_${Utils.getCurrentDateAndTime()}.xml`;
  anchor.setAttribute('download', fileName);
  anchor.click();
};

const isDataAbsent = (dataItem: INodeTypes) => {
  const keys = Object.keys(dataItem);
  return keys.length === 0;
};

export const createE2br3XML = (data: IGetE2BR3Data, articleId: string) => {
  
  const error =
    isDataAbsent(data.nodes.batch) ||
    isDataAbsent(data.nodes.drug) ||
    isDataAbsent(data.nodes.fullTextNarration) ||
    isDataAbsent(data.nodes.patient) ||
    isDataAbsent(data.nodes.report) ||
    isDataAbsent(data.nodes.reporter) ||
    isDataAbsent(data.nodes.sender) ||
    data.nodes.reaction.length === 0;

  if (error) {
    return { url: undefined, error: 'Please fill the required sections' };
  }

  const xmlContent = generateE2br3XML(data);
  downloadXML(xmlContent.replace(/^\s*\n/gm, ''), articleId);
  return { error: undefined };
};

export const createE2br2XML = (data: IGetE2BR2Data, articleId: string) => {
  
  const error =
    isDataAbsent(data.nodes.drug) ||
    isDataAbsent(data.nodes.fullTextNarration) ||
    isDataAbsent(data.nodes.patient) ||
    isDataAbsent(data.nodes.report) ||
    isDataAbsent(data.nodes.reporter) ||
    isDataAbsent(data.nodes.sender) ||
    data.nodes.reaction.length === 0;

  if (error) {
    return { url: undefined, error: 'Please fill the required sections' };
  }

  const xmlContent = generateE2br2XML(data);
  downloadXML(xmlContent.replace(/^\s*\n/gm, ''), articleId);
  return { error: undefined };
};
