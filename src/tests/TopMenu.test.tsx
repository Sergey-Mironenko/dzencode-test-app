import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TopMenu from '@/components/TopMenu';

jest.mock('@/hooks/useSocket', () => ({
  useSocket: jest.fn(),
}));

const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockDispatch = jest.fn();
let mockActiveSessions = 5;
let mockIsLoaded = true;

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selectorFn: any) =>
    selectorFn({
      inventory: {
        activeSessions: mockActiveSessions,
        isLoaded: mockIsLoaded,
      },
    }),
}));

let mockLanguage = 'ru';
const mockSetLanguage = jest.fn();
jest.mock('../components/LanguageContext', () => ({
  useLanguage: () => ({
    language: mockLanguage,
    setLanguage: mockSetLanguage,
    t: (key: string) => {
      const translations: Record<string, string> = {
        searchPlaceholder: 'Поиск...',
        activeSessions: 'активная сессия',
        activeSessionsPlural: 'активных сессий',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../components/ClientClock', () => ({
  __esModule: true,
  default: () => <div data-testid="client-clock">12:00:00</div>,
}));

describe('Component TopMenu', () => {
  let cookieValue = 'token=abc123xyz; path=/';

  beforeEach(() => {
    jest.clearAllMocks();
    mockLanguage = 'ru';
    mockActiveSessions = 5;
    mockIsLoaded = true;

    cookieValue = 'token=abc123xyz; path=/';
    Object.defineProperty(document, 'cookie', {
      get: () => cookieValue,
      set: (val: string) => {
        cookieValue = val;
      },
      configurable: true,
    });
  });

  it('renders brand logo and title correctly', () => {
    render(<TopMenu />);

    expect(screen.getByText('Inventory')).toBeInTheDocument();
  });

  it('dispatches fetchInventoryData if inventory is not loaded', () => {
    mockIsLoaded = false;
    render(<TopMenu />);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renders search input with placeholder and disabled state', () => {
    render(<TopMenu />);

    const searchInput = screen.getByPlaceholderText('Поиск...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeDisabled();
  });

  it('renders active sessions counter with correct pluralization', () => {
    render(<TopMenu />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('активных сессий')).toBeInTheDocument();
  });

  it('switches language on language button click', async () => {
    render(<TopMenu />);

    const langButton = screen.getByTitle('Switch language');
    await userEvent.click(langButton);

    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

  it('clears token cookie and redirects to /login on logout click', async () => {
    render(<TopMenu />);

    const buttons = screen.getAllByRole('button');
    const logoutBtn = buttons[buttons.length - 1];

    await userEvent.click(logoutBtn);

    expect(document.cookie).toContain('token=;');
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(mockRefresh).toHaveBeenCalled();
  });
});