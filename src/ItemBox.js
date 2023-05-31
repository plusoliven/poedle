import React, { useState } from 'react';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Icon,
    TextField,
    Typography,
    Autocomplete,
} from '@mui/material';

const domain = 'http://localhost:3000/poedle/'

export default function ItemBox(props) {
    const { name, img, mods, flavorText, showName, showMods, showFlavorText } =
        props;

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            marginBottom={2}
        >
            <Box height={30}>
                <Typography
                    variant='h6'
                    component='div'
                    fontWeight='bold'
                    marginBottom={2}
                >
                    {showName ? name : ''}
                </Typography>
            </Box>
            <Box
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
            <Box
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
            </Box>
            <Box minHeight={50} marginTop={2} width={390}>
                {showFlavorText && flavorText && (
                    <Typography
                        variant='body1'
                        style={{ fontStyle: 'italic', color: '#FFA500' }}
                    >
                        {flavorText}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
