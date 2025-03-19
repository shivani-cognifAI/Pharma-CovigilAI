import { IGetE2BR2Data } from '../../r2/types';
import {
  IDrugDetails,
  IGetE2BR3Data,
  IPatientDetails,
  IReactionEventDetails,
  IReporterDetails,
  ISenderDetails,
} from '../../r3/types';

const generatePatientDetails = (patient: IPatientDetails) => {
  const patientDetais = `
                      <player1 classCode="PSN" determinerCode="INSTANCE">
                        <name nullFlavor="MSK">${patient?.patientName}</name>
                        ${
                          patient.sex
                            ? `<administrativeGenderCode code="${patient.sex}" codeSystem="1.0.5218" />`
                            : ''
                        }
                      </player1>
                      ${
                        patient.age
                          ? `
                      <subjectOf2 typeCode="SBJ">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="3" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="PQ" value="${patient.age}" unit="a" />
                        </observation>
                      </subjectOf2>
                        `
                          : ''
                      }    
                      ${
                        patient.weight
                          ? `
                      <subjectOf2 typeCode="SBJ">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="7" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" codeSystemVersion="2.0" displayName="bodyWeight" />
                          <value xsi:type="PQ" value="${patient.weight}" unit="kg" />
                        </observation>
                      </subjectOf2>
                        `
                          : ''
                      }  
                    ${
                      patient.height
                        ? `
                      <subjectOf2 typeCode="SBJ">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="17" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" codeSystemVersion="2.0" displayName="height" />
                          <value xsi:type="PQ" value="${patient.height}" unit="cm" />
                        </observation>
                      </subjectOf2>  
                      `
                        : ''
                    }  
  `;

  return patientDetais;
};

export const generateReporterDetails = (reporter: IReporterDetails) => {
  const reporterDetails = `
                          <author typeCode="AUT">
                          <assignedEntity classCode="ASSIGNED">
                            <assignedPerson classCode="PSN" determinerCode="INSTANCE">
                              <name>
                                <prefix>${
                                  reporter.reporterTitle
                                    ? reporter.reporterTitle
                                    : ''
                                }</prefix>
                                <given>${
                                  reporter.reporterGivenName
                                    ? reporter.reporterGivenName
                                    : ''
                                }</given>
                                <family>${
                                  reporter.reporterFamilyName
                                    ? reporter.reporterFamilyName
                                    : ''
                                }</family>
                              </name>
                              ${
                                reporter.reporterQualification
                                  ? `
                              <asQualifiedEntity classCode="QUAL">
                                <code code="${reporter.reporterQualification}" codeSystem="2.16.840.1.113883.3.989.2.1.1.6" />
                              </asQualifiedEntity>
                                `
                                  : ''
                              }
                                ${
                                  reporter.reporterCountryCode
                                    ? `
                              <asLocatedEntity classCode="LOCE">
                                <location classCode="COUNTRY" determinerCode="INSTANCE">
                                  <code code="${reporter.reporterCountryCode}" codeSystem="1.0.3166.1.2.2" />
                                </location>
                              </asLocatedEntity>    
                                  `
                                    : ''
                                }                      
                            </assignedPerson>
                            <representedOrganization classCode="ORG" determinerCode="INSTANCE">
                              <name>${
                                reporter.reporterDepartment
                                  ? reporter.reporterDepartment
                                  : ''
                              }</name>
                              <assignedEntity classCode="ASSIGNED">
                                <representedOrganization classCode="ORG" determinerCode="INSTANCE">
                                  <name>${reporter.reporterOrganization}</name>
                                </representedOrganization>
                              </assignedEntity>
                            </representedOrganization>
                          </assignedEntity>
                        </author>
  `;

  return reporterDetails;
};

const generateSenderDetails = (sender: ISenderDetails) => {
  const senderDetails = `
                      <author typeCode="AUT">
                      <assignedEntity classCode="ASSIGNED">
                        <code code="${sender.senderType}" codeSystem="2.16.840.1.113883.3.989.2.1.1.7" />
                        <assignedPerson classCode="PSN" determinerCode="INSTANCE">
                          <name>
                            <given>${sender.senderGivenName}</given>
                            <family>${sender.senderFamilyName}</family>
                          </name>
                          <asLocatedEntity classCode="LOCE">
                            <location classCode="COUNTRY" determinerCode="INSTANCE">
                              <code code="${sender.senderCountryCode}" codeSystem="1.0.3166.1.2.2" />
                            </location>
                          </asLocatedEntity>
                        </assignedPerson>
                        <representedOrganization classCode="ORG" determinerCode="INSTANCE">
                          <name>${sender.senderDepartment}</name>
                          <assignedEntity classCode="ASSIGNED">
                            <representedOrganization classCode="ORG" determinerCode="INSTANCE">
                              <name>${sender.senderOrganization}</name>
                            </representedOrganization>
                          </assignedEntity>
                        </representedOrganization>
                      </assignedEntity>
                    </author>
  `;
  return senderDetails;
};

