import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ProjectInfoForm from '../components/upload/ProjectInfo';
import ProjectUploadFileForm from '../components/upload/ProjectUploadFile';
import ProjectTeamSelectionForm from '../components/upload/ProjectTeamSelection';
import { useState } from 'react';

const steps = ['Team Details', 'Project Details', 'Project Files', 'Upload'];





export default function Upload() {
  const [activeStep, setActiveStep] = useState(0);
  const[team, setTeam] = useState('');
  const[projectInfo, setProjectInfo] = useState('');
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const teamToUpload = (teamData: any) => {
    //Stores Team Info into Team State
    setTeam(teamData);
    //Navigates to next page
    handleNext();
    
  }

  const projectInfoToUpload = (projectInfoData: any) => {
    //Stores Project Info into Project State
  
    //Navigates to next page
    handleNext();
    
  }
  function getStepContent(step: number) {
    switch (step) {
      case 0: 
        return <ProjectTeamSelectionForm teamToUpload={teamToUpload}/>;
      case 1:
        return <ProjectInfoForm  />;
      case 2: 
        return <ProjectUploadFileForm />; 
      default:
        throw new Error('Unknown step');
    }
  }

  return (

      <Container maxWidth="md"  sx={{mt: 20, mb: 4}}>
        <Paper variant="outlined" sx={{my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Upload your Project
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length - 1 ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Your Project has been uploaded.
              </Typography>
              <Typography variant="subtitle1">
                Redirecting now to your new project page...
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>

      </Container>
  
  );
}