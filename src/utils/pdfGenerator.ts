
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult, ThirteenthResult, TerminationResult, VacationResult, IrpfResult } from '../types';

// -- CONFIGURAÇÕES GLOBAIS DE MARCA --
const BRAND_PRIMARY: [number, number, number] = [30, 58, 138]; // #1e3a8a (Blue 900)
const BRAND_ACCENT: [number, number, number] = [30, 64, 175];   // #1e40af (Blue 800)
const TEXT_SLATE: [number, number, number] = [71, 85, 105];    // #475569

const drawHeader = (doc: jsPDF, title: string) => {
  doc.setFillColor(BRAND_PRIMARY[0], BRAND_PRIMARY[1], BRAND_PRIMARY[2]);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("calculadorasalariobr.com.br | Simulação Oficial 2026", 105, 28, { align: 'center' });
};

const drawFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')} | Simulação sem valor legal conforme legislação 2026.`, 105, 285, { align: 'center' });
    }
};

const formatBRL = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// 1. HOLERITE MENSAL
export const generatePayslipPdf = (result: CalculationResult) => {
  const doc = new jsPDF();
  drawHeader(doc, "HOLERITE SIMULADO");

  const tableBody = [
    ['Salário Base', formatBRL(result.grossSalary), '-'],
    ...(result.familySalary > 0 ? [['Salário Família', formatBRL(result.familySalary), '-']] : []),
    ...(result.totalExtras > 0 ? [['Horas Extras / Adicionais', formatBRL(result.totalExtras), '-']] : []),
    ['INSS', '-', formatBRL(result.inss)],
    ['IRRF (Imposto de Renda)', '-', formatBRL(result.irpf)],
    ...(result.transportVoucher > 0 ? [['Vale Transporte', '-', formatBRL(result.transportVoucher)]] : []),
    ...(result.healthInsurance > 0 ? [['Plano de Saúde', '-', formatBRL(result.healthInsurance)]] : []),
    ...(result.otherDiscounts > 0 ? [['Outros Descontos', '-', formatBRL(result.otherDiscounts)]] : []),
    ...(result.consignedDiscount > 0 ? [['Empréstimo Consignado', '-', formatBRL(result.consignedDiscount)]] : []),
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Descrição', 'Proventos', 'Descontos']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: BRAND_PRIMARY, halign: 'center' },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.setTextColor(TEXT_SLATE[0], TEXT_SLATE[1], TEXT_SLATE[2]);
  doc.text(`FGTS Mensal: ${formatBRL(result.fgtsMonthly)}`, 14, finalY);
  doc.text(`Margem Consignável Empréstimo (35%): ${formatBRL(result.totalConsignedMargin)}`, 14, finalY + 6);
  doc.text(`Margem Disponível p/ Novo Crédito: ${formatBRL(result.availableConsignableMargin)}`, 14, finalY + 12);
  doc.text(`Margem exclusiva para Cartão (5%): ${formatBRL(result.cardMargin)}`, 14, finalY + 18);

  doc.setFillColor(BRAND_PRIMARY[0], BRAND_PRIMARY[1], BRAND_PRIMARY[2]);
  doc.rect(140, finalY - 5, 60, 20, 'F');
  doc.setTextColor(255);
  doc.text("LÍQUIDO:", 145, finalY + 5);
  doc.setFontSize(16);
  doc.text(formatBRL(result.finalNetSalary), 195, finalY + 5, { align: 'right' });

  drawFooter(doc);
  doc.save('Holerite_2026_Simulado.pdf');
};

// 2. DÉCIMO TERCEIRO (13º)
export const generateThirteenthPdf = (result: ThirteenthResult) => {
  const doc = new jsPDF();
  drawHeader(doc, "DÉCIMO TERCEIRO 2026");

  const tableBody = [
    ['Salário Base Referência', formatBRL(result.totalGross), '-'],
    ['Médias (HE/Adicionais)', formatBRL(result.totalExtrasAverage), '-'],
    ['1ª Parcela (Adiantamento)', formatBRL(result.parcel1.value), '-'],
    ['2ª Parcela (Líquido)', formatBRL(result.parcel2.value), '-'],
    ['Desconto INSS (na 2ª Parc)', '-', formatBRL(result.parcel2.inss)],
    ['Desconto IRPF (na 2ª Parc)', '-', formatBRL(result.parcel2.irpf)],
    ...(result.parcel2.consignedDiscount > 0 ? [['Empréstimo Consignado', '-', formatBRL(result.parcel2.consignedDiscount)]] : []),
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Detalhamento 13º', 'Valores', 'Descontos']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: BRAND_ACCENT }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.text(`VALOR TOTAL LÍQUIDO: ${formatBRL(result.finalTotalNet)}`, 105, finalY, { align: 'center' });

  drawFooter(doc);
  doc.save('Decimo_Terceiro_2026.pdf');
};

// 3. FÉRIAS
export const generateVacationPdf = (result: VacationResult) => {
  const doc = new jsPDF();
  drawHeader(doc, "RECIBO DE FÉRIAS 2026");

  const tableBody = [
    ['Férias Brutas', formatBRL(result.vacationGross), '-'],
    ['1/3 Constitucional', formatBRL(result.vacationThird), '-'],
    ...(result.allowanceGross > 0 ? [['Abono Pecuniário', formatBRL(result.allowanceGross), '-']] : []),
    ...(result.allowanceThird > 0 ? [['1/3 Abono Pecuniário', formatBRL(result.allowanceThird), '-']] : []),
    ...(result.advanceThirteenth > 0 ? [['Adiantamento 13º', formatBRL(result.advanceThirteenth), '-']] : []),
    ['Desconto INSS', '-', formatBRL(result.discountInss)],
    ['Desconto IRPF', '-', formatBRL(result.discountIr)],
    ...(result.consignedDiscount > 0 ? [['Empréstimo Consignado', '-', formatBRL(result.consignedDiscount)]] : []),
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Proventos de Férias', 'Créditos', 'Débitos']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [22, 101, 52] } // Dark Green for vacations
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text(`LÍQUIDO DE FÉRIAS: ${formatBRL(result.finalNetVacation)}`, 195, finalY, { align: 'right' });

  drawFooter(doc);
  doc.save('Ferias_2026_Simulado.pdf');
};

// 4. RESCISÃO (TRCT SIMULADO)
export const generateTerminationPdf = (result: TerminationResult) => {
  const doc = new jsPDF();
  drawHeader(doc, "SIMULAÇÃO DE RESCISÃO");

  const tableBody = [
    ['Saldo de Salário', formatBRL(result.balanceSalary), '-'],
    ['Aviso Prévio', formatBRL(result.noticeWarning), formatBRL(result.noticeDeduction)],
    ['13º Salário Proporcional', formatBRL(result.thirteenthProportional), '-'],
    ['Férias Proporcionais + 1/3', formatBRL(result.vacationProportional + result.vacationThird), '-'],
    ...(result.vacationExpired > 0 ? [['Férias Vencidas + 1/3', formatBRL(result.vacationExpired), '-']] : []),
    ['Multa de 40% (Saldo FGTS)', formatBRL(result.fgtsFine), '-'],
    ['Desconto INSS / IRPF', '-', formatBRL(result.discountInss + result.discountIr)],
    ...(result.consignedDiscount > 0 ? [['Quitação Empréstimo', '-', formatBRL(result.consignedDiscount)]] : []),
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Verba Rescisória', 'Créditos', 'Débitos']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [153, 27, 27] } // Dark Red for termination
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(`Total FGTS para Saque (Estimativa): ${formatBRL(result.finalFgtsToWithdraw)}`, 14, finalY + 10);
  doc.setFontSize(14);
  doc.text(`TOTAL LÍQUIDO RESCISÃO: ${formatBRL(result.finalNetTermination)}`, 14, finalY + 25);

  drawFooter(doc);
  doc.save('Rescisao_2026_Simulada.pdf');
};

// 5. SIMULADOR IRPF 2026
export const generateIrpfPdf = (result: IrpfResult) => {
  const doc = new jsPDF();
  drawHeader(doc, "SIMULADOR IRPF 2026");

  const tableBody = [
    ['Base de Cálculo Bruta', formatBRL(result.baseSalary)],
    ['Dedução INSS', formatBRL(result.inssDeduction)],
    ['Dedução Dependentes', formatBRL(result.dependentsDeduction)],
    ['Base Legal (Com Deduções)', formatBRL(result.legalBase)],
    ['Base Simplificada', formatBRL(result.simplifiedBase)],
    ['Base Aplicada (Melhor Opção)', formatBRL(result.appliedBase)],
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Descrição do Cálculo', 'Valores']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [45, 10, 80] } // Purple for taxes
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, finalY, 182, 30, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setTextColor(BRAND_PRIMARY[0], BRAND_PRIMARY[1], BRAND_PRIMARY[2]);
  doc.text(`ALÍQUOTA EFETIVA: ${result.effectiveRate.toFixed(2)}%`, 20, finalY + 10);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`IMPOSTO DE RENDA: ${formatBRL(result.taxValue)}`, 20, finalY + 22);

  drawFooter(doc);
  doc.save('Simulacao_IRPF_2026.pdf');
};
