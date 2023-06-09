import React, { useState } from 'react';
import './App.css';

import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ItemBox from './ItemBox';
import { getDayDiff, getItemForToday, shuffleArray, sortArrayAlphabetically } from './util';

import { divCards } from './data.mjs';
import { uniques } from './data.mjs';

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

function App() {
  const [quizItems, setQuizItems] = useState([]);
  const [quizItem, setQuizItem] = useState({});
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [mode, setMode] = useState('menu');
  const [guesses, setGuesses] = useState(0);
  const [guess, setGuess] = useState('');
  const [gameResult, setGameResult] = useState('');
  const [quizType, setQuizType] = useState('');
  const [revealItem, setRevealItem] = useState({
    flavorText: false,
    mods: false,
    name: false,
  });
  const [shareText, setShareText] = useState('');
  const [isEndlessQuiz, setIsEndlessQuiz] = useState(false);
  const [endlessQuizType, setEndlessQuizType] = useState('');
  const [correctGuesses, setCorrectGuesses] = useState(0);


  const handleDailyQuizChange = (dailyQuiz) => {
    switch (dailyQuiz) {
      case 'dailyUnique':
        setQuizType('dailyUnique');
        setQuizItem(getItemForToday(uniques));
        setAutocompleteOptions(sortArrayAlphabetically(uniques))
        break;
      case 'dailyDivination':
        setQuizType('dailyDivination');
        setQuizItem(getItemForToday(divCards));
        setAutocompleteOptions(sortArrayAlphabetically(divCards))
        break;
      default:
        break;
    }
  };


  const handleGuess = (guess) => {
    if (guess === '') return;

    if (isEndlessQuiz && guess === quizItems[correctGuesses].name) {
      setCorrectGuesses(correctGuesses + 1);
      return;
    }

    if (guess === quizItem.name) {
      setGameResult('won');
      setRevealItem({ name: true, mods: true, flavorText: true })

      setShareText(`Poedle #${getDayDiff()} - ${quizType === 'dailyUnique' ? 'Daily unique item' : 'Daily divination card'}\n${'🟥 '.repeat(guesses)}🟩\n${domain}`)

      return;
    }

    setGuesses(guesses + 1);

    if (guesses === 0) setRevealItem({ name: false, mods: false, flavorText: true })
    if (guesses === 1) setRevealItem({ name: false, mods: true, flavorText: true })

    if (guesses === 2) {
      setGameResult('lost');
      setRevealItem({ name: true, mods: true, flavorText: true })

      if (isEndlessQuiz) setShareText(`Poedle endless ${endlessQuizType} quiz\n${correctGuesses} correct guesses!\n${domain}`)
      else setShareText(`Poedle #${getDayDiff()} - ${quizType === 'dailyUnique' ? 'Daily unique item' : 'Daily divination card'}\n${'🟥 '.repeat(guesses + 1)}\n${domain}`)
      return;
    }



  }

  const handleChangeEndlessQuiz = (type) => {
    setIsEndlessQuiz(true);
    switch (type) {
      case 'unique':
        const shuffledQuizItems = [...uniques];
        shuffleArray(shuffledQuizItems);
        setQuizItems(shuffledQuizItems);
        setEndlessQuizType('unique');
        setAutocompleteOptions(sortArrayAlphabetically(uniques));
        break;
      case 'divination':
        const shuffledDivCards = [...divCards];
        shuffleArray(shuffledDivCards);
        setQuizItems(shuffledDivCards);
        setEndlessQuizType('divination');
        setAutocompleteOptions(sortArrayAlphabetically(divCards));
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
    setIsEndlessQuiz(false);
    setCorrectGuesses(0);
    setEndlessQuizType('');
  }


  return (
    <ThemeProvider theme={theme}>

      <Grid
        sx={{
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
        }}
        onClick={() => resetState()}
      >
        <Typography variant='h4'>Poedle</Typography>
      </Grid>

      <Container maxWidth='sm'>
        <Grid
          marginTop='3%'
          display='flex'
          flexDirection='column'
          alignItems='center'
          borderRadius='12px'
          // height='85vh'
          p={4}
          bgcolor='primary.main'
        >
          {mode === 'menu' && (
            <Grid marginTop={2} container spacing={3} justifyContent='center'>
              <Grid item xs={12}>
                <Button
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    bgcolor: 'button.main',
                    ':hover': { bgcolor: 'button.hover' },
                  }}
                  variant='contained'
                  className='styledButton'
                  onClick={() => {
                    setMode('quiz');
                    handleDailyQuizChange('dailyUnique');
                  }}
                >
                  Daily unique item
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    bgcolor: 'button.main',
                    ':hover': { bgcolor: 'button.hover' },
                  }}
                  variant='contained'
                  className='styledButton'
                  onClick={() => {
                    setMode('quiz');
                    handleDailyQuizChange('dailyDivination');
                  }}
                >
                  Daily Divination Card
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    bgcolor: 'button.main',
                    ':hover': { bgcolor: 'button.hover' },
                  }}
                  variant='contained'
                  className='styledButton'
                  onClick={(() => {
                    setMode('quiz');
                    handleChangeEndlessQuiz('unique');
                  })}
                >
                  Endless unique quiz
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    bgcolor: 'button.main',
                    ':hover': { bgcolor: 'button.hover' },
                  }}
                  variant='contained'
                  className='styledButton'
                  onClick={(() => {
                    setMode('quiz');
                    handleChangeEndlessQuiz('divination');
                  })}
                >
                  Endless divination quiz
                </Button>
              </Grid>
            </Grid>
          )}
          {mode === 'quiz' && (
            <>
              {isEndlessQuiz ? (
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
                  showName={revealItem.name}
                  showMods={revealItem.mods}
                  showFlavorText={revealItem.flavorText}
                />
              )}
              <Grid display='flex'>
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
              </Grid>
              {gameResult === '' ? (
                <Grid display='flex' marginTop={3}>
                  <Grid component='img' src={`${domain}images/Exalted_Orb_inventory_icon.png`} height={60} className={guesses >= 3 ? 'grayedOut' : 'normal'} />
                  <Grid component='img' src={`${domain}images/Exalted_Orb_inventory_icon.png`} height={60} className={guesses >= 2 ? 'grayedOut' : 'normal'} />
                  <Grid component='img' src={`${domain}images/Exalted_Orb_inventory_icon.png`} height={60} className={guesses >= 1 ? 'grayedOut' : 'normal'} />
                  {isEndlessQuiz && (
                    <Typography variant='h7' fontWeight='bold'>{correctGuesses + ' correct guesses'}</Typography>
                  )}
                </Grid>
              ) : (
                <Grid marginTop={3}>
                  <Typography variant='h4' fontWeight='bold'>{gameResult === 'won' ? 'You won!' : 'You lost :('}</Typography>
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
              )}
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
