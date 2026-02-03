
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult } from '../types';

export const generatePayslipPdf = (result: CalculationResult) => {
  const doc = new jsPDF();

  // -- CORES & ESTILO --
  const primaryColor = [29, 78, 216]; // Blue 700
  const secondaryColor = [71, 85, 105]; // Slate 600

  // -- CABEÇALHO --
  doc.setFillColor(29, 78, 216);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("HOLERITE SIMULADO", 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("CalculadoraSalario2026.com.br", 105, 27, { align: 'center' });

  // -- INFO DO FUNCIONÁRIO (SIMULADO) --
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Data da Simulação: ${new Date().toLocaleDateString('pt-BR')}`, 14, 40);
  doc.text(`Ref: ${new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}`, 14, 45);

  // -- TABELA DE VENCIMENTOS E DESCONTOS --
  const tableBody = [];

  // Ganhos
  tableBody.push(['Salário Base', `R$ ${result.grossSalary.toFixed(2)}`, '0,00']);

  if (result.familySalary > 0) {
      tableBody.push(['Salário Família', `R$ ${result.familySalary.toFixed(2)}`, '0,00']);
  }
  if (result.totalExtras > 0) {
      tableBody.push(['Horas Extras / Adicionais', `R$ ${result.totalExtras.toFixed(2)}`, '0,00']);
  }

  // Descontos
  tableBody.push(['INSS (Previdência Social)', '0,00', `R$ ${result.inss.toFixed(2)}`]);

  if (result.irpf > 0) {
      tableBody.push(['IRRF (Imposto de Renda)', '0,00', `R$ ${result.irpf.toFixed(2)}`]);
  }
  if (result.transportVoucher > 0) {
      tableBody.push(['Vale Transporte', '0,00', `R$ ${result.transportVoucher.toFixed(2)}`]);
  }
  if (result.healthInsurance > 0) {
      tableBody.push(['Plano de Saúde', '0,00', `R$ ${result.healthInsurance.toFixed(2)}`]);
  }
  if (result.otherDiscounts > 0) {
      tableBody.push(['Outros Descontos', '0,00', `R$ ${result.otherDiscounts.toFixed(2)}`]);
  }
  if (result.consignedDiscount > 0) {
      tableBody.push(['Empréstimo Consignado', '0,00', `R$ ${result.consignedDiscount.toFixed(2)}`]);
  }

  // Totais
  const totalGross = result.grossSalary + result.totalExtras + result.familySalary;
  const totalDiscounts = result.totalDiscounts + result.consignedDiscount;

  autoTable(doc, {
    startY: 55,
    head: [['Descrição', 'Vencimentos', 'Descontos']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [71, 85, 105], halign: 'center' },
    columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'right', textColor: [22, 163, 74] }, // Green
        2: { cellWidth: 40, halign: 'right', textColor: [220, 38, 38] }  // Red
    },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // -- RODAPÉ DE TOTAIS --
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Total Vencimentos", 60, finalY, { align: 'right' });
  doc.text(`R$ ${totalGross.toFixed(2)}`, 90, finalY, { align: 'right' });

  doc.text("Total Descontos", 130, finalY, { align: 'right' });
  doc.text(`R$ ${totalDiscounts.toFixed(2)}`, 160, finalY, { align: 'right' });

  // LÍQUIDO DESTACADO
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(10, finalY + 10, 190, 25, 3, 3, 'FD');

  doc.setFontSize(14);
  doc.setTextColor(29, 78, 216); // Blue
  doc.text("LÍQUIDO A RECEBER", 105, finalY + 20, { align: 'center' });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`R$ ${result.finalNetSalary.toFixed(2)}`, 105, finalY + 30, { align: 'center' });

  // -- RODAPÉ FGTS --
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`FGTS do Mês (Não descontado): R$ ${result.fgtsMonthly.toFixed(2)}`, 14, finalY + 45);

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("* Este documento é uma simulação e não possui valor legal.", 105, 280, { align: 'center' });

  // Salvar
  doc.save('Holerite_Simulado_2026.pdf');
};
