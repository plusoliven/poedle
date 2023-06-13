// import './QuizSelection.css'
import React from 'react';

import { Grid, Button } from '@mui/material';


const styles = {
    quizButton: {
        backgroundColor: '#c47237',
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '14px',
        '&:hover': {
            backgroundColor: '#e98640',
        },
    },
}

export default function QuizSelection(props) {
    const { handleChangeQuiz } = props;

    return (
        <Grid marginTop={-2} container spacing={3} justifyContent='center'>
            <Grid item xs={12}>
                <Button
                    fullWidth
                    variant='contained'
                    onClick={() => handleChangeQuiz('uniqueDaily')}
                    sx={styles.quizButton}
                >
                    Daily unique item
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    fullWidth
                    variant='contained'
                    sx={styles.quizButton}
                    onClick={() => handleChangeQuiz('divinationDaily')}
                >
                    Daily divination card
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    fullWidth
                    variant='contained'
                    sx={styles.quizButton}
                    onClick={() => handleChangeQuiz('oddOneOut')}
                >
                    Odd one out
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button
                    fullWidth
                    variant='contained'
                    sx={styles.quizButton}
                    onClick={(() => handleChangeQuiz('uniqueEndless'))}
                >
                    Endless unique quiz
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button
                    fullWidth
                    variant='contained'
                    sx={styles.quizButton}
                    onClick={(() => handleChangeQuiz('divinationEndless'))}
                >
                    Endless divination quiz
                </Button>
            </Grid>
        </Grid>
    )
}