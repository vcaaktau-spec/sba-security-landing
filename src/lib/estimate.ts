import type { Product } from "./catalog"
import type { CartLine } from "@/contexts/CartContext"

// Плоская ставка монтажа за единицу товара в корзине — сознательно проще
// логики старого квиз-калькулятора (Calculator.tsx), которая зависит от
// типа объекта/сложности работ через пошаговый квиз. У корзины такого квиза
// нет, а порядок цифры взят тем же, что и "стандартный" монтаж камеры в
// частном доме там (PRICES.install.home.standard = 15000).
export const INSTALL_FEE_PER_UNIT = 15000

export interface EstimateLine {
  product: Product
  qty: number
  lineTotal: number
}

export interface EstimateResult {
  lines: EstimateLine[]
  equipmentTotal: number
  installEstimate: number
  grandTotalApprox: number
  // productId'ы из корзины, которых не нашлось в переданном каталоге —
  // например, товар сняли с продажи между визитами. Корзина не хранит цену
  // товара сама, поэтому такие строки просто не попадают в смету, а не
  // считаются по устаревшей/нулевой цене.
  missingProductIds: string[]
}

export function computeEstimate(cartItems: CartLine[], products: Product[]): EstimateResult {
  const byId = new Map(products.map((p) => [p.id, p]))
  const lines: EstimateLine[] = []
  const missingProductIds: string[] = []
  let totalUnits = 0

  for (const item of cartItems) {
    const product = byId.get(item.productId)
    if (!product) {
      missingProductIds.push(item.productId)
      continue
    }
    lines.push({ product, qty: item.qty, lineTotal: product.basePrice * item.qty })
    totalUnits += item.qty
  }

  const equipmentTotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const installEstimate = totalUnits * INSTALL_FEE_PER_UNIT

  return {
    lines,
    equipmentTotal,
    installEstimate,
    grandTotalApprox: equipmentTotal + installEstimate,
    missingProductIds,
  }
}
