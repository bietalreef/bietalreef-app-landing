import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * يحوّل عنصر HTML إلى ملف PDF ويقوم بتحميله مباشرة
 * يُستخدم في مولّد العروض والعقود والفواتير
 */
export async function downloadPdfFromElement(
  element: HTMLElement,
  fileName: string,
  onStart?: () => void,
  onEnd?: () => void,
) {
  try {
    onStart?.();

    // تحويل العنصر إلى صورة عالية الجودة
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // أبعاد A4 بالمليمتر
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // حساب نسبة العرض والارتفاع
    const imgWidth = A4_WIDTH_MM;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // إذا المحتوى أطول من صفحة واحدة — تقسيم على عدة صفحات
    let position = 0;
    let remainingHeight = imgHeight;

    while (remainingHeight > 0) {
      if (position > 0) pdf.addPage();

      pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
      remainingHeight -= A4_HEIGHT_MM;
      position += A4_HEIGHT_MM;
    }

    // تحميل الملف
    pdf.save(`${fileName}.pdf`);
  } catch (err) {
    console.error('PDF export error:', err);
    // Fallback: فتح نافذة طباعة
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${fileName}</title><style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Cairo',sans-serif;direction:rtl}@page{size:A4;margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${element.innerHTML}</body></html>`);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  } finally {
    onEnd?.();
  }
}
