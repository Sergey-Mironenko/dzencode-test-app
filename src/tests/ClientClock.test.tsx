import { render, screen, act } from '@testing-library/react';
import ClientClock from '@/components/ClientClock';

describe('ClientClock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders time, day of the week, and date correctly when initialized', () => {
    const mockDate = new Date('2026-10-02T21:23:43');
    jest.setSystemTime(mockDate);

    render(<ClientClock />);

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.getByText(/пятница/i)).toBeInTheDocument();
    expect(screen.getByText('02 окт., 2026')).toBeInTheDocument();
    expect(screen.getByText('21:23:43')).toBeInTheDocument();
  });
});