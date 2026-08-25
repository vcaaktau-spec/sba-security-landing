import { forwardRef } from "react"

interface PlannerQuoteItem {
  label: string
  qty: number
  price: number
}

interface PlannerQuoteTemplateProps {
  planImageDataUrl: string
  planName: string
  items: PlannerQuoteItem[]
  total: number
  docNumber: string
  date: string
}

// Тот же паттерн, что и QuoteTemplate.tsx — inline-стили с явными hex,
// не Tailwind/CSS-переменные темы, чтобы html2canvas всегда снимал
// светлый документ независимо от текущей темы сайта. См. комментарий в
// QuoteTemplate.tsx для полного обоснования.
export const PlannerQuoteTemplate = forwardRef<HTMLDivElement, PlannerQuoteTemplateProps>(
  ({ planImageDataUrl, planName, items, total, docNumber, date }, ref) => {
    const cell: React.CSSProperties = { padding: "10px 12px", fontSize: 12 }

    return (
      <div
        ref={ref}
        style={{
          width: 794,
          background: "#ffffff",
          color: "#0f172a",
          fontFamily: "Manrope, system-ui, sans-serif",
          padding: 48,
          boxSizing: "border-box",
        }}
      >
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
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>План № {docNumber}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{date}</div>
          </div>
        </div>

        <div style={{ height: 2, background: "#dc2626", marginBottom: 24 }} />

        <h1 style={{ fontFamily: "Unbounded, sans-serif", fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>
          {planName}
        </h1>
        <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 20px" }}>План объекта и смета оборудования</p>

        <img
          src={planImageDataUrl}
          alt={planName}
          style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 4, marginBottom: 24, display: "block" }}
        />

        {items.length > 0 && (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ ...cell, textAlign: "left", color: "#64748b", fontWeight: 700 }}>Оборудование</th>
                  <th style={{ ...cell, textAlign: "right", width: 70, color: "#64748b", fontWeight: 700 }}>Кол-во</th>
                  <th style={{ ...cell, textAlign: "right", width: 100, color: "#64748b", fontWeight: 700 }}>Цена</th>
                  <th style={{ ...cell, textAlign: "right", width: 110, color: "#64748b", fontWeight: 700 }}>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ ...cell, fontWeight: 600 }}>{item.label}</td>
                    <td style={{ ...cell, textAlign: "right" }}>{item.qty}</td>
                    <td style={{ ...cell, textAlign: "right" }}>{item.price.toLocaleString("ru-RU")} ₸</td>
                    <td style={{ ...cell, textAlign: "right", fontWeight: 700 }}>{(item.price * item.qty).toLocaleString("ru-RU")} ₸</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
              <div style={{ width: 280 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderTop: "2px solid #0f172a",
                    fontSize: 15,
                  }}
                >
                  <span style={{ fontWeight: 900, textTransform: "uppercase" }}>Итого (оборудование)</span>
                  <span style={{ fontWeight: 900 }}>{total.toLocaleString("ru-RU")} ₸</span>
                </div>
              </div>
            </div>
          </>
        )}

        <p style={{ fontSize: 10.5, color: "#64748b", lineHeight: 1.5, marginBottom: 32 }}>
          Указанная сумма — стоимость оборудования по данным плана. Монтажные работы рассчитываются отдельно. Данный документ не является публичной офертой.
        </p>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}>
          <span>ТОО «Система безопасности Актау» · Актау, Мангистауская область</span>
          <span>+7 777 920 49 88 · toosba.kz</span>
        </div>
      </div>
    )
  },
)

PlannerQuoteTemplate.displayName = "PlannerQuoteTemplate"
