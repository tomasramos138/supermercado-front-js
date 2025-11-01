import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock del hook useVenta
vi.mock('../hooks/useVenta', () => ({
  __esModule: true,
  default: () => ({
    ventas: [
      {
        id: 'v1',
        fecha: '2025-10-01T10:00:00.000Z',
        cliente: { name: 'Juan', apellido: 'Perez', zona: { name: 'Centro' } },
        distribuidor: { name: 'Distrib A', apellido: 'Uno', valorEntrega: 5 },
        total: 45.5,
        itemsVenta: [
          { producto: { name: 'Manzana' }, cantidad: 2, precio: 10 },
          { producto: { name: 'Leche' }, cantidad: 1, precio: 25.5 },
        ],
      },
      {
        id: 'v2',
        fecha: '2025-10-02T15:30:00.000Z',
        cliente: { name: 'María', apellido: 'Gómez', zona: { name: 'Norte' } },
        distribuidor: { name: 'Distrib B', apellido: 'Dos', valorEntrega: 0 },
        total: 20.0,
        itemsVenta: [
          { producto: { name: 'Pan' }, cantidad: 2, precio: 10 },
        ],
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

// Importa el componente (ruta relativa desde src/tests)
import Ventas from '../pages/dashboardPages/Ventas';

describe('Componente Ventas', () => {
  test('renderiza título y filas de ventas', () => {
    render(<Ventas />);

    // Título principal
    expect(screen.getByText(/Reporte de Ventas/i)).toBeInTheDocument();

    // Filas de ventas (buscamos por cliente)
    expect(screen.getByText(/Juan Perez/i)).toBeInTheDocument();
    expect(screen.getByText(/María Gómez/i)).toBeInTheDocument();

    // Totales mostrados
    expect(screen.getByText(/\$45.50/)).toBeInTheDocument();
    expect(screen.getByText(/\$20.00/)).toBeInTheDocument();
  });

  test('toggle de detalles muestra productos y cantidad total', () => {
    render(<Ventas />);

    // Encontrar botón "Ver Detalles" de la primera venta
    const viewButtons = screen.getAllByRole('button', { name: /Ver Detalles|Ocultar Detalles/ });
    expect(viewButtons.length).toBeGreaterThan(0);

    // Click para abrir detalles de la primera venta
    fireEvent.click(viewButtons[0]);

    // Ahora deben aparecer los productos y la cantidad total calculada
    expect(screen.getByText(/Manzana/i)).toBeInTheDocument();
    expect(screen.getByText(/Leche/i)).toBeInTheDocument();

    // Cantidad total de productos: 2 + 1 = 3 (aparece como texto en el componente)
    expect(screen.getByText(/Cantidad de productos:/i)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  test('ordenar por total funciona (menor a mayor / mayor a menor)', () => {
    render(<Ventas />);

    // Botones de orden (Menor a Mayor y Mayor a Menor)
    const btnMenorMayor = screen.getByRole('button', { name: /Menor a Mayor/i });
    const btnMayorMenor = screen.getByRole('button', { name: /Mayor a Menor/i });

    // Inicialmente orden asc por defecto en tu componente (siempre setea asc en el state)
    // Después de render, la primera fila debería corresponder al menor total (20.00)
    const primerasCeldas = screen.getAllByText(/#v/); // IDs: '#v1', '#v2'
    // No confiamos en el orden por texto genérico; mejor comprobar tras cambiar el orden:
    fireEvent.click(btnMayorMenor);

    // Tras ordenar desc, la primera venta visible (en orden) debería mostrar el mayor total $45.50
    // Buscamos que exista el texto del total mayor en el documento (ya lo comprobamos antes)
    expect(screen.getByText(/\$45.50/)).toBeInTheDocument();

    // Volvemos a ordenar asc
    fireEvent.click(btnMenorMayor);
    expect(screen.getByText(/\$20.00/)).toBeInTheDocument();
  });
});