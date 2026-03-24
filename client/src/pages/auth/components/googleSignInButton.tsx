import { useCallback } from 'react';
import { Box } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/components/snackbar';
import * as styles from '../styles';

interface GoogleSignInButtonProps {
    errorMessageKey: string;
    onCredential: (credential: string) => void;
}

export const GoogleSignInButton = ({
    errorMessageKey,
    onCredential,
}: GoogleSignInButtonProps) => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    const handleSuccess = useCallback(
        (credentialResponse: CredentialResponse) => {
            const credential = credentialResponse.credential;
            if (!credential) {
                showSnackbar(t(errorMessageKey), 'error');
                return;
            }

            onCredential(credential);
        },
        [errorMessageKey, onCredential, showSnackbar, t],
    );

    const handleError = useCallback(() => {
        showSnackbar(t(errorMessageKey), 'error');
    }, [errorMessageKey, showSnackbar, t]);

    return (
        <Box sx={styles.googleLoginContainerStyles}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                text="continue_with"
                shape="pill"
                width="360"
            />
        </Box>
    );
};
