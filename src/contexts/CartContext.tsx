"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react"

const STORAGE_KEY = "sba-cart-v1"

export interface CartLine {
  productId: string
  qty: number
}

interface CartState {
  items: CartLine[]
}

type CartAction =
  | { type: "add"; productId: string; qty: number }
  | { type: "remove"; productId: string }
  | { type: "setQty"; productId: string; qty: number }
  | { type: "clear" }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((i) => i.productId === action.productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.productId ? { ...i, qty: i.qty + action.qty } : i,
          ),
        }
      }
      return { items: [...state.items, { productId: action.productId, qty: action.qty }] }
    }
    case "remove":
      return { items: state.items.filter((i) => i.productId !== action.productId) }
    case "setQty": {
      if (action.qty <= 0) return { items: state.items.filter((i) => i.productId !== action.productId) }
      return { items: state.items.map((i) => (i.productId === action.productId ? { ...i, qty: action.qty } : i)) }
    }
    case "clear":
      return { items: [] }
    default:
      return state
  }
}

// Читаем localStorage синхронно в lazy-инициализаторе useReducer (а не в
// useEffect после монтирования) — иначе эффект персиста, срабатывающий на
// первом рендере с ещё пустым state.items, затирал бы сохранённую корзину
// пустым массивом до того, как отдельный эффект гидратации успевал её
// подставить.
function loadInitialItems(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

interface CartContextValue {
  items: CartLine[]
  totalQty: number
  getQty: (productId: string) => number
  addItem: (productId: string, qty?: number) => void
  removeItem: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// Корзина — клиентское состояние (React Context + useReducer), персистится
// в localStorage. Хранит только productId+qty, НЕ цену и не сам товар —
// актуальные данные всегда берутся из каталога (api/products) в момент
// расчёта сметы, см. src/lib/estimate.ts. Так корзина не расходится с
// каталогом, если цена товара поменяется между визитами.
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({ items: loadInitialItems() }))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalQty: state.items.reduce((sum, i) => sum + i.qty, 0),
      getQty: (productId) => state.items.find((i) => i.productId === productId)?.qty ?? 0,
      addItem: (productId, qty = 1) => dispatch({ type: "add", productId, qty }),
      removeItem: (productId) => dispatch({ type: "remove", productId }),
      setQty: (productId, qty) => dispatch({ type: "setQty", productId, qty }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state.items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
