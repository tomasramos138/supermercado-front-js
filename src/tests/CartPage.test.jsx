import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mocks simples de los hooks y del contexto (rutas relativas desde src/tests/)
vi.mock('../hooks/useCart', () => ({
  useCart: () => ({
    cart: [
      {
        id: 'p1',
        name: 'Manzana',
        descripcion: 'Rica manzana',
        precio: 10,
        quantity: 1,
        stock: 5,
        imagen: '',
      },
    ],
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    cartTotal: 10,
    cartItemCount: 1,
    clearCart: vi.fn(),
  }),
}));

vi.mock('../hooks/useVenta', () => ({
  __esModule: true,
  default: () => ({ procesarCompra: vi.fn().mockResolvedValue({}) }),
}));

vi.mock('../hooks/useProducts', () => ({
  __esModule: true,
  default: () => ({ refetchProducts: vi.fn().mockResolvedValue(true) }),
}));

// Importa AuthContext y el componente desde sus ubicaciones reales
import { AuthContext } from '../contexts/auth';
import CartPage from '../pages/CartPage';

const mockAuthValue = {
  user: { id: 'u1', name: 'Usuario Test' },
  distribuidor: { id: 'd1', valorEntrega: 2.5 },
};

describe('CartPage - test simple', () => {
  test('renderiza carrito abierto con item y totales; cerrar llama onClose; procede abre modal', () => {
    const onClose = vi.fn();

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CartPage isOpen={true} onClose={onClose} />
      </AuthContext.Provider>
    );

    // Verificar que el nombre del producto aparece en el heading (h3)
    expect(screen.getByRole('heading', { level: 3, name: /Manzana/i })).toBeInTheDocument();

    // Subtotal, envío y total — buscamos cada fila y comprobamos el valor dentro de esa fila
    const subtotalLabel = screen.getByText(/Subtotal/i);
    const subtotalRow = subtotalLabel.closest('.summary-row') || subtotalLabel.parentElement;
    expect(subtotalRow).toBeTruthy();
    expect(within(subtotalRow).getByText(/\$10.00/)).toBeInTheDocument();

    const envioLabel = screen.getByText(/Envío/i);
    const envioRow = envioLabel.closest('.summary-row') || envioLabel.parentElement;
    expect(envioRow).toBeTruthy();
    expect(within(envioRow).getByText(/\$2.50/)).toBeInTheDocument();

    const totalLabel = screen.getByText(/Total:/i);
    const totalRow = totalLabel.closest('.summary-row') || totalLabel.parentElement;
    expect(totalRow).toBeTruthy();
    expect(within(totalRow).getByText(/\$12.50/)).toBeInTheDocument();

    // Cerrar carrito llama onClose
    const closeBtn = screen.getByLabelText(/Cerrar carrito/i);
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    // Abrir confirmación al pulsar "Proceder al pago"
    const checkoutBtn = screen.getByRole('button', { name: /Proceder al pago/i });
    fireEvent.click(checkoutBtn);

    // Comprobaciones específicas para el modal:
    // 1) heading del modal
    expect(screen.getByRole('heading', { level: 3, name: /Confirmar Compra/i })).toBeInTheDocument();

    // 2) botón de confirmar dentro del modal
    expect(screen.getByRole('button', { name: /Confirmar Compra/i })).toBeInTheDocument();
  });

  test('cuando isOpen es false no renderiza nada', () => {
    const onClose = vi.fn();
    const { container } = render(
      <AuthContext.Provider value={mockAuthValue}>
        <CartPage isOpen={false} onClose={onClose} />
      </AuthContext.Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});