const generateDrugDetails = (drug: IDrugDetails) => {
  const drugDetails = `
                          <component typeCode="COMP">
                            <substanceAdministration classCode="SBADM" moodCode="EVN">
                              <id root="3c91b4d5-e039-4a7a-9c30-67671b0ef9e4" />
                              <consumable typeCode="CSM">
                                <instanceOfKind classCode="INST">
                                  <kindOfProduct classCode="MMAT" determinerCode="KIND">
                                    <name>${drug.productName}</name>
                                    <ingredient classCode="ACTI">
                                      <ingredientSubstance classCode="MMAT" determinerCode="KIND">
                                        <name>${drug.substanceName}</name>
                                      </ingredientSubstance>
                                    </ingredient>
                                  </kindOfProduct>
                                </instanceOfKind>
                              </consumable>
                              <outboundRelationship2 typeCode="COMP">
                                <substanceAdministration classCode="SBADM" moodCode="EVN">
                                ${
                                  drug.doseNo && drug.doseUnit
                                    ? `
                                      <doseQuantity value="${drug.doseNo}" unit="${drug.doseUnit}" />
                                  `
                                    : ''
                                }
                                </substanceAdministration>
                              </outboundRelationship2>
                              ${
                                drug.actionTaken
                                  ? `
                                <inboundRelationship typeCode="CAUS">
                                <act classCode="ACT" moodCode="EVN">
                                  <code code="${drug.actionTaken}" codeSystem="2.16.840.1.113883.3.989.2.1.1.15" />
                                </act>
                              </inboundRelationship>
                                `
                                  : ''
                              }
                            </substanceAdministration>
                          </component>
  `;
  return drugDetails;
};

const generateReactionDetails = (reactions: IReactionEventDetails[]) => {
  let reactionDetails = ``;
  reactions.forEach((reaction, index) => {
    reactionDetails += `
    <subjectOf2 typeCode="SBJ">
                    <observation classCode="OBS" moodCode="EVN">
                      <id root="rid-${index+1}"/>
                      <code code="29" codeSystem="2.16.840.1.113883.3.989.2.1.1.19"/>
                      <value xsi:type="CE" code="${reaction.reactionCode}" codeSystem="2.16.840.1.113883.6.163" codeSystemVersion="${reaction.medraVersion}">
                        <originalText>${reaction.reactionName}</originalText>
                      </value>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="34" codeSystem="2.16.840.1.113883.3.989.2.1.1.19"/>
                          <value xsi:type="BL" nullFlavor="NI" value="${reaction.isDeath}" />
                        </observation>
                      </outboundRelationship2>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="21" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="BL" nullFlavor="NI" value="${reaction.isLifeThreatening}" />
                          
                        </observation>
                      </outboundRelationship2>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="33" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="BL" nullFlavor="NI" value="${reaction.isHospitalised}" />
                          
                        </observation>
                      </outboundRelationship2>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="35" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="BL" nullFlavor="NI" value="${reaction.isDisabling}" />
                          
                        </observation>
                      </outboundRelationship2>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="12" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="BL" nullFlavor="NI" value="${reaction.isCongenital}" />
                          
                        </observation>
                      </outboundRelationship2>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="26" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="BL" value="${reaction.isOtherCondition}" />
                          
                        </observation>
                      </outboundRelationship2>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="27" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="CE" code="3"
                            codeSystem="2.16.840.1.113883.3.989.2.1.1.11" />
                          
                        </observation>
                      </outboundRelationship2>
                      <outboundRelationship2 typeCode="PERT">
                        <observation classCode="OBS" moodCode="EVN">
                          <code code="27" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                          <value xsi:type="CE" code="${reaction.reactionOutcome}"
                            codeSystem="2.16.840.1.113883.3.989.2.1.1.11" />
                        </observation>
                      </outboundRelationship2>
                    </observation>
                  </subjectOf2>
    `;
  });

  return reactionDetails;
};

