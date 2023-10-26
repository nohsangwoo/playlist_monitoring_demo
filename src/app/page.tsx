"use client";

import { useState } from "react";

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
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <button
                className=" border border-black p-4 rounded-md"
                onClick={onClickGetYoutubeData}
            >
                fetch from url
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
