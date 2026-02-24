import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mocks simples de los hooks y del contexto
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
  default: () => ({ 
    procesarCompra: vi.fn().mockResolvedValue({}),
    loading: false,
    error: null
  }),
}));

vi.mock('../hooks/useProducts', () => ({
  __esModule: true,
  default: () => ({ 
    refetchProducts: vi.fn().mockResolvedValue(true) 
  }),
}));

// Importa AuthContext y el componente
import { AuthContext } from '../contexts/auth';
import CartPage from '../pages/CartPage';

const mockAuthValue = {
  user: { id: 'u1', name: 'Usuario Test' },
  distribuidor: { id: 'd1', valorEntrega: 2.5 },
};

// Verifica que el carrito se renderiza correctamente con el producto "Manzana", muestra los totales (subtotal $10, envío $2.50, total $12.50), y al hacer clic en el botón de cerrar ejecuta la función onClose()
describe('CartPage - test simple', () => {
  test('renderiza carrito abierto con item y totales; cerrar llama onClose; proceder al pago cambia estado del botón', () => {
    const onClose = vi.fn();

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CartPage isOpen={true} onClose={onClose} />
      </AuthContext.Provider>
    );

    // Verificar que el nombre del producto aparece
    expect(screen.getByRole('heading', { level: 3, name: /Manzana/i })).toBeInTheDocument();

    // Verificar subtotal
    const subtotalLabel = screen.getByText('Subtotal:');
    const subtotalRow = subtotalLabel.closest('.summary-row') || subtotalLabel.parentElement;
    expect(subtotalRow).toBeTruthy();
    expect(within(subtotalRow).getByText(/\$10.00/)).toBeInTheDocument();

    // Verificar envío
    const envioLabel = screen.getByText('Envío:');
    const envioRow = envioLabel.closest('.summary-row') || envioLabel.parentElement;
    expect(envioRow).toBeTruthy();
    expect(within(envioRow).getByText(/\$2.50/)).toBeInTheDocument();

    // Verificar total
    const totalLabel = screen.getByText('Total:');
    const totalRow = totalLabel.closest('.summary-row') || totalLabel.parentElement;
    expect(totalRow).toBeTruthy();
    expect(within(totalRow).getByText(/\$12.50/)).toBeInTheDocument();

    // Verificar que el botón de pago está habilitado inicialmente
    const checkoutBtn = screen.getByRole('button', { name: /Proceder al pago/i });
    expect(checkoutBtn).not.toBeDisabled();

    // Cerrar carrito llama onClose
    const closeBtn = screen.getByLabelText(/Cerrar carrito/i);
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
// Comprueba que al hacer clic en "Proceder al pago", el botón cambia su texto a "Procesando..." y se deshabilita, sin mostrar el modal de confirmación
  test('al hacer clic en proceder al pago, el botón cambia a Procesando...', () => {
    const onClose = vi.fn();

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <CartPage isOpen={true} onClose={onClose} />
      </AuthContext.Provider>
    );

    // Hacer clic en proceder al pago
    const checkoutBtn = screen.getByRole('button', { name: /Proceder al pago/i });
    fireEvent.click(checkoutBtn);

    // Verificar que el botón cambió a "Procesando..." y está deshabilitado
    const procesandoBtn = screen.getByRole('button', { name: /Procesando/i });
    expect(procesandoBtn).toBeInTheDocument();
    expect(procesandoBtn).toBeDisabled();

    // Verificar que el modal de confirmación NO está presente (según el comportamiento actual)
    expect(screen.queryByRole('heading', { level: 3, name: /Confirmar Compra/i })).not.toBeInTheDocument();
  });
// Verifica que cuando la prop isOpen es false, el componente no renderiza ningún contenido en el DOM
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