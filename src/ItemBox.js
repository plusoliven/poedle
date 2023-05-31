import React from 'react';

import {
    Grid,
    Typography,
} from '@mui/material';

const domain = 'https://plusoliven.github.io/poedle/'

export default function ItemBox(props) {
    const { name, img, mods, flavorText, showName, showMods, showFlavorText } =
        props;

    return (
        <Grid
            display='flex'
            flexDirection='column'
            alignItems='center'
            marginBottom={2}
        >
            <Grid height={30}>
                <Typography
                    variant='h6'
                    component='div'
                    fontWeight='bold'
                    marginBottom={2}
                >
                    {showName ? name : ''}
                </Typography>
            </Grid>
            <Grid
                width='400'
                minWidth='400'
                height='300'
                minHeight='300'
                component='img'
                src={domain + img}
                marginBottom={2}
                borderRadius='12px'
                style={{
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <Grid
                width={365}
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
            <Grid minHeight={50} marginTop={2} width={390}>
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
