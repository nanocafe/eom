import { ArrowLeftCircleIcon, HomeIcon } from '@heroicons/react/20/solid'
import Button from 'components/Button'
import Layout from 'components/Layout'
import Link from 'next/link'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


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
      
      <div>
      <Link href="/">
            <a className="text-base py-1 rounded-sm text-gold flex items-center space-x-1">
              <ArrowLeftCircleIcon className="h-5 w-5" />
              <span>Back</span>
            </a>
          </Link>
      <br></br>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>What is EOM and how do you win it?</Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-dim-gray">
          <Typography>
            EOM is short for End of the Month. This is a competition where you guess what the price of XNO will be by the end of the month. 
            <br></br>
            <br></br>If you guess the closest match in either distance or exactness to the price of XNO at the end of the month, then you win the competition!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>When does the competition open</Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-dim-gray">
          <Typography>
            The competition opens on the first day of every month (can be changed), it is open from then till the 7th day of the corresponding month.<br></br><br></br>
            After the 7th day, EOM gets locked and no new players are able to enter.<br></br>
            <br></br>
            EOM is locked from the 7th day till the final day of the corresponding month, more info on the exact time is available on the PDF of rules & Guidelines.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>How is this competition fair and what risks are involved?</Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-dim-gray">
          <Typography>
            This competiton is entirely fair because it depends on larger economic forces outside of our control for determining the winner of the competition. <br></br>
            We do not control what the price of XNO is and we are not able to ever control it.<br></br><br></br>
            Additionally, all the players in a competition have a historical snapshot to reference so that no new users or players are added to the competition after the date of competition being locked to its corresponding month.
            <br></br><br></br>EOM is also an open-source project, we have full honesty and transparency. For this reason, anyone is able to see the code being used <a href="https://github.com/nanocafe/eom" target="_blank">here</a>.
          
          
            <br></br><br></br>
            The risks involved are that you are not guaranteed to win the competition. And because of larger economic forces, it is extremely difficult to predict the value of XNO at any date or time for that matter.
          
          
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>What is the entry fee for EOM?</Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-dim-gray">
          <Typography>
            The current entry fee for February 2023 EOM competition is 0.07XNO, which is currently $
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Can I see the full rules and guidelines for this competition?</Typography>
        </AccordionSummary>
        <AccordionDetails className="bg-dim-gray">
          <Typography>
          You can view the full rules and guidelines <a href="#" target="_blank">here</a>.
          </Typography>
        </AccordionDetails>
      </Accordion>

      </div>
    </Layout>
  )
}
