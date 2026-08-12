import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

// Захватывает переданный DOM-узел (см. QuoteTemplate.tsx) через html2canvas
// и вставляет его в A4-страницы jsPDF. Известное ограничение связки
// html2canvas+jsPDF: одно изображение нельзя просто "перетечь" на несколько
// страниц — стандартный обход (см. ниже) — вставлять ОДНО и то же
// изображение на каждую страницу с разным вертикальным сдвигом, так что
// каждая страница показывает свой "вырез" из полной картинки. Для объёма
// корзины (единицы-десятки строк) это даёт 1-2 страницы, чего достаточно.
//
// JPEG, а не PNG: снимок анти-алиased текста на белом фоне через PNG весит
// мегабайты (проверено — 5.4 МБ на один почти пустой лист) — PNG плохо
// сжимает такой "шумный" по пикселям контент. JPEG с высоким качеством
// уменьшает файл на два порядка при незаметной на глаз потере качества для
// текстового документа с белым фоном.
export async function renderQuotePdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
  const imgData = canvas.toDataURL("image/jpeg", 0.92)

  const imgWidthMm = A4_WIDTH_MM
  const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true })

  let heightLeft = imgHeightMm
  let position = 0

  doc.addImage(imgData, "JPEG", 0, position, imgWidthMm, imgHeightMm)
  heightLeft -= A4_HEIGHT_MM

  while (heightLeft > 0) {
    position = heightLeft - imgHeightMm
    doc.addPage()
    doc.addImage(imgData, "JPEG", 0, position, imgWidthMm, imgHeightMm)
    heightLeft -= A4_HEIGHT_MM
  }

  doc.save(filename)
}
