import jsPDF from 'jspdf';
import type { MenuResult } from './schemas';

// jsPDF tidak punya "auto-flow" seperti HTML — kalau konten sudah mendekati
// batas bawah halaman, kita harus MANUAL pindah ke halaman baru. Function ini
// mengecek posisi Y saat ini, dan menambah halaman baru kalau sudah terlalu bawah.
function ensureSpace(doc: jsPDF, y: number, needed = 10): number {
  if (y + needed > 280) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function exportMenuToPdf(menu: MenuResult, meta: { budget: number; portions: number }) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text(menu.menu, 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Budget: Rp${meta.budget.toLocaleString('id-ID')} • ${meta.portions} porsi`, 14, y);
  y += 10;

  y = ensureSpace(doc, y);
  doc.setFontSize(13);
  doc.text('Bahan & Harga:', 14, y);
  y += 7;

  doc.setFontSize(11);
  menu.ingredients_and_prices.forEach((ing) => {
    y = ensureSpace(doc, y);
    doc.text(`- ${ing.name}: Rp${ing.price.toLocaleString('id-ID')}`, 16, y);
    y += 6;
  });

  y += 4;
  y = ensureSpace(doc, y);
  doc.setFontSize(13);
  doc.text('Langkah Masak:', 14, y);
  y += 7;

  doc.setFontSize(11);
  menu.steps.forEach((step, i) => {
    // splitTextToSize memecah teks panjang jadi beberapa baris supaya tidak
    // keluar dari lebar halaman (180mm) — perlu dihitung dulu jumlah barisnya
    // SEBELUM ditulis, supaya ensureSpace tahu berapa ruang yang dibutuhkan
    const lines = doc.splitTextToSize(`${i + 1}. ${step}`, 180);
    y = ensureSpace(doc, y, lines.length * 6);
    doc.text(lines, 16, y);
    y += lines.length * 6;
  });

  y += 4;
  y = ensureSpace(doc, y);
  doc.setFontSize(13);
  doc.text('Skor Gizi:', 14, y);
  y += 7;

  doc.setFontSize(11);
  Object.entries(menu.nutrition_score).forEach(([key, value]) => {
    y = ensureSpace(doc, y);
    doc.text(`- ${key}: ${value}`, 16, y);
    y += 6;
  });

  const fileName = `menu-${menu.menu.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
}