import RunScraperButton from "./components/RunScraperButton";

interface ownProps {
    searchParams: URLSearchParams;
}

export default function Home({ searchParams }: ownProps) {
    console.log("searchParams", searchParams);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <RunScraperButton />
        </main>
    );
}
