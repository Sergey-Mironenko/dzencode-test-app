import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProductModal from '@/components/AddProductModal';
import { LanguageContext } from '@/components/LanguageContext';
import * as reactRedux from 'react-redux';
import { addProduct } from '@/store/inventorySlice';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('@/store/inventorySlice', () => ({
  ...jest.requireActual('@/store/inventorySlice'),
  addProduct: jest.fn((payload) => ({ type: 'inventory/addProduct', payload })),
}));

const mockDispatch = jest.fn();

const renderAddProductModal = (props = {}, language: 'ru' | 'en' = 'ru') => {
  (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    orderId: 10,
    ...props,
  };

  const mockTranslate = (key: string) => {
    const translations: Record<string, string> = {
      addProductTitle: 'Добавить продукт',
      productNameLabel: 'Название продукта',
      productNamePlaceholder: 'Введите название',
      productOwnerLabel: 'Владелец',
      productOwnerPlaceholder: 'Например: Сергей Мироненко',
      productGroupLabel: 'Группа',
      productGroupPlaceholder: 'Например: Группа 1',
      serialNumberLabel: 'Серийный номер',
      typeLabel: 'Тип',
      priceUsdLabel: 'Цена USD',
      priceUahLabel: 'Цена UAH',
      conditionLabel: 'Состояние',
      statusLabel: 'Статус',
      newItem: 'Новый',
      usedItem: 'Б/У',
      freeStatus: 'Свободен',
      repairStatus: 'В ремонте',
      cancel: 'Отмена',
      save: 'Сохранить',
      errTitleMinLength: 'Минимум 3 символа',
      errSerialNumberInvalid: 'Некорректный серийный номер',
      errPriceUsd: 'Укажите цену в USD',
      errPriceUah: 'Укажите цену в UAH',
    };
    return translations[key] || key;
  };

  return {
    ...render(
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn(), t: mockTranslate }}>
        <AddProductModal {...defaultProps} />
      </LanguageContext.Provider>
    ),
    ...defaultProps,
  };
};

describe('AddProductModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    renderAddProductModal({ isOpen: false });
    expect(screen.queryByText('Добавить продукт')).not.toBeInTheDocument();
  });

  it('renders form fields correctly when isOpen is true', () => {
    renderAddProductModal();

    expect(screen.getByText('Добавить продукт')).toBeInTheDocument();
    expect(screen.getByText('Название продукта')).toBeInTheDocument();
    expect(screen.getByText('Владелец')).toBeInTheDocument();
    expect(screen.getByText('Группа')).toBeInTheDocument();
    expect(screen.getByText('Серийный номер')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Сохранить/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderAddProductModal();

    const saveButton = screen.getByRole('button', { name: /Сохранить/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText('Минимум 3 символа')).toBeInTheDocument();
    expect(screen.getByText('Некорректный серийный номер')).toBeInTheDocument();
    expect(screen.getByText('Укажите цену в USD')).toBeInTheDocument();
    expect(screen.getByText('Укажите цену в UAH')).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('dispatches addProduct with null for groupName and owner if left empty', async () => {
    const onClose = jest.fn();
    renderAddProductModal({ onClose });

    await userEvent.type(screen.getByPlaceholderText('Введите название'), 'Dell Monitor 27');
    await userEvent.type(screen.getByPlaceholderText('123456789'), '987654321');
    await userEvent.type(screen.getByPlaceholderText('200'), '250');
    await userEvent.type(screen.getByPlaceholderText('8000'), '10000');

    const saveButton = screen.getByRole('button', { name: /Сохранить/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(addProduct).toHaveBeenCalledTimes(1);
      expect(addProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Dell Monitor 27',
          serialNumber: 987654321,
          order: 10,
          owner: null,
          groupName: null,
        })
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('dispatches addProduct with groupName and owner when provided', async () => {
    const onClose = jest.fn();
    renderAddProductModal({ onClose });

    await userEvent.type(screen.getByPlaceholderText('Введите название'), 'Dell Monitor 27');
    await userEvent.type(screen.getByPlaceholderText('Например: Сергей Мироненко'), 'Иван Иванов');
    await userEvent.type(screen.getByPlaceholderText('Например: Группа 1'), 'Мониторы IT');
    await userEvent.type(screen.getByPlaceholderText('123456789'), '987654321');
    await userEvent.type(screen.getByPlaceholderText('200'), '250');
    await userEvent.type(screen.getByPlaceholderText('8000'), '10000');

    const saveButton = screen.getByRole('button', { name: /Сохранить/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(addProduct).toHaveBeenCalledTimes(1);
      expect(addProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Dell Monitor 27',
          owner: 'Иван Иванов',
          groupName: 'Мониторы IT',
          serialNumber: 987654321,
          order: 10,
        })
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});