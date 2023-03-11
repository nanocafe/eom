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
