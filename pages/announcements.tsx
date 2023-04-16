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
          4/16/2023: The April 2023 EOM contest is now officially locked, no new
          entries can be made and the winner will be decided on the final day of
          the month. The official reward is 120.015XNO available.
          <br></br>
        </li>
        <br></br>
        <li>
          Currently XNO.BET is very behind on features and looking for
          additional help, if you (or anyone you know) are familiar with
          Typescript and interested in helping out <br></br>(will get paid in
          XNO) please contact saizo@nanocafe.cc or you can see the bounty below
          available for different tasks.
        </li>
        <br></br>
        <li>XNO.BET Current Bounty (listed by difficulty)</li>
        <br></br>
        <li>
          1. Fix search bar so users can search a guess by either name or guess
          price. (20XNO)
        </li>
        <li>
          2. Display the distance of each guess to the current price of XNO on
          each row besides the $ Price Guessed (+/-). (20XNO)
        </li>
        <li>
          3. Display what the total XNO reward was for the given month on the
          transparency page & also the real reward won by the winner. (15XNO)
        </li>
        <li>
          4. Add a ticker box before a user can click the submit button on the
          Enter screen; can be a pop up or a link to Rules & Guidelines. (10XNO)
        </li>
        <li>
          5. Add a $ value for the reward in the home screen & the cost of the
          entry fee in $ on the Enter screen. (10 XNO)
        </li>
        <li>
          6. Add a countdown timer for after contest gets locked displaying time
          till end of the month. (10 XNO)
        </li>
        <br></br>
        <li>
          To submit a bounty, simply go to XNO.BET's{" "}
          <Link href="https://github.com/nanocafe/eom">
            <a className="text-gold hover:underline" target="_blank">
              Github
            </a>
          </Link>{" "}
          and create a pull request with your updated code along with the task #
          & XNO address on the description.
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
