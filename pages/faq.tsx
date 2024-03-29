import {
  ArrowLeftCircleIcon,
  ChevronDownIcon,
  HomeIcon,
} from "@heroicons/react/20/solid";
import Button from "components/Button";
import Layout from "components/Layout";
import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

const faqs = [
  {
    summary: <h2>What is EOM?</h2>,
    details: (
      <ul>
        <li>
          EOM is short for End Of the Month. It is a game where the goal is to
          guess what the price of XNO will be by the end of each month.
        </li>
        <br></br>
        <li>
          The winner is the person whose guess comes closest to the actual price
          of XNO at the end of that month.
        </li>
        <br></br>
        <li>
          What makes EOM unique is that because of its' game mechanics, someone
          has to win every month regardless of what the price of XNO is by
          simply having the closest distance among all other players in the
          contest.
        </li>
      </ul>
    ),
  },
  {
    summary: <h2>When can you enter EOM?</h2>,
    details: (
      <ul>
        <li>• EOM is a monthly contest.</li>
        <br></br>
        <li>
          • You may enter the contest from the 1st of each month until the 7th
          (subject to change).
        </li>
        <br></br>
        <li>
          • After the last day for entries, EOM gets closed and no additional
          players may enter the contest.
        </li>
      </ul>
    ),
  },
  {
    summary: <h2>Is the game fair?</h2>,
    details: (
      <ul>
        <li>
          • It is fair because the winner is based solely on the actual price of
          XNO which is determined by the market forces outside of our control or
          influence.
        </li>
        <br></br>
        <li>
          • All participants in the competition have the same information
          regarding the performance history of XNO.
        </li>
        <br></br>
        <li>
          • There is a{" "}
          <a
            href="/transparency"
            target="_blank"
            className="text-gold hover:underline"
          >
            snapshot
          </a>{" "}
          available to download and view after every contest is completed; you
          can verify no tampering took place in the contest using checksum (md5
          and sha256).
        </li>
        <br></br>
        <li>
          • EOM is an open-source project. There is complete transparency. Any
          game participant can see the code being used on{" "}
          <a
            href="https://github.com/nanocafe/eom"
            target="_blank"
            className="text-gold hover:underline"
          >
            Github
          </a>
          .
        </li>
      </ul>
    ),
  },
  {
    summary: <h2>How much does it cost to participate in EOM?</h2>,
    details: (
      <p>
        The current entry fee for April 2023 is 0.05XNO.<br></br>50% (0.025XNO)
        of this entry fee gets added to increase current reward.
      </p>
    ),
  },
  {
    summary: <h2>What is the Entry Fee used for?</h2>,
    details: (
      <ul>
        <li>• 50% to increase the current available reward.</li>
        <br></br>
        <li>• 35% to help with expenses for maintenance & operations.</li>
        <br></br>
        <li>• 10% to help for development.</li>
        <br></br>
        <li>• 5% to fund XNO community initiatives.</li>
      </ul>
    ),
  },
  {
    summary: <h2>Where and when is the price of XNO pulled from?</h2>,
    details: (
      <p>
        The price is pulled from the{" "}
        <Link href="https://www.coingecko.com/en/coins/nano">
          <a className="text-gold hover:underline" target="_blank">
            {" "}
            coinGecko API
          </a>
        </Link>
        . <br />
        It is requested during the last day of the month and typically is
        available between 4:55AM – 5:05AM UTC. <br />
      </p>
    ),
  },
  {
    summary: <h2>Can I see the full rules and guidelines for EOM?</h2>,
    details: (
      <p>
        You can download and view the full rules and guidelines{" "}
        <Link href="/docs/competition-rules-and-guidelines.pdf">
          <a className="text-gold hover:underline" target="_blank">
            here
          </a>
        </Link>
        .
      </p>
    ),
  },
  {
    summary: <h2>Contact</h2>,
    details: (
      <p>
        You can email saizo@nanocafe.cc for any help, questions, suggestions or
        all other inquiries.
      </p>
    ),
  },
];

export default function Transparency() {
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
      <div className="p-2">
        <Link href="/">
          <a className="text-base py-1 rounded-sm text-gold flex items-center space-x-1">
            <ArrowLeftCircleIcon className="h-5 w-5" />
            <span>Back</span>
          </a>
        </Link>
      </div>

      <div className="mt-4">
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            className="!mb-4 !rounded-xl !bg-dim-gray !shadow-lg"
            disableGutters={true}
            elevation={0}
            sx={{
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDownIcon className="h-6 w-6" />}
              className="!font-bold !text-lg"
            >
              {faq.summary}
            </AccordionSummary>
            <AccordionDetails className="w-full border-t border-alt-gray/70">
              {faq.details}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Layout>
  );
}
