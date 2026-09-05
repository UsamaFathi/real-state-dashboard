import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { DealItem, DealStage } from '../types';

const stageLabels: Record<DealStage, string> = {
  new: 'New Lead / Ingestion',
  viewing_scheduled: 'Viewing Scheduled',
  negotiation: 'Under Negotiation',
  legal_documentation: 'Legal & Contract Review',
  closed_won: 'Closed Won (Contract Signed)',
  closed_lost: 'Closed Lost / Archived',
};

/**
 * Generates and downloads a clean, executive PDF summary of a deal and its key property details.
 */
export async function downloadDealSummaryPdf(
  deal: DealItem,
  onToast?: (msg: string) => void
): Promise<void> {
  try {
    const cleanCode = deal.code.replace(/[^a-zA-Z0-9_-]/g, '') || deal.id;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // ----------------------------------------------------
    // 1. TOP HEADER BRANDING BANNER
    // ----------------------------------------------------
    // Dark Slate Header Block
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Luxury Amber/Gold Accent Line
    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(0, 28, pageWidth, 2.5, 'F');

    // Brand Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('PALM DEVELOPMENTS & INVESTMENT ADVISORY', margin, 12);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(251, 191, 36); // amber-400
    doc.text('EXCLUSIVE REAL ESTATE ASSET DOSSIER & DEAL SUMMARY', margin, 18);

    // Document Reference & Generation Date on Right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(deal.code, pageWidth - margin, 12, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    const genDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    doc.text(`Generated: ${genDate} • Confidential`, pageWidth - margin, 18, { align: 'right' });

    // ----------------------------------------------------
    // 2. PROPERTY HERO OVERVIEW CARD
    // ----------------------------------------------------
    let currentY = 36;

    // Outer container background
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(margin, currentY, contentWidth, 38, 3, 3, 'FD');

    // Accent left stripe
    doc.setFillColor(217, 119, 6);
    doc.roundedRect(margin, currentY, 3, 38, 1, 1, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // slate-900
    const titleLines = doc.splitTextToSize(deal.title, contentWidth - 45);
    doc.text(titleLines, margin + 7, currentY + 8);

    // Price & Currency
    const priceFormatted = `${deal.price.toLocaleString()} ${deal.currency || 'AED'}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text(priceFormatted, margin + 7, currentY + 22);

    // Unit Price per sqm & Commission
    const pricePerSqm = Math.round(deal.price / deal.areaSqm).toLocaleString();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(
      `Unit Valuation: ${pricePerSqm} ${deal.currency}/m²  •  Est. Brokerage Fee: ${
        deal.commission
          ? `${deal.commission.toLocaleString()} ${deal.currency}`
          : 'Standard 2.0% Retainer'
      }`,
      margin + 7,
      currentY + 28
    );

    // Status / Stage Badge on the right
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(pageWidth - margin - 52, currentY + 5, 48, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('PIPELINE STAGE', pageWidth - margin - 28, currentY + 10, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const stageName = stageLabels[deal.stage] || deal.stage;
    doc.text(stageName, pageWidth - margin - 28, currentY + 15.5, { align: 'center' });

    // Priority Badge on right
    const priorityColor =
      deal.priority === 'High'
        ? [220, 38, 38]
        : deal.priority === 'Medium'
        ? [217, 119, 6]
        : [16, 185, 129];
    doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.roundedRect(pageWidth - margin - 52, currentY + 21, 48, 11, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`${deal.priority.toUpperCase()} PRIORITY`, pageWidth - margin - 28, currentY + 28, {
      align: 'center',
    });

    // ----------------------------------------------------
    // 3. KEY PROPERTY SPECIFICATIONS (METRIC GRID)
    // ----------------------------------------------------
    currentY += 43;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('KEY PROPERTY SPECIFICATIONS', margin, currentY);

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY + 2, margin + 65, currentY + 2);

    currentY += 6;

    // 6 Grid Metric Cells (3 columns x 2 rows)
    const gridMetrics = [
      { label: 'Property Typology', value: deal.propertyType },
      { label: 'Bedroom Configuration', value: `${deal.bedrooms} Bedrooms` },
      {
        label: 'Total Built-up Area',
        value: `${deal.areaSqm} m² (${Math.round(deal.areaSqm * 10.764)} sq.ft)`,
      },
      { label: 'Target Milestone Date', value: `${deal.dateLabel}: ${deal.dateValue}` },
      { label: 'Origin Channel / Source', value: deal.source },
      {
        label: 'Registered Asset Files',
        value: `${deal.filesCount} Files • ${deal.commentsCount} Logs`,
      },
    ];

    const cellWidth = (contentWidth - 6) / 3;
    const cellHeight = 16;

    gridMetrics.forEach((metric, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const cellX = margin + col * (cellWidth + 3);
      const cellY = currentY + row * (cellHeight + 3);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(cellX, cellY, cellWidth, cellHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(metric.label, cellX + 3.5, cellY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(metric.value, cellX + 3.5, cellY + 11.5);
    });

    // ----------------------------------------------------
    // 4. CLIENT & INVESTMENT TEAM INFORMATION
    // ----------------------------------------------------
    currentY += 2 * (cellHeight + 3) + 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('CLIENT & ADVISORY TEAM DETAILS', margin, currentY);

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY + 2, margin + 65, currentY + 2);

    currentY += 6;

    // Two column box for Client Info and Assigned Agents
    const halfWidth = (contentWidth - 4) / 2;
    const teamBoxHeight = 30;

    // Left: Client Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, halfWidth, teamBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Client Profile', margin + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Name:`, margin + 4, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(deal.client, margin + 20, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Email:`, margin + 4, currentY + 18);
    doc.setTextColor(30, 41, 59);
    doc.text(deal.clientEmail || 'Confidential / On Request', margin + 20, currentY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Phone:`, margin + 4, currentY + 24);
    doc.setTextColor(30, 41, 59);
    doc.text(deal.clientPhone || '+971 4 000 0000 (Central Desk)', margin + 20, currentY + 24);

    // Right: Advisory Team Box
    const rightBoxX = margin + halfWidth + 4;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(rightBoxX, currentY, halfWidth, teamBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Assigned Investment Advisors', rightBoxX + 4, currentY + 6);

    const agentNames =
      deal.assignedAgents.length > 0
        ? deal.assignedAgents.map((a) => a.name).join(', ')
        : 'Bronex Portfolio Services';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Brokers:`, rightBoxX + 4, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const agentLines = doc.splitTextToSize(agentNames, halfWidth - 25);
    doc.text(agentLines, rightBoxX + 20, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Status:`, rightBoxX + 4, currentY + 24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.text(`Verified Property Due Diligence Passed`, rightBoxX + 20, currentY + 24);

    // ----------------------------------------------------
    // 5. EXECUTIVE SUMMARY / PROPERTY NARRATIVE
    // ----------------------------------------------------
    currentY += teamBoxHeight + 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('EXECUTIVE ASSET NARRATIVE & DESCRIPTION', margin, currentY);

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY + 2, margin + 80, currentY + 2);

    currentY += 6;

    const descBoxHeight = 32;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, descBoxHeight, 2, 2, 'FD');

    const descText =
      deal.description ||
      `Prestigious ${deal.propertyType.toLowerCase()} investment asset situated in a prime Dubai metropolitan enclave. ` +
        `Engineered to international architectural standards, featuring open-plan living areas, floor-to-ceiling panoramic glass, ` +
        `and direct access to luxury lifestyle facilities and waterfront attractions. Immediate acquisition readiness with verified title deeds.`;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(descText, contentWidth - 8);
    doc.text(splitDesc, margin + 4, currentY + 7);

    // ----------------------------------------------------
    // 6. SCANNABLE QR CODE & DIGITAL VERIFICATION PORTAL
    // ----------------------------------------------------
    currentY += descBoxHeight + 8;

    // QR & Online Access Box
    const qrBoxHeight = 44;
    doc.setFillColor(15, 23, 42); // slate-900 dark contrast container
    doc.roundedRect(margin, currentY, contentWidth, qrBoxHeight, 3, 3, 'F');

    // Generate Scannable QR Code Data URL
    const listingUrl = `https://portal.palmdevelopments.com/real-estate/properties/listings/${cleanCode}?utm_source=deal_summary_pdf&utm_campaign=${cleanCode.toLowerCase()}`;

    try {
      const qrDataUrl = await QRCode.toDataURL(listingUrl, {
        margin: 1,
        width: 250,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });

      // White backplate for QR Code
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + 4, currentY + 4, 36, 36, 2, 2, 'F');
      doc.addImage(qrDataUrl, 'PNG', margin + 6, currentY + 6, 32, 32);
    } catch {
      // Graceful fallback if QR generation fails
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + 4, currentY + 4, 36, 36, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text('SCAN QR', margin + 12, currentY + 22);
    }

    // Text next to QR Code inside dark box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(251, 191, 36); // amber-400
    doc.text('SCAN WITH SMARTPHONE CAMERA FOR 3D TOUR', margin + 45, currentY + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240); // slate-200
    doc.text(
      'Instantly view interactive architectural floor plans, high-resolution photo galleries,',
      margin + 45,
      currentY + 18
    );
    doc.text(
      'verified title deed documents, and secure direct unit reservations on the digital portal.',
      margin + 45,
      currentY + 23
    );

    // Direct Listing URL line
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(56, 189, 248); // sky-400
    doc.text(listingUrl.slice(0, 65), margin + 45, currentY + 31);

    // Small reference code chip inside box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Digital Asset Identifier: ${deal.code}`, margin + 45, currentY + 37);

    // ----------------------------------------------------
    // 7. FOOTER DISCLAIMER & SECURITY STAMP
    // ----------------------------------------------------
    const footerY = pageHeight - 12;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'CONFIDENTIAL INVESTMENT MEMORANDUM — Prepared by Palm Developments Real Estate Investment Advisory CRM.',
      margin,
      footerY
    );
    doc.text(
      'All valuations and specifications subject to final contract verification. Unauthorized reproduction prohibited.',
      margin,
      footerY + 3.5
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Page 1 of 1 • Palm Developments', pageWidth - margin, footerY, { align: 'right' });

    // ----------------------------------------------------
    // TRIGGER DOWNLOAD
    // ----------------------------------------------------
    const fileName = `deal-summary-${cleanCode}.pdf`;
    doc.save(fileName);

    if (onToast) {
      onToast(`Downloaded PDF deal summary: ${deal.code}`);
    }
  } catch (error) {
    console.error('Failed to generate deal PDF:', error);
    if (onToast) {
      onToast(`Error generating PDF for ${deal.code}`);
    }
  }
}
