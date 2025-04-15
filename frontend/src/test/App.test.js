import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../App';
import axios from 'axios';

// --- Mocks for Child Components ---
// These mocks ensure predictable output in tests.
jest.mock('../login/LoginPage', () => () => <div data-testid="login-page">Login</div>);
jest.mock('../sidebar/Sidebar', () => (props) => (
  <div data-testid="sidebar">
    <button onClick={() => props.switchPage('ProfilePage')}>Profile</button>
    <button onClick={() => props.switchPage('SearchPage')}>Search</button>
    <button onClick={() => props.switchPage('MatchesPage')}>Matches</button>
    <button onClick={() => props.switchPage('ApplicationPage')}>Applications</button>
    <button onClick={() => props.switchPage('ManageResumePage')}>Manage</button>
    <button onClick={props.handleLogout}>LogOut</button>
  </div>
));
jest.mock('../profile/ProfilePage', () => (props) => <div data-testid="profile-page">Profile</div>);
jest.mock('../search/SearchPage', () => () => <div data-testid="search-page">Search</div>);
jest.mock('../application/ApplicationPage', () => () => <div data-testid="application-page">Application</div>);
jest.mock('../resume/ManageResumePage', () => () => <div data-testid="manage-resume-page">Uploaded Documents</div>);
jest.mock('../matches/MatchesPage', () => () => <div data-testid="matches-page">Matches</div>);

