import {
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon,
} from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import Button from "components/Button";
import Layout from "components/Layout";
import Link from "next/link";
import API from "services/api";

export default function Transparency() {
  const {
    data: competitions,
    isLoading,
    isError,
    error,
  } = useQuery(["competitions"], () => API.get("/competitions"));

  if (isLoading) return <Layout>Loading...</Layout>;

  const monthName = (year: number, month: number) => {
    return new Date(year, month - 1, 1).toLocaleString("default", {
      month: "long",
    });
  };

  return (
    <Layout
      navbarOption={
        <Link href="/">
          <a>
            <Button
              style={{
                width: "100px",
              }}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </Button>
          </a>
        </Link>
      }
    >
      <section className="my-2 py-6 px-2 border-b border-dim-gray">
        <h2 className="text-xl text-gold">Competition Rules and Guidelines</h2>
        <p className="text-sm text-gray-200">Updated 26th March 2023</p>
        <div className="flex justify-center sm:justify-start mt-4">
          <a
            href="/docs/competition-rules-and-guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              startIcon={<ArrowDownTrayIcon className="text-white w-5 h-5" />}
            >
              Download PDF
            </Button>
          </a>
        </div>
      </section>
      <section className="my-2 py-4 px-2">
        <h2 className="text-2xl text-gold">Snapshots</h2>
        <ul className="py-4 px-2 flex-col divide-y divide-dim-gray">
          {Object.keys(competitions)?.map((year) =>
            Object.keys(competitions[year])?.map((month) => (
              <li key={month} className="text-white hover:text-gold">
                <Link href={`/snapshots/${year}/${month}`}>
                  <a className="flex">
                    <div className="w-full flex space-x-4 py-2">
                      <div className="w-32 font-semibold">
                        {year}, {monthName(Number(year), Number(month))}
                      </div>
                      <div className="flex-1 text-center">
                        <span className="font-semibold">
                          {competitions[year][month]}
                        </span>{" "}
                        guesses
                      </div>
                      <div>
                        <DocumentMagnifyingGlassIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </Layout>
  );
}
