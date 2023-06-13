import React, { useState } from 'react';
import './App.css';

import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Divider,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ItemBox from './ItemBox';
import { getDayDiff, getItemForToday, getTimeUntilReset, shuffleArray, sortArrayAlphabetically } from './util';

import { divCards } from './data.mjs';
import { uniques } from './data.mjs';
import QuizSelection from './QuizSelection';

const domain = window.location.hostname.includes('localhost') ? 'http://localhost:3000/poedle/' : 'https://plusoliven.github.io/poedle/'
const version = '0.3'



const theme = createTheme({
  palette: {
    primary: {
      main: '#343c49',
    },
    secondary: {
      main: '#ffffff',
    },
    button: {
      main: '#c47237',
      hover: '#e98640',
    },
    submitButton: {
      main: '#4ad62b',
      hover: '#51f52c'
    }
  },
});

const styles = {
  poedleHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    bgcolor: 'darkgray',
    borderRadius: '8px',
    marginTop: '1%',
    paddingLeft: '10px',
    paddingRight: '10px',
    color: 'white',
    cursor: 'pointer',
  }
}

function App() {
  const [mode, setMode] = useState('menu');
  const [quizType, setQuizType] = useState('');

  const [quizItems, setQuizItems] = useState([]);
  const [quizItem, setQuizItem] = useState({});

  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  const [guesses, setGuesses] = useState(0);
  const [guess, setGuess] = useState('');
  const [correctGuesses, setCorrectGuesses] = useState(0);

  const [revealItem, setRevealItem] = useState({
    flavorText: false,
    mods: false,
    name: false,
  });

  const [gameResult, setGameResult] = useState('');

  const [shareText, setShareText] = useState('');


  const handleGuess = (guess) => {
    if (guess === '') return;

    if (quizType.includes('Endless') && guess === quizItems[correctGuesses].name) {
      setCorrectGuesses(correctGuesses + 1);
      return;
    }

    if (guess === quizItem.name) {
      setGameResult('won');
      setRevealItem({ name: true, mods: true, flavorText: true })

      updateShareText();

      return;
    }

    setGuesses(guesses + 1);

    if (guesses === 0) setRevealItem({ name: false, mods: false, flavorText: true })
    if (guesses === 1) setRevealItem({ name: false, mods: true, flavorText: true })

    if (guesses === 2) {
      setGameResult('lost');
      setRevealItem({ name: true, mods: true, flavorText: true })
      updateShareText();
    }
  }

  const updateShareText = () => {
    let shareTextBuild = `Poedle #${getDayDiff()} - `
    switch (quizType) {
      case 'uniqueDaily':
        shareTextBuild += `Daily unique quiz\n${'🟥 '.repeat(guesses + 1)}\n${domain}`
        break;
      case 'divinationDaily':
        shareTextBuild += `Daily divination card quiz\n${'🟥 '.repeat(guesses + 1)}\n${domain}`
        break;
      case 'uniqueEndless':
        shareTextBuild += `Endless unique quiz\n${correctGuesses} correct guesses!\n${domain}`
        break;
      case 'divinationEndless':
        shareTextBuild += `Endless divination card quiz\n${correctGuesses} correct guesses!\n${domain}`
        break;
      default:
        break;
    }

    setShareText(shareTextBuild);
  }

  const handleChangeEndlessQuiz = (quiz) => {
    let quizArray;
    let autocompleteArray;

    switch (quiz) {
      case 'unique':
        quizArray = [...uniques];
        autocompleteArray = [...uniques];
        break;
      case 'divination':
        quizArray = [...divCards];
        autocompleteArray = [...divCards];
        break;
      default:
        break;
    }

    shuffleArray(quizArray);
    setQuizItems(quizArray);
    setAutocompleteOptions(sortArrayAlphabetically(autocompleteArray));
  }


  const handleChangeQuiz = (quiz) => {
    setQuizType(quiz);
    setMode('quiz');

    switch (quiz) {
      case 'uniqueDaily':
        setQuizItem(getItemForToday(uniques));
        setAutocompleteOptions(sortArrayAlphabetically(uniques))
        break;
      case 'divinationDaily':
        setQuizItem(getItemForToday(divCards));
        setAutocompleteOptions(sortArrayAlphabetically(divCards));
        break;
      case 'uniqueEndless':
        handleChangeEndlessQuiz('unique');
        break;
      case 'divinationEndless':
        handleChangeEndlessQuiz('divination');
        break;
      default:
        break;
    }
  }

  const resetState = () => {
    setMode('menu');
    setGuesses(0);
    setGuess('');
    setGameResult('');
    setRevealItem({ name: false, mods: false, flavorText: false })
    setShareText('');
    setCorrectGuesses(0);
  }


  return (
    <ThemeProvider theme={theme}>

      <Grid
        sx={styles.poedleHeader}
        onClick={() => resetState()}
      >
        <Typography variant='h4'>Poedle</Typography>
      </Grid>

      <Container maxWidth='sm'>
        <Grid
          marginTop={3}
          display='flex'
          flexDirection='column'
          borderRadius={3}
          p={4}
          bgcolor='primary.main'
          container
        >
          {mode === 'menu' && (
            <>
              <Typography variant='h5' textAlign='center'>Day {getDayDiff()}</Typography>
              <QuizSelection handleChangeQuiz={handleChangeQuiz} />
              <Typography marginTop={5} textAlign='center' >{getTimeUntilReset()} until reset</Typography>
            </>
          )}
          {mode === 'quiz' && (
            <>
              {quizType.includes('Endless') ? (
                <ItemBox
                  name={quizItems[correctGuesses].name}
                  img={quizItems[correctGuesses].imgPath}
                  mods={quizItems[correctGuesses].mods}
                  flavorText={quizItems[correctGuesses].flavorText}
                  showName={revealItem.name}
                  showMods={revealItem.mods}
                  showFlavorText={revealItem.flavorText}
                />
              ) : (
                <ItemBox
                  name={quizItem.name}
                  img={quizItem.imgPath}
                  mods={quizItem.mods}
                  flavorText={quizItem.flavorText}
                  showName={true}
                  showMods={true}
                  showFlavorText={true}
                // showName={revealItem.name}
                // showMods={revealItem.mods}
                // showFlavorText={revealItem.flavorText}
                />
              )}
              {/* <Grid display='flex'>
                <Autocomplete
                  disabled={gameResult !== ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: 326 }}
                      label='Guess'
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                        },
                      }}
                      InputLabelProps={{
                        style: { color: '#FFFFFF' },
                      }}
                      disabled={gameResult !== ''}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleGuess(guess);
                        }
                      }}
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: '150px',
                    },
                  }}
                  options={autocompleteOptions}
                  onChange={(event, value) => setGuess(value)}
                />
                <Button
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    bgcolor: 'submitButton.main',
                    ':hover': { bgcolor: 'submitButton.hover' },
                    width: 10,
                  }}
                  variant='contained'
                  className='styledButton'
                  onClick={() => {
                    handleGuess(guess);
                  }}
                >Submit</Button>
              </Grid> */}
              {/* {gameResult === '' ? (
                <Grid display='flex' marginTop={3}>
                  <Grid component='img' src={`${domain}images/Exalted_Orb_inventory_icon.png`}
                    height={60} className={guesses >= 3 ? 'hpImgGrayed' : 'hpImgNormal'} />
                  <Grid component='img' src={`${domain}images/Exalted_Orb_inventory_icon.png`}
                    height={60} className={guesses >= 2 ? 'hpImgGrayed' : 'hpImgNormal'} />
                  <Grid component='img' src={`${domain}images/Exalted_Orb_inventory_icon.png`}
                    height={60} className={guesses >= 1 ? 'hpImgGrayed' : 'hpImgNormal'} />
                  {quizType.includes('Endless') && (
                    <Typography variant='h7' fontWeight='bold'>{correctGuesses + ' correct guesses'}</Typography>
                  )}
                </Grid>
              ) : (
                <Grid marginTop={3} textAlign='center'>
                  <Typography variant='h4' fontWeight='bold'>{gameResult === 'won' ? 'You won!' : 'You lost :('}</Typography>
                  <br></br>
                  <Grid
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TextField
                      multiline
                      fullWidth
                      value={shareText}
                      InputProps={{
                        readOnly: true,
                        style: {
                          color: '#FFFFFF',
                        },
                      }}
                      sx={{
                        marginRight: 2,
                      }}
                    />
                    <Button variant='contained' onClick={() => navigator.clipboard.writeText(shareText)}>Share results</Button>
                  </Grid>

                </Grid>
              )} */}
            </>
          )}
        </Grid>

        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            padding: 15,
          }}
        >
          <div
            style={{
              marginBottom: -40,
              color: 'darkgray',
              fontSize: 10
            }}
          >
            v.{version}<br />This site is not affiliated with Grinding Gear Games or Path of Exile. All resources and images used belong to Grinding Gear Games.
          </div>

          <a
            href='https://github.com/plusoliven/poedle'
            target='_blank'
            rel='noopener noreferrer'
          >
            <GitHubIcon fontSize='large' style={{ color: '#ffffff' }} />
          </a>
        </footer>
      </Container>
    </ThemeProvider >
  );
}

export default App;
