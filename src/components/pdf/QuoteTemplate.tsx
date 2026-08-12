import { forwardRef } from "react"
import type { EstimateResult } from "@/lib/estimate"

interface QuoteTemplateProps {
  estimate: EstimateResult
  name: string
  phone: string
  docNumber: string
  date: string
}

// Печатная форма КП, захватывается html2canvas в renderQuotePdf.ts и
// вставляется как изображение в jsPDF. Захват изображением (а не текстовые
// API jsPDF) — сознательный выбор: весь контент на кириллице, а jsPDF из
// коробки поддерживает только латинские PDF-шрифты (Helvetica/Times/
// Courier), без ручного встраивания Unicode-шрифта кириллица не отрисуется.
// Захват уже отрендеренного браузером DOM (тем же Manrope, что и на сайте)
// снимает эту проблему полностью.
//
// Рендерится вне видимой области (position: fixed; left: -9999px в
// CartDrawer), а не display:none — иначе элемент не имеет размеров и
// html2canvas нечего захватывать. Стили — инлайн и в явных hex/rgb, не через
// Tailwind-классы/CSS-переменные темы: скриншот должен быть детерминирован
// (всегда светлый фон, чёрный текст) независимо от текущей темы сайта.
export const QuoteTemplate = forwardRef<HTMLDivElement, QuoteTemplateProps>(
  ({ estimate, name, phone, docNumber, date }, ref) => {
    const cell: React.CSSProperties = { padding: "10px 12px", fontSize: 12 }

    return (
      <div
        ref={ref}
        style={{
          width: 794, // ~210mm at 96dpi
          background: "#ffffff",
          color: "#0f172a",
          fontFamily: "Manrope, system-ui, sans-serif",
          padding: 48,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#dc2626", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>
                SBA <span style={{ color: "#64748b", fontWeight: 500 }}>Актау</span>
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em" }}>Система безопасности Актау</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>КП № {docNumber}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{date}</div>
          </div>
        </div>

        <div style={{ height: 2, background: "#dc2626", marginBottom: 24 }} />

        <h1 style={{ fontFamily: "Unbounded, sans-serif", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>
          Коммерческое предложение
        </h1>

        {/* Client */}
        <div style={{ display: "flex", gap: 40, marginBottom: 24, fontSize: 12 }}>
          <div>
            <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Клиент</div>
            <div style={{ fontWeight: 700 }}>{name || "—"}</div>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Телефон</div>
            <div style={{ fontWeight: 700 }}>{phone || "—"}</div>
          </div>
        </div>

        {/* Line items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ ...cell, textAlign: "left", width: 32, color: "#64748b", fontWeight: 700 }}>№</th>
              <th style={{ ...cell, textAlign: "left", color: "#64748b", fontWeight: 700 }}>Наименование</th>
              <th style={{ ...cell, textAlign: "right", width: 56, color: "#64748b", fontWeight: 700 }}>Кол-во</th>
              <th style={{ ...cell, textAlign: "right", width: 90, color: "#64748b", fontWeight: 700 }}>Цена</th>
              <th style={{ ...cell, textAlign: "right", width: 100, color: "#64748b", fontWeight: 700 }}>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {estimate.lines.map((line, i) => (
              <tr key={line.product.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ ...cell, color: "#94a3b8" }}>{i + 1}</td>
                <td style={cell}>
                  <div style={{ fontWeight: 600 }}>{line.product.name}</div>
                  {line.product.brand && <div style={{ fontSize: 10, color: "#94a3b8" }}>{line.product.brand}</div>}
                </td>
                <td style={{ ...cell, textAlign: "right" }}>{line.qty}</td>
                <td style={{ ...cell, textAlign: "right" }}>{line.product.basePrice.toLocaleString("ru-RU")} ₸</td>
                <td style={{ ...cell, textAlign: "right", fontWeight: 700 }}>{line.lineTotal.toLocaleString("ru-RU")} ₸</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <div style={{ width: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
              <span style={{ color: "#64748b" }}>Оборудование</span>
              <span style={{ fontWeight: 700 }}>{estimate.equipmentTotal.toLocaleString("ru-RU")} ₸</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
              <span style={{ color: "#64748b" }}>Монтаж (ориентировочно)</span>
              <span style={{ fontWeight: 700 }}>{estimate.installEstimate.toLocaleString("ru-RU")} ₸</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                marginTop: 4,
                borderTop: "2px solid #0f172a",
                fontSize: 15,
              }}
            >
              <span style={{ fontWeight: 900, textTransform: "uppercase" }}>Итого</span>
              <span style={{ fontWeight: 900 }}>{estimate.grandTotalApprox.toLocaleString("ru-RU")} ₸</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 10.5, color: "#64748b", lineHeight: 1.5, marginBottom: 32 }}>
          Оборудование не продаётся отдельно — только вместе с монтажом. Цены ориентировочные, точная стоимость
          фиксируется после бесплатного выезда специалиста. Данное КП не является публичной офертой.
        </p>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}>
          <span>ТОО «Система безопасности Актау» · Актау, Мангистауская область</span>
          <span>+7 777 920 49 88 · toosba.kz</span>
        </div>
      </div>
    )
  },
)

QuoteTemplate.displayName = "QuoteTemplate"
