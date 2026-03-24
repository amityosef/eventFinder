import { Component, ReactNode, ErrorInfo } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh',
              textAlign: 'center',
              py: 4,
            }}
          >
            {/* Error Illustration */}
            <Box
              sx={{
                width: 200,
                height: 200,
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 200 200" width="200" height="200">
                <circle cx="100" cy="100" r="80" fill="#fee2e2" />
                <circle cx="100" cy="100" r="60" fill="#fecaca" />
                <path
                  d="M70 80 L90 80 M110 80 L130 80"
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M70 130 Q100 110 130 130"
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="75" cy="90" r="4" fill="#ef4444" />
                <circle cx="125" cy="90" r="4" fill="#ef4444" />
              </svg>
            </Box>

            <Typography variant="h4" fontWeight={700} gutterBottom>
              אופס! משהו השתבש
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 4 }}>
              אנחנו מתנצלים, אירעה שגיאה בלתי צפויה.
              <br />
              אנא נסו שוב או פנו לתמיכה.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 2,
                  padding: 2,
                  marginBottom: 4,
                  maxWidth: '100%',
                  overflow: 'auto',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                  <BugReport color="error" fontSize="small" />
                  <Typography variant="subtitle2" color="error">
                    פרטי השגיאה (מצב פיתוח)
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: 'error.dark',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    m: 0,
                  }}
                >
                  {this.state.error.message}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                sx={{ borderRadius: 2 }}
              >
                נסה שוב
              </Button>
              <Button
                variant="outlined"
                onClick={() => (window.location.href = '/')}
                sx={{ borderRadius: 2 }}
              >
                חזור לדף הבית
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