export const generateE2br3XML = (data: IGetE2BR3Data) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
      <MCCI_IN200100UV01
        xsi:schemaLocation="urn:hl7-org:v3 http://eudravigilance.ema.europa.eu/XSD/multicacheschemas/MCCI_IN200100UV01.xsd"
        xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ITSVersion="XML_1.0">
        <id extension="${
          data.nodes?.batch?.batchNumber
        }" root="2.16.840.1.113883.3.989.2.1.3.22" />
        <creationTime value="${data.nodes?.batch?.batchDate}" />
        <responseModeCode code="D" />
        <interactionId extension="MCCI_IN200100UV01" root="2.16.840.1.113883.1.6" />
        <name code="1" codeSystem="2.16.840.1.113883.3.989.2.1.1.1" />
        <PORR_IN049016UV>
          <id extension="${
            data.nodes?.batch?.messageId
          }" root="2.16.840.1.113883.3.989.2.1.3.1" />
          <creationTime value="${data.nodes?.batch?.messageDate}" />
          <interactionId extension="PORR_IN049016UV" root="2.16.840.1.113883.1.6" />
          <processingCode code="P" />
          <processingModeCode code="T" />
          <acceptAckCode code="AL" />
          <receiver typeCode="RCV">
            <device classCode="DEV" determinerCode="INSTANCE">
              <id extension="${
                data.nodes?.batch?.messageReceiverId
              }" root="2.16.840.1.113883.3.989.2.1.3.12" />
            </device>
          </receiver>
          <sender typeCode="SND">
            <device classCode="DEV" determinerCode="INSTANCE">
              <id extension="${
                data.nodes?.batch?.messageSenderId
              }" root="2.16.840.1.113883.3.989.2.1.3.11" />
            </device>
          </sender>
          <controlActProcess classCode="CACT" moodCode="EVN">
            <code code="PORR_TE049016UV" codeSystem="2.16.840.1.113883.1.18" />
            <effectiveTime value="${data.nodes.report.creationDate}" />
            <subject typeCode="SUBJ">
              <investigationEvent classCode="INVSTG" moodCode="EVN">
                <id extension="${
                  data.nodes.report.safetyReportId
                }" root="2.16.840.1.113883.3.989.2.1.3.1" />
                <id extension="${
                  data.nodes.report.caseIdNumber
                }" root="2.16.840.1.113883.3.989.2.1.3.2" />
                <code code="PAT_ADV_EVNT" codeSystem="2.16.840.1.113883.5.4" />
                <text>${data.nodes?.fullTextNarration?.summary}</text>
                <statusCode code="active" />
                <effectiveTime>
                  <low value="${data.nodes?.report?.dateFirstReceived}" />
                </effectiveTime>
                <availabilityTime value="${
                  data.nodes?.report?.dateMostRecent
                }" />
                <component typeCode="COMP">
                    <adverseEventAssessment classCode="INVSTG" moodCode="EVN">
                  <subject1 typeCode="SBJ">
                    <primaryRole classCode="INVSBJ">
                      ${generatePatientDetails(data.nodes.patient)}
                      <subjectOf2 typeCode="SBJ">
                        <organizer classCode="CATEGORY" moodCode="EVN">
                          <code code="4" codeSystem="2.16.840.1.113883.3.989.2.1.1.20" />
                            ${generateDrugDetails(data.nodes.drug)}
                        </organizer>
                      </subjectOf2>
                      ${generateReactionDetails(data.nodes.reaction)}
                    </primaryRole>
                  </subject1>
                    <component typeCode="COMP">
                      <causalityAssessment classCode="OBS" moodCode="EVN">
                        <code code="20" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                        <value xsi:type="CE" code="${
                          data.nodes.drug?.drugCharacterisation
                        }" codeSystem="2.16.840.1.113883.3.989.2.1.1.13" />
                        <subject2 typeCode="SUBJ">
                          <productUseReference classCode="SBADM" moodCode="EVN">
                            <id root="3c91b4d5-e039-4a7a-9c30-67671b0ef9e4" />
                          </productUseReference>
                        </subject2>
                      </causalityAssessment>
                    </component>
                  </adverseEventAssessment>
                </component>
                <component typeCode="COMP">
                  <observationEvent classCode="OBS" moodCode="EVN">
                    <code code="1" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                    <value xsi:type="BL" value="false" />
                  </observationEvent>
                </component>
                <component typeCode="COMP">
                  <observationEvent classCode="OBS" moodCode="EVN">
                    <code code="23" codeSystem="2.16.840.1.113883.3.989.2.1.1.19" />
                    <value xsi:type="BL" nullFlavor="NI" />
                  </observationEvent>
                </component>
                <outboundRelationship typeCode="SPRT">
                  <relatedInvestigation classCode="INVSTG" moodCode="EVN">
                    <code code="1" codeSystem="2.16.840.1.113883.3.989.2.1.1.22" />
                    <subjectOf2 typeCode="SUBJ">
                      <controlActEvent classCode="CACT" moodCode="EVN">
                        <author typeCode="AUT">
                          <assignedEntity classCode="ASSIGNED">
                            <code code="${
                              data.nodes.report.firstSender
                            }" codeSystem="2.16.840.1.113883.3.989.2.1.1.3" displayName="initialReport" />
                          </assignedEntity>
                        </author>
                      </controlActEvent>
                    </subjectOf2>
                  </relatedInvestigation>
                </outboundRelationship>
                <outboundRelationship typeCode="SPRT">
                  <priorityNumber value="1" />
                  <relatedInvestigation classCode="INVSTG" moodCode="EVN">
                    <code code="2" codeSystem="2.16.840.1.113883.3.989.2.1.1.22" />
                    <subjectOf2 typeCode="SUBJ">
                      <controlActEvent classCode="CACT" moodCode="EVN">
                           ${generateReporterDetails(data.nodes.reporter)}   
                      </controlActEvent>
                    </subjectOf2>
                  </relatedInvestigation>
                </outboundRelationship>
                <subjectOf1 typeCode="SUBJ">
                  <controlActEvent classCode="CACT" moodCode="EVN">
                           ${generateSenderDetails(data.nodes.sender)} 
                  </controlActEvent>
                </subjectOf1>
                <subjectOf2 typeCode="SUBJ">
                  <investigationCharacteristic classCode="OBS" moodCode="EVN">
                    <code code="1" codeSystem="2.16.840.1.113883.3.989.2.1.1.23" />
                    <value xsi:type="CE" code="3" codeSystem="2.16.840.1.113883.3.989.2.1.1.2" />
                  </investigationCharacteristic>
                </subjectOf2>
                <subjectOf2 typeCode="SUBJ">
                  <investigationCharacteristic classCode="OBS" moodCode="EVN">
                    <code code="2" codeSystem="2.16.840.1.113883.3.989.2.1.1.23" />
                    <value xsi:type="BL" nullFlavor="NI" />
                  </investigationCharacteristic>
                </subjectOf2>
              </investigationEvent>
            </subject>
          </controlActProcess>
        </PORR_IN049016UV>
        <receiver typeCode="RCV">
          <device classCode="DEV" determinerCode="INSTANCE">
            <id extension="${
              data.nodes.batch.batchReceiver
            }" root="2.16.840.1.113883.3.989.2.1.3.14" />
          </device>
        </receiver>
        <sender typeCode="SND">
          <device classCode="DEV" determinerCode="INSTANCE">
            <id extension="${
              data.nodes.batch.batchSender
            }" root="2.16.840.1.113883.3.989.2.1.3.13" />
          </device>
        </sender>
      </MCCI_IN200100UV01>
  `;
};



const generateReactionDetailsForE2BR2 = (reactions: IReactionEventDetails[]) => {
  let reactionDetails = ``;
  reactions.forEach((reaction) => {
    reactionDetails += `
   <primarysourcereaction>${reaction.primarysourcereaction}</primarysourcereaction>
 <reactionmeddraversionllt>${reaction.meddraversionllt}</reactionmeddraversionllt>
