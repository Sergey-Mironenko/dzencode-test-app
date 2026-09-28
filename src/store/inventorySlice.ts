import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, Product } from '@/types';

const initialOrders: Order[] = [
  { id: 1, title: 'Длинное предлинное длиннющее название прихода', date: '2017-04-06 12:09:33', description: 'desc' },
  { id: 2, title: 'Длинное название прихода', date: '2017-09-06 12:09:33', description: 'desc' },
  { id: 3, title: 'Длинное предлинное длиннющее название прихода', date: '2017-06-06 12:09:33', description: 'desc' },
  { id: 4, title: 'Длинное предлинное название прихода', date: '2017-02-06 12:09:33', description: 'desc' }
];

const initialProducts: Product[] = [
  {
    id: 1,
    serialNumber: 123456789,
    isNew: 1,
    photo: '/monitor.jpg',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2500, symbol: 'UAH', isDefault: 1 }
    ],
    order: 1,
    date: '2017-06-29 12:09:33',
    status: 'Свободен',
    owner: null,
    groupName: 'Длинное предлинное длиннющее название группы'
  },
  {
    id: 2,
    serialNumber: 123456789,
    isNew: 0,
    photo: '/monitor.jpg',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2500, symbol: 'UAH', isDefault: 1 }
    ],
    order: 1,
    date: '2017-06-29 12:09:33',
    status: 'В ремонте',
    owner: null,
    groupName: null
  },
  {
    id: 3,
    serialNumber: 123456789,
    isNew: 1,
    photo: '/laptop.jpg',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Laptops',
    specification: 'Specification 2',
    guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2500, symbol: 'UAH', isDefault: 1 }
    ],
    order: 2,
    date: '2017-06-29 12:09:33',
    status: 'Свободен',
    owner: 'Христорождественский Александр',
    groupName: 'Длинное предлинное длиннющее название группы'
  },
  {
    id: 4,
    serialNumber: 123456789,
    isNew: 0,
    photo: '/laptop.jpg',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Laptops',
    specification: 'Specification 2',
    guarantee: { start: '2017-04-06 12:09:33', end: '2025-08-06 12:09:33' },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2500, symbol: 'UAH', isDefault: 1 }
    ],
    order: 3,
    date: '2017-06-29 12:09:33',
    status: 'В ремонте',
    owner: null,
    groupName: null
  }
];

interface InventoryState {
  orders: Order[];
  products: Product[];
  selectedOrderId: number | null;
  activeSessions: number;
}

const initialState: InventoryState = {
  orders: initialOrders,
  products: initialProducts,
  selectedOrderId: null,
  activeSessions: 0,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    deleteOrder: (state, action: PayloadAction<number>) => {
      const orderId = action.payload;
      state.orders = state.orders.filter((o) => o.id !== orderId);
      state.products = state.products.filter((p) => p.order !== orderId);
      if (state.selectedOrderId === orderId) {
        state.selectedOrderId = null;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setSelectedOrderId: (state, action: PayloadAction<number | null>) => {
      state.selectedOrderId = action.payload;
    },
    setActiveSessions: (state, action: PayloadAction<number>) => {
      state.activeSessions = action.payload;
    },
  }
});

export const { deleteOrder, deleteProduct, setSelectedOrderId, setActiveSessions } = inventorySlice.actions;
export default inventorySlice.reducer;