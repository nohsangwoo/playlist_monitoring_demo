import type { NextApiRequest, NextApiResponse } from "next";
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
type ResponseData = {
    message?: string;
    data?: {
        imageUrl: string;
        videoUrl: string;
        title: string;
    }[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let counter = 0;
    let yt_data: {
        imageUrl: string;
        videoUrl: string;
        title: string;
    }[] = [];

    const runScraper = async () => {
        // launch puppeteer browser

        const browser = await puppeteer.launch({
            headless: false,
            // defaultViewport: null,
            // args: ["--start-maximized"],
        });

        const page = await browser.newPage();

        // set browser viewport to 1800x1000
        await page.setViewport({ width: 1800, height: 3000 });

        // go to url

        const endpoint =
            "https://www.youtube.com/feed/trending?bp=4gINGgt5dG1hX2NoYXJ0cw%3D%3D";

        await page.goto(endpoint, { waitUntil: "domcontentloaded" });

        // wait 3 seconds
        wait(5000);

        // extract data
        await scrapeData(page);
    };

    // wait function
    const wait = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // scrape data
    const scrapeData = async (page: any) => {
        const $ = cheerio.load(await page.content());

        if (!(await page.$("#grid-container ytd-video-renderer"))) {
            counter++;
            console.log(
                `can\'t find category selector... Running retry number${counter}`
            );
            if (counter < 3) {
                // wait 2 seconds and try again
                await wait(3000);
                await scrapeData(page);
            } else {
                console.log(`Unable to find category selector... Moving on.`);
                counter = 0;
            }
        }

        const yt_list = await $("#grid-container ytd-video-renderer");
        await wait(2000);

        yt_list.each((i: any, el: any) => {
            if (i >= 20) {
                return;
            }
            // img태그안의 scr속성의 내용을 가져옴.
            const imageUrl = $(el).find("img").attr("src");
            const baseVideoUrl = "https://www.youtube.com";
            let videoUrl = $(el).find("#thumbnail").attr("href").trim();
            videoUrl = baseVideoUrl + videoUrl;

            const title = $(el).find("#title-wrapper").text().trim();
            const yt = {
                imageUrl,
                videoUrl,
                title,
            };
            yt_data.push(yt);
        });
        await wait(2000);

        console.log("yt_data inside: ", yt_data);
        res.status(200).json({
            message: "Hello from Next.js!",
            data: yt_data,
        });
    };

    await runScraper(); // runScraper 함수가 완료될 때까지 기다림

    console.log("yt_data outside: ", yt_data);

    res.status(200).json({
        message: "Hello from Next.js!asdfasd2222",
        data: yt_data,
    });
}
