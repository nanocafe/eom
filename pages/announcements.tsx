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
    summary: <h2>Recent Announcements & Updates</h2>,
    details: (
      <ul>
        <li>
          4/01/2023: Congratulations to the winner of the March contest, user
          gargakk with a submitted guess price of $0.87 was the closest to the
          final pulled price of $0.881! This guess was the closest in distance
          by -0.011. Because this is a non-exact guess, the total won will be
          37.74XNO (57.19 * 66%). The remainder 19.44XNO (57.19 * 34%) will be
          used for April's contest. The payout will be made within 1-2 days
          after reviewing.
          <br></br>
          <br></br>
          The April contest will be shortly reflected on the homepage and more
          details will be available sometime later today.
        </li>
        <br></br>
        <li>
          3/29/2023: There is currently service disruption on the coinGecko API
          which is causing the results on contest and price ticker to not
          update, this will fix itself once the coinGecko API is running without
          issues. More info available at{" "}
          <a href="https://status.coingecko.com/" target="_blank">
            here
          </a>
          .
        </li>
        <br></br>
        <li>
          3/26/2023: Contest will be ending on the 31st, another announcement
          will be made shortly after the March contest ends regarding the
          winner, reward for next month along with when the contest is expected
          to be open.
        </li>
        <br></br>
        <li>
          3/10/2023: Due to some issues previously when contest opened, March is
          still mainly for testing and development. To accomodate for this, the
          days are now extended to allow additional entries until 3/15/2023. The
          only way to enter currently is through the nanobyte (desktop) or
          nautilus (mobile-android) wallets.
        </li>
      </ul>
    ),
  },
];

export default function Announcements() {
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
            expanded={true}
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
