'use client';

import axiosInstance from '@/common/axios-interceptor';
// import BatchForm from '@/components/e2b-reports/r3/BatchForm';
 import DrugForm from '@/components/e2b-reports/r2/DrugForm';
import ReportForm from '@/components/e2b-reports/r2/ReportForm';
import SenderForm from '@/components/e2b-reports/r2/SenderForm';
import { useEffect, useState } from 'react';
import { CONSTANTS } from '@/common/constants';
import NarrationForm from '@/components/e2b-reports/r2/NarrationForm';
import { IGetE2BR2Data } from '@/components/e2b-reports/r2/types';
import { createE2br2XML } from '@/components/e2b-reports/file/xml-export';
import ReporterForm from '@/components/e2b-reports/r2/ReporterForm';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/common/LoadingSpinner';
import RecievierForm from '@/components/e2b-reports/r2/RecievierForm';
import PatientForm from '@/components/e2b-reports/r2/PatientForm';
import ReactionEvent from '@/components/e2b-reports/r2/ReactionForm';

interface E2br2PageProps {
  params: { configid: string };
}

const E2br2Page = ({ params }: E2br2PageProps) => {
  const { configid } = params;
  const tenantData: string | null = localStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.TENANT_USER_ID
  );

  const { tenant_id } = tenantData ? JSON.parse(tenantData) : '';
  const searchParams = useSearchParams();
  const articleId = searchParams?.get('article') || 'Article-id';

  const [e2br2Data, setE2br2Data] = useState<IGetE2BR2Data>();
  const [savedNarration, setSavedNarration] = useState<string>('');
  const [xmlDownloadError, setXmlDownloadError] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createJsonTempalte = async () => {
      const response = await axiosInstance.post(`xml/nodes/create`, {
        tenant_id,
        config_id: configid,
        nodes: {
          patient: {},
          reaction: [],
          drug: {},
          summary: {},
          fullTextNarration: {},
          batch: {},
          report: {},
          sender: {},
          reporter: {},
        },
        etb_type: 'R2',
      });

      setE2br2Data(response.data);
    };

    const fetchSummaryNarration = async () => {
      try {
        const response = await axiosInstance.get(
          `xml/generate/nodes/narrative/${configid}`
        );
        setSavedNarration(response.data.narrative);
      } catch (error: any) {
        if (error) {
          setSavedNarration('-');
        }
      }
    };

    const fetchFulltextNarration = async () => {
      try {
        const response = await axiosInstance.get(
          `xml/generate/nodes/fte/narrative/${configid}`
        );
        setSavedNarration(response.data.narrative);
      } catch (error: any) {
        if (error.response.status === 400 || error.response.status === 500) {
          fetchSummaryNarration();
        }
      }
    };

    const fetchR2Data = async () => {
      try {
        const response = await axiosInstance.get(
          `xml/nodes/${configid}?etb_type=R2`
        );
        setE2br2Data(response.data);
      } catch (error: any) {
        if (error.response.status === 400) {
          createJsonTempalte();
        }
      }
    };

    const fetchAllData = async () => {
      try {
        setLoading(true);
        await fetchR2Data();
        await fetchFulltextNarration();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (configid) fetchAllData();
  }, [configid, tenant_id]);

  if (!configid) return <></>;

  return (
    <div className="min-h-screen p-4 overflow-y-auto">
      <div className="absolute top-4">
        <h2>E2BR2 Report Form</h2>
        <h3>Article ID {articleId}</h3>
      </div>
      {loading && <LoadingSpinner></LoadingSpinner>}
      {e2br2Data && (
        <div className="space-y-6">
          <div className="flex gap-2 items-center">
            <button
              className="py-2 px-6 rounded-md bg-yellow text-white"
              onClick={() => {
                const link = createE2br2XML(e2br2Data, articleId);
                if (link.error) {
                  setXmlDownloadError(link.error);
                }
              }}
            >
              Export XML
            </button>
            <div>
              {xmlDownloadError && (
                <p className="text-sm text-rose-800">{xmlDownloadError}</p>
              )}
            </div>
          </div>
          <p className="text-[14px] text-buttonGray">
            Fields marked * are mandatory
          </p>
          <ReportForm savedDetails={e2br2Data} />
          <SenderForm savedDetails={e2br2Data} />
          <RecievierForm savedDetails={e2br2Data}/>
          <PatientForm savedDetails={e2br2Data} />
          <ReactionEvent savedDetails={e2br2Data} />

           <ReporterForm savedDetails={e2br2Data} /> 

           <DrugForm savedDetails={e2br2Data} /> 
          {savedNarration.length > 0 && (
            <NarrationForm
              savedDetails={e2br2Data}
              savedNarration={savedNarration}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default E2br2Page;