<reactionmeddrallt>${reaction.meddrallt}</reactionmeddrallt>
<reactionmeddraversionpt>${reaction.meddraversionpt}</reactionmeddraversionpt>
<reactionmeddrapt>${reaction.meddraversionpt}</reactionmeddrapt>
<reactionstartdate>${reaction.startdate}</reactionstartdate>  `;
    
  });

  return reactionDetails;
};


export const generateE2br2XML = (data: IGetE2BR2Data) => {
  return `<?xml version="1.0" encoding="ISO-8859-1" standalone="no" ?>
<!DOCTYPE ichicsr SYSTEM "http://eudravigilance.ema.europa.eu/dtd/icsr21xml.dtd">
<ichicsr lang="en"> 
  <ichicsrmessageheader>
    <messagetype>ichicsr</messagetype>
    <messageformatversion>2.1</messageformatversion>
    <messageformatrelease>2.0</messageformatrelease>
    <messagenumb>CoVigilAITest</messagenumb>
    <messagesenderidentifier>ZZFDA</messagesenderidentifier>
    <messagereceiveridentifier>4CTEST</messagereceiveridentifier>
    <messagedateformat>204</messagedateformat>
    <messagedate>20240906200033</messagedate>
</ichicsrmessageheader>
<safetyreport>
    <safetyreportid>${data.nodes.report.safetyReportId}</safetyreportid>
    <primarysourcecountry>${data.nodes.report.primarySourceCountry}</primarysourcecountry>
    <occurcountry>${data.nodes.report.eventCountry}</occurcountry>
