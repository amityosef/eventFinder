import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './components/layout';
import { LoadingScreen } from './components/loadingScreen';
import { ErrorBoundary } from './components/errorBoundary';
import { useAuthStore } from './store/authStore';

const HomePage = lazy(() =>
  import('./pages/home').then((m) => ({ default: m.HomePage }))
);
const SearchResultsPage = lazy(() =>
  import('./pages/searchResults').then((m) => ({ default: m.SearchResultsPage }))
);
const VenueDetailPage = lazy(() =>
  import('./pages/venueDetail').then((m) => ({ default: m.VenueDetailPage }))
);
const LoginPage = lazy(() =>
  import('./pages/auth').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('./pages/auth').then((m) => ({ default: m.RegisterPage }))
);
const DashboardPage = lazy(() =>
  import('./pages/dashboard').then((m) => ({ default: m.DashboardPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/notFound').then((m) => ({ default: m.NotFoundPage }))
);
const AboutPage = lazy(() =>
  import('./pages/about').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/contact').then((m) => ({ default: m.ContactPage }))
);
const FavoritesPage = lazy(() =>
  import('./pages/favorites').then((m) => ({ default: m.FavoritesPage }))
);
const VenueEditPage = lazy(() =>
  import('./pages/dashboard').then((m) => ({ default: m.VenueEditPage }))
);
const VenueCreatePage = lazy(() =>
  import('./pages/dashboard').then((m) => ({ default: m.VenueCreatePage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/legal').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsOfUsePage = lazy(() =>
  import('./pages/legal').then((m) => ({ default: m.TermsOfUsePage }))
);
const AccessibilityStatementPage = lazy(() =>
  import('./pages/legal').then((m) => ({ default: m.AccessibilityStatementPage }))
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="venues/:id" element={<VenueDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsOfUsePage />} />
            <Route path="accessibility" element={<AccessibilityStatementPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/venues/:id/edit"
              element={
                <ProtectedRoute>
                  <VenueEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/venues/new"
              element={
                <ProtectedRoute>
                  <VenueCreatePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
