import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@mui/material';

export const LegalSection = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            {title}
        </Typography>
        <Box sx={{ color: 'text.secondary', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{children}</Box>
    </Box>
);

export const LegalLayout = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => (
    <Container maxWidth="md" sx={{ py: 6 }}>
        <Helmet>
            <title>{title} | EventFinder</title>
        </Helmet>
        <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
            {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            עודכן לאחרונה: 26 במרץ 2026
        </Typography>
        {children}
    </Container>
);
