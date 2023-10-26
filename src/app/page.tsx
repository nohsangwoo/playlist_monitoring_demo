"use client";

import { useState } from "react";
import Papa from "papaparse";

interface ownProps {}

export default function Home({}: ownProps) {
    const [youtubeData, setYoutubeData] = useState<{
        message?: string;
        data?: { imageUrl: string; videoUrl: string; title: string }[];
    }>();
    const [getYoutubeLoading, setGetYoutubeLoading] = useState(false);

    const onClickGetYoutubeData = async () => {
        setGetYoutubeLoading(true);
        const res = await fetch("http://localhost:3000/api/hello");
        const data = await res.json();
        console.log("data", data);
        setYoutubeData(data);
        setGetYoutubeLoading(false);
        // return data;
    };

    console.log("youtubeData", youtubeData);
    console.log("getYoutubeLoading", getYoutubeLoading);

    const downloadCSV = () => {
        if (!youtubeData?.data) return;
        /*  const flatData = logsData?.getLogs?.LOGS.map((log) => {
            return {
                FRST_REGR_EMPNO: log.FRST_REGR_EMPNO,
                FRST_REG_DT: log.FRST_REG_DT,
                LOG_CTT: log.LOG_CTT,
                LOG_ID: log.LOG_ID,
                LST_CHGR_EMPNO: log.LST_CHGR_EMPNO,
                LST_CHG_DT: log.LST_CHG_DT,
                USER_ID: log.USER_ID,
                FLOR_CNT: log.USER_TBL?.POSITION?.FLOR_CNT,
                LOC_CL_NM: log.USER_TBL?.POSITION?.LOC_CL_NM,
                SSO_ID: log.USER_TBL?.KEPCO_USER_TBL?.SSO_ID,
                SSO_EMPNO: log.USER_TBL?.KEPCO_USER_TBL?.SSO_EMPNO,
                SSO_USER_NM: log.USER_TBL?.KEPCO_USER_TBL?.SSO_USER_NM,
                MAIN_EMAIL_ADDR: log.USER_TBL?.KEPCO_USER_TBL?.MAIN_EMAIL_ADDR,
            };
        }); */
        // 오브젝트를 문자열로 변환
        const logsTransformed = youtubeData?.data;

        // 객체 배열을 CSV 문자열로 변환
        let csv = Papa.unparse(logsTransformed);

        // BOM 추가
        const BOM = "\uFEFF";
        csv = BOM + csv;

        // CSV 문자열을 파일로 다운로드
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", "log_data.csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <button
                className=" border border-black p-4 rounded-md"
                onClick={onClickGetYoutubeData}
            >
                fetch from url
            </button>
            <button
                className=" border border-black p-4 rounded-md"
                onClick={downloadCSV}
            >
                downloadCSV
            </button>

            <div className=" h-[20px]"></div>
            <div>
                {getYoutubeLoading ? (
                    <div>loading...</div>
                ) : (
                    <div>
                        {youtubeData?.data?.map((el, i) => {
                            return (
                                <div
                                    key={i}
                                    className=" p-5 border border-blue-500 rounded-xl mb-4"
                                >
                                    <div>title: {el.title}</div>
                                    <div>
                                        imageUrl: <img src={el.imageUrl} />
                                    </div>
                                    <div>videoUrl: {el.videoUrl}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
