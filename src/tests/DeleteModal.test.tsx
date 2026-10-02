import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteModal from '@/components/DeleteModal';
import { LanguageContext } from '@/components/LanguageContext';

const mockItemData = {
  title: 'MacBook Pro 15',
  serialNumber: 456789123,
  photo: '/laptop.jpg',
};

const renderDeleteModal = (props = {}, language: 'ru' | 'en' = 'ru') => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Удалить продукт?',
    itemData: mockItemData,
    ...props,
  };

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      cancel: 'Отмена',
      delete: 'Удалить',
    };
    return translations[key] || key;
  };

  return {
    ...render(
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
        <DeleteModal {...defaultProps} />
      </LanguageContext.Provider>
    ),
    ...defaultProps,
  };
};

describe('DeleteModal', () => {
  it('does not render anything when isOpen is false', () => {
    renderDeleteModal({ isOpen: false });

    expect(screen.queryByText('Удалить продукт?')).not.toBeInTheDocument();
  });

  it('renders modal content, title, and item data correctly when isOpen is true', () => {
    renderDeleteModal();

    expect(screen.getByText('Удалить продукт?')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro 15')).toBeInTheDocument();
    expect(screen.getByText('SN-456789123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Отмена/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Удалить/i })).toBeInTheDocument();
  });

  it('calls onClose when close button or cancel button is clicked', async () => {
    const onClose = jest.fn();
    renderDeleteModal({ onClose });

    const cancelButton = screen.getByRole('button', { name: /Отмена/i });
    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledTimes(1);

    const closeButton = screen.getByRole('button', { name: /Close/i });
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('calls onConfirm when delete action button is clicked', async () => {
    const onConfirm = jest.fn();
    renderDeleteModal({ onConfirm });

    const deleteButton = screen.getByRole('button', { name: /Удалить/i });
    await userEvent.click(deleteButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});