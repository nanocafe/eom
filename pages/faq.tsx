import {
  ArrowLeftCircleIcon,
  ChevronDownIcon,
  HomeIcon,
} from '@heroicons/react/20/solid'
import Button from 'components/Button'
import Layout from 'components/Layout'
import Link from 'next/link'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

const faqs = [
  {
    summary: <h2>What is EOM and how do you win it?</h2>,
    details: (
      <h2>
        EOM is short for End of the Month. This is a competition where you guess
        what the price of XNO will be by the end of the month.
        <br></br>
        <br></br>If you guess the closest match in either distance or exactness
        to the price of XNO at the end of the month, then you win the
        competition!
      </h2>
    ),
  },
  {
    summary: <h2>When does the competition open</h2>,
    details: (
      <p>
        The competition opens on the first day of every month (can be changed),
        it is open from then till the 7th day of the corresponding month.
        <br></br>
        <br></br>
        After the 7th day, EOM gets locked and no new players are able to enter.
        <br></br>
        <br></br>
        EOM is locked from the 7th day till the final day of the corresponding
        month, more info on the exact time is available in the rules &
        guidelines.
      </p>
    ),
  },
  {
    summary: <h2>How is this competition fair and what risks are involved?</h2>,
    details: (
      <p>
        This competiton is entirely fair because it depends on larger economic
        forces outside of our control for determining the winner of the
        competition. <br></br>
        We do not control what the price of XNO is and we are not able to ever
        control it.<br></br>
        <br></br>
        Additionally, all the players in a competition have a historical
        snapshot to reference so that no new users or players are added to the
        competition after the date of competition being locked to its
        corresponding month.
        <br></br>
        <br></br>EOM is also an open-source project, we have full honesty and
        transparency. For this reason, anyone is able to see the code being used{' '}
        <a
          href="https://github.com/nanocafe/eom"
          target="_blank"
          className="text-gold hover:underline"
        >
          here on Github
        </a>
        .<br></br>
        <br></br>
        The risks involved are that you are not guaranteed to win the
        competition. And because of larger economic forces, it is extremely
        difficult to predict the value of XNO at any date or time for that
        matter.
      </p>
    ),
  },
  {
    summary: <h2>What is the entry fee for EOM?</h2>,
    details: (
      <p>
        The current entry fee for February 2023 EOM competition is 0.01XNO.
      </p>
    ),
  },
  {
    summary: (
      <h2>Can I see the full rules and guidelines for EOM?</h2>
    ),
    details: (
      <p>
        You can download and view the full rules and guidelines {' '}
        <Link href="https://drive.proton.me/urls/V9EBR4FCK4#8hRMWMA2P9Vm">
          <a className="text-gold hover:underline">here</a>
        </Link>
        .
      </p>
    ),
  },
]

export default function Transparency() {
  return (
    <Layout
      navbarOption={
        <Link href="/">
          <a>
            <Button
              style={{
                width: '100px',
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
              '&:before': {
                display: 'none',
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
  )
}