// --- Mock axios ---
jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // 1. Header is rendered.
  test('renders header "Application Tracking System"', () => {
    render(<App />);
    const headers = screen.getAllByText(/Application Tracking System/i);
    expect(headers.length).toBeGreaterThan(0);
  });

  // 2. Renders LoginPage when no token is present.
  test('renders LoginPage when no token is present', () => {
    render(<App />);
    const loginPage = screen.getByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  // 3. When token exists, axios.get is called and Sidebar is rendered.
  test('renders Sidebar when token exists and profile is fetched', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  // 4. Clicking "LogOut" displays the logout modal.
  test('displays logout modal when LogOut is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const logoutBtn = screen.getByText(/LogOut/i);
      fireEvent.click(logoutBtn);
    });
    const modalHeader = screen.getByText(/Confirm Logout/i);
    expect(modalHeader).toBeInTheDocument();
  });

  // 5. Confirming logout removes token and hides the Sidebar.
  // Modified to scope the "Logout" button search within the modal.
  test('confirming logout removes token and hides sidebar', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const logoutBtn = screen.getByText(/LogOut/i);
      fireEvent.click(logoutBtn);
    });
    // Scope search within the modal overlay to find the confirm button.
    const modalOverlay = screen.getByText(/Confirm Logout/i).closest('.modal-overlay');
    const confirmBtn = within(modalOverlay).getByText(/^Logout$/i);
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(screen.queryByTestId('sidebar')).toBeNull();
    });
  });

  // 6. Canceling logout hides the logout modal.
  test('cancel logout hides the logout modal', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const logoutBtn = screen.getByText(/LogOut/i);
      fireEvent.click(logoutBtn);
    });
    const cancelBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByText(/Confirm Logout/i)).toBeNull();
    });
  });

  // 7. Clicking "Profile" sets currentPage to ProfilePage.
  // Modified to use getByRole for the button.
  test('switchPage sets currentPage to ProfilePage when "Profile" is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'Jane Doe' } });
    render(<App />);
    await waitFor(() => {
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
    });
    const profilePage = screen.getByTestId('profile-page');
    expect(profilePage).toBeInTheDocument();
  });

  // 8. Clicking "Search" sets currentPage to SearchPage.
  // Modified to use getByRole.
  test('switchPage sets currentPage to SearchPage when "Search" is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
    });
    const searchPage = screen.getByTestId('search-page');
    expect(searchPage).toBeInTheDocument();
  });

  // 9. Clicking "Applications" sets currentPage to ApplicationPage.
  // Modified to use getByRole.
  test('switchPage sets currentPage to ApplicationPage when "Applications" is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
    });
    const applicationPage = screen.getByTestId('application-page');
    expect(applicationPage).toBeInTheDocument();
  });

  // 10. Clicking "Manage" sets currentPage to ManageResumePage.
  // Modified to use getByRole.
  test('switchPage sets currentPage to ManageResumePage when "Manage" is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    const managePage = screen.getByTestId('manage-resume-page');
    expect(managePage).toBeInTheDocument();
  });

  // 11. Clicking "Matches" sets currentPage to MatchesPage.
  // Modified to use getByRole.
  test('switchPage sets currentPage to MatchesPage when "Matches" is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    const matchesPage = screen.getByTestId('matches-page');
    expect(matchesPage).toBeInTheDocument();
  });

  // 13. Logout modal is not rendered by default.
  test('logout modal is not rendered by default', () => {
    render(<App />);
    expect(document.querySelector('.modal-overlay')).toBeNull();
  });

  // 14. updateProfile updates userProfile and renders ProfilePage.
  test('updateProfile updates userProfile and renders ProfilePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'Jane Doe' } });
    render(<App />);
    await waitFor(() => {
      const profilePage = screen.getByTestId('profile-page');
      expect(profilePage).toBeInTheDocument();
    });
  });

  // 15. When token exists, axios.get is called in componentDidMount.
  test('calls axios.get in componentDidMount when token exists', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  // 16. When no token exists, axios.get is not called.
  test('does not call axios.get when no token exists', () => {
    render(<App />);
    expect(axios.get).not.toHaveBeenCalled();
  });

  // 17. sidebarHandler sets sidebar to true and renders Sidebar.
  test('sidebarHandler sets sidebar state to true and renders Sidebar', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  // 18. Renders LoginPage inside the "content" div when sidebar is false.
  test('renders LoginPage inside content div when sidebar is false', () => {
    localStorage.removeItem('token');
    const { container } = render(<App />);
    const contentDiv = container.querySelector('.content');
    expect(contentDiv).toHaveTextContent('Login');
  });

  // 19. Logout modal displays correct content when active.
  test('renders logout modal with proper content when active', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      fireEvent.click(screen.getByText(/LogOut/i));
    });
    expect(screen.getByText(/Confirm Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to logout/i)).toBeInTheDocument();
  });

  // 20. Renders custom modal styling in a <style> tag.
  test('renders custom modal styling in a <style> tag', () => {
    render(<App />);
    const styleTag = document.querySelector('style');
    expect(styleTag).toBeInTheDocument();
    expect(styleTag.textContent).toMatch(/\.modal-overlay/);
  });

  // 21. Renders the "Matches" page when the "Matches" button is clicked.
  test('renders MatchesPage when "Matches" button is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    const matchesPage = screen.getByTestId('matches-page');
    expect(matchesPage).toBeInTheDocument();
  });

  // 21. Renders the "Matches" page when the "Matches" button is clicked.
  test('renders MatchesPage when "Matches" button is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    const matchesPage = screen.getByTestId('matches-page');
    expect(matchesPage).toBeInTheDocument();
  });


  // 24. Clicking "Profile" button renders ProfilePage.
  test('renders ProfilePage when "Profile" button is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
    });
    const profilePage = screen.getByTestId('profile-page');
    expect(profilePage).toBeInTheDocument();
  });

  // 26. Sidebar renders correct buttons when logged in.
  test('renders correct buttons in Sidebar when logged in', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Matches' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Applications' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Manage' })).toBeInTheDocument();
    });
  });

  // 31. Renders "SearchPage" when "Search" button is clicked.
  test('renders SearchPage when "Search" button is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
    });
    const searchPage = screen.getByTestId('search-page');
    expect(searchPage).toBeInTheDocument();
  });

  // 34. Clicking "LogOut" button displays the logout modal.
  test('clicking "LogOut" button displays the logout modal', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const logoutBtn = screen.getByText(/LogOut/i);
      fireEvent.click(logoutBtn);
    });
    const modalHeader = screen.getByText(/Confirm Logout/i);
    expect(modalHeader).toBeInTheDocument();
  });

  // 35. Clicking "Cancel" in the logout modal hides the modal.
  test('clicking "Cancel" in the logout modal hides the modal', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const logoutBtn = screen.getByText(/LogOut/i);
      fireEvent.click(logoutBtn);
    });
    const cancelBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByText(/Confirm Logout/i)).toBeNull();
    });
  });

  // 36. Renders LoginPage when no token is present in localStorage.
  test('renders LoginPage when no token is present', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  // 38. Clicking "Applications" button renders ApplicationPage.
  test('renders ApplicationPage when "Applications" button is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
    });
    expect(screen.getByTestId('application-page')).toBeInTheDocument();
  });

  // 39. Clicking "Manage" button renders ManageResumePage.
  test('renders ManageResumePage when "Manage" button is clicked', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

  // 40. Sidebar is not rendered when user is not logged in.
  test('sidebar is not rendered when user is not logged in', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    render(<App />);
    expect(screen.queryByTestId('sidebar')).toBeNull();
  });

  // 41. Clicking "Matches" button multiple times still renders MatchesPage.
  test('clicking "Matches" button multiple times renders MatchesPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
      fireEvent.click(matchesBtn);
    });
    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
  });

  // 42. Clicking "Manage" then "Profile" renders ProfilePage.
  test('clicking "Manage" then "Profile" renders ProfilePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
    });
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
  });

  // 43. Clicking "Search" then "Applications" renders ApplicationPage.
  test('clicking "Search" then "Applications" renders ApplicationPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
    });
    expect(screen.getByTestId('application-page')).toBeInTheDocument();
  });

  // 44. Modal overlay is not present after confirming logout.
  test('modal overlay is not present after confirming logout', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const logoutBtn = screen.getByText(/LogOut/i);
      fireEvent.click(logoutBtn);
    });
    const modalOverlay = screen.getByText(/Confirm Logout/i).closest('.modal-overlay');
    const confirmBtn = within(modalOverlay).getByText(/^Logout$/i);
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(document.querySelector('.modal-overlay')).toBeNull();
    });
  });

  // 45. Clicking "Profile" button after logout does not render ProfilePage.
  test('clicking "Profile" after logout does not render ProfilePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const logoutBtn = screen.getByText(/LogOut/i);
      fireEvent.click(logoutBtn);
    });
    const modalOverlay = screen.getByText(/Confirm Logout/i).closest('.modal-overlay');
    const confirmBtn = within(modalOverlay).getByText(/^Logout$/i);
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(screen.queryByTestId('sidebar')).toBeNull();
    });
    // Try clicking "Profile" (should not exist)
    expect(screen.queryByRole('button', { name: 'Profile' })).toBeNull();
  });

  // 46. Clicking "Search" then "Matches" renders MatchesPage.
  test('clicking "Search" then "Matches" renders MatchesPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
  });

  // 47. Clicking "Manage" then "Applications" renders ApplicationPage.
  test('clicking "Manage" then "Applications" renders ApplicationPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
    });
    expect(screen.getByTestId('application-page')).toBeInTheDocument();
  });

  // 48. Clicking "Applications" then "Manage" renders ManageResumePage.
  test('clicking "Applications" then "Manage" renders ManageResumePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

  // 49. Clicking "Matches" then "Profile" renders ProfilePage.
  test('clicking "Matches" then "Profile" renders ProfilePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
    });
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
  });

  // 50. Clicking "Profile" then "Search" renders SearchPage.
  test('clicking "Profile" then "Search" renders SearchPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
    });
    expect(screen.getByTestId('search-page')).toBeInTheDocument();
  });

  // 51. Clicking "Manage" then "Matches" renders MatchesPage.
  test('clicking "Manage" then "Matches" renders MatchesPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
  });

  // 52. Clicking "Applications" then "Matches" renders MatchesPage.
  test('clicking "Applications" then "Matches" renders MatchesPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
  });

  // 53. Clicking "Matches" then "Manage" renders ManageResumePage.
  test('clicking "Matches" then "Manage" renders ManageResumePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

  // 54. Clicking "Search" then "Manage" renders ManageResumePage.
  test('clicking "Search" then "Manage" renders ManageResumePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

  // 55. Clicking "Manage" then "Applications" then "Profile" renders ProfilePage.
  test('clicking "Manage" then "Applications" then "Profile" renders ProfilePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
    });
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
  });

  // 51. Clicking "Manage" then "Matches" renders MatchesPage.
  test('clicking "Manage" then "Matches" renders MatchesPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
  });

  // 52. Clicking "Applications" then "Matches" renders MatchesPage.
  test('clicking "Applications" then "Matches" renders MatchesPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
  });

  // 53. Clicking "Matches" then "Manage" renders ManageResumePage.
  test('clicking "Matches" then "Manage" renders ManageResumePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

  // 54. Clicking "Search" then "Manage" renders ManageResumePage.
  test('clicking "Search" then "Manage" renders ManageResumePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

  // 55. Clicking "Manage" then "Applications" then "Profile" renders ProfilePage.
  test('clicking "Manage" then "Applications" then "Profile" renders ProfilePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
    });
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
  });

  // 56. Clicking "Profile" then "Manage" renders ManageResumePage.
  test('clicking "Profile" then "Manage" renders ManageResumePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

  // 57. Clicking "Matches" then "Applications" renders ApplicationPage.
  test('clicking "Matches" then "Applications" renders ApplicationPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
    });
    expect(screen.getByTestId('application-page')).toBeInTheDocument();
  });

  // 58. Clicking "Manage" then "Search" then "Matches" renders MatchesPage.
  test('clicking "Manage" then "Search" then "Matches" renders MatchesPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
      const matchesBtn = screen.getByRole('button', { name: 'Matches' });
      fireEvent.click(matchesBtn);
    });
    expect(screen.getByTestId('matches-page')).toBeInTheDocument();
  });

  // 59. Clicking "Applications" then "Profile" then "Search" renders SearchPage.
  test('clicking "Applications" then "Profile" then "Search" renders SearchPage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const appBtn = screen.getByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
      const profileBtn = screen.getByRole('button', { name: 'Profile' });
      fireEvent.click(profileBtn);
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
    });
    expect(screen.getByTestId('search-page')).toBeInTheDocument();
  });

  // 60. Clicking "Search" then "Applications" then "Manage" renders ManageResumePage.
  test('clicking "Search" then "Applications" then "Manage" renders ManageResumePage', async () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '123');
    axios.get.mockResolvedValueOnce({ data: { name: 'John Doe' } });
    render(<App />);
    await waitFor(() => {
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      fireEvent.click(searchBtn);
      const appBtn = screen.gebackend/venv312/tByRole('button', { name: 'Applications' });
      fireEvent.click(appBtn);
      const manageBtn = screen.getByRole('button', { name: 'Manage' });
      fireEvent.click(manageBtn);
    });
    expect(screen.getByTestId('manage-resume-page')).toBeInTheDocument();
  });

});
