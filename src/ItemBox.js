import React from 'react';

import {
    Grid,
    Typography, Container
} from '@mui/material';

const domain = window.location.hostname.includes('localhost') ? 'http://localhost:3000/poedle/' : 'https://plusoliven.github.io/poedle/'

export default function ItemBox(props) {
    const { name, img, mods, flavorText, showName, showMods, showFlavorText } =
        props;

    return (
        <Grid
            display='flex'
            flexDirection='column'
            alignItems='center'
            marginBottom={2}
            container
        >
            <Grid
                item
                minHeight={40}
                xs={12}>
                <Typography
                    variant='h6'
                    component='div'
                    fontWeight='bold'
                    marginBottom={0}
                >
                    {showName ? name : ''}
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                minHeight='300'
                component='img'
                src={domain + img}
                marginBottom={2}
                borderRadius={4}
                style={{
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <Grid
                item
                xs={12}
                padding={2}
                minHeight={150}
                style={{ backgroundColor: '#232935', borderRadius: '12px' }}
            >
                {showMods &&
                    mods &&
                    mods.map((mod) => {
                        return (
                            <Typography key={mod.modStr} sx={{ color: mod.modColor }}>
                                {mod.modStr}
                            </Typography>
                        );
                    })}
            </Grid>
            <Grid item xs={12} minHeight={50} marginTop={2}>
                {showFlavorText && flavorText && (
                    <Typography
                        variant='body1'
                        style={{ fontStyle: 'italic', color: '#FFA500' }}
                    >
                        {flavorText}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
}