<transmissiondateformat>${data.nodes.report.transmissionDateFormat}</transmissiondateformat>
    <transmissiondate>${data.nodes.report.transmissionDate}</transmissiondate>
    <reporttype>${data.nodes.report.reportType}</reporttype>
    <serious>${data.nodes.report.serious}</serious>
    <receivedateformat>${data.nodes.report.recieveDateFormat}</receivedateformat>
    <receivedate>${data.nodes.report.dateFirstReceived}</receivedate>
    <receiptdate>${data.nodes.report.dateMostRecent}</receiptdate>
    <fulfillexpeditecriteria>${data.nodes.report.expeditedCriteria}</fulfillexpeditecriteria>
  
    <primarysource>
      <reportergivename>${data.nodes.reporter.reporterGiverName}</reportergivename>
      <reporterfamilyname>${data.nodes.reporter.reporterFamilyName}</reporterfamilyname>
      <reportercountry>${data.nodes.reporter.reporterCountry}</reportercountry>
      <qualification>${data.nodes.reporter.reporterQualification}</qualification>

</primarysource>
    <sender>
      <sendertype>${data.nodes.sender.senderType}</sendertype>                
      <senderorganization>${data.nodes.sender.senderOrganization}</senderorganization>
      <sendertitle>${data.nodes.sender.senderTitle}</sendertitle>
      <sendertelcountrycode>${data.nodes.sender.senderCountryCode}</sendertelcountrycode>
      <senderemailaddress>${data.nodes.sender.senderEmail}</senderemailaddress>
</sender>
    <receiver>

      <receivertype>${data.nodes.receiver.receiverType}</receivertype>
      <receiverorganization>${data.nodes.receiver.receiverOrganization}</receiverorganization>
      <receivergivename>${data.nodes.receiver.receiverGivename}</receivergivename>
      <receiverfamilyname>${data.nodes.receiver.receiverFamilyname}</receiverfamilyname>
      <receiverstreetaddress>${data.nodes.receiver.receiverStreetaddress}</receiverstreetaddress>
      <receivercity>${data.nodes.receiver.receiverCity}</receivercity>
      <receiverstate>${data.nodes.receiver.receiverState}</receiverstate>
      <receiverpostcode>${data.nodes.receiver.receiverPostcode}</receiverpostcode>
      <receivercountrycode>${data.nodes.receiver.receiverCountrycode}</receivercountrycode>
      <receivertel>${data.nodes.receiver.receiverTelphone}</receivertel>
      <receivertelcountrycode>${data.nodes.receiver.receiverTelcountrycode}</receivertelcountrycode>
      <receiveremailaddress>${data.nodes.receiver.receiverEmail}</receiveremailaddress>
</receiver>
    <patient>
      <patientinitial>${data.nodes.patient.patientName}</patientinitial>
      <patientonsetage>${data.nodes.patient.age}</patientonsetage>
      <patientagegroup>${data.nodes.patient.ageGroup}</patientagegroup>
      <patientsex>${data.nodes.patient.sex}</patientsex>
      
  
    <reaction>
          ${generateReactionDetailsForE2BR2(data.nodes.reaction)}
</reaction>
     
     
      <drug>
        <drugcharacterization>${data.nodes.drug.drugCharacterisation}</drugcharacterization>
        <medicinalproduct>${data.nodes.drug.productName}</medicinalproduct>
</drug>
     
     
      
      <summary>
        <narrativeincludeclinical>${data.nodes?.fullTextNarration?.summary}</narrativeincludeclinical>
</summary>
</patient>
</safetyreport>
</ichicsr>




     `;
};