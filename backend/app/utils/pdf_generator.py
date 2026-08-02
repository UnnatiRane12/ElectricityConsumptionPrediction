import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing, Rect, String, Group, Line

def generate_bill_pdf(bill_data: dict, customer_name: str, customer_email: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0284C7'),
        alignment=0
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748B'),
        alignment=0
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6
    )
    
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155')
    )
    
    bold_style = ParagraphStyle(
        'BoldText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0F172A')
    )

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>⚡ POWERPREDICT</b><br/><font size=8 color='#64748B'>Smart Electricity Analytics & Billing</font>", title_style),
            Paragraph(f"<b>ELECTRICITY INVOICE</b><br/><font size=9 color='#0284C7'><b>Bill #: {bill_data.get('bill_number', 'INV-0000')}</b></font><br/><font size=8 color='#64748B'>Date: {datetime.now().strftime('%Y-%m-%d')}</font>", ParagraphStyle('HeaderRight', alignment=2, parent=subtitle_style))
        ]
    ]
    header_table = Table(header_data, colWidths=[270, 270])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0EA5E9'), spaceBefore=5, spaceAfter=15))
    
    # 2. Customer & Bill Details
    pred_type = str(bill_data.get('prediction_type', 'monthly')).title()
    category = str(bill_data.get('category', 'Standard User'))
    
    customer_info = [
        [Paragraph("<b>CUSTOMER DETAILS</b>", section_heading), Paragraph("<b>PREDICTION DETAILS</b>", section_heading)],
        [Paragraph(f"<b>Name:</b> {customer_name}", normal_style), Paragraph(f"<b>Prediction Type:</b> {pred_type} Consumption", normal_style)],
        [Paragraph(f"<b>Email:</b> {customer_email}", normal_style), Paragraph(f"<b>Predicted Units:</b> {bill_data.get('predicted_units', 0.0):.2f} kWh", normal_style)],
        [Paragraph("<b>Account ID:</b> CUST-" + str(bill_data.get('user_id', 101)), normal_style), Paragraph(f"<b>Customer Category:</b> {category}", normal_style)]
    ]
    info_table = Table(customer_info, colWidths=[270, 270])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 15))
    
    # 3. Itemized Charges Table
    units = bill_data.get('predicted_units', 0.0)
    rate = bill_data.get('tariff_rate', 6.5)
    energy_charge = bill_data.get('energy_charge', 0.0)
    fixed_charge = bill_data.get('fixed_charge', 0.0)
    taxes = bill_data.get('taxes', 0.0)
    total_amount = bill_data.get('total_amount', 0.0)
    
    charges_data = [
        [Paragraph("<b>Description</b>", bold_style), Paragraph("<b>Rate / Unit</b>", bold_style), Paragraph("<b>Units (kWh)</b>", bold_style), Paragraph("<b>Amount (INR)</b>", bold_style)],
        [Paragraph("Energy Consumption Charge", normal_style), Paragraph(f"₹{rate:.2f} / kWh", normal_style), Paragraph(f"{units:.2f}", normal_style), Paragraph(f"₹{energy_charge:.2f}", normal_style)],
        [Paragraph("Fixed Grid Service Charge", normal_style), Paragraph("-", normal_style), Paragraph("-", normal_style), Paragraph(f"₹{fixed_charge:.2f}", normal_style)],
        [Paragraph("State Electricity Duty & Taxes (8%)", normal_style), Paragraph("8.0%", normal_style), Paragraph("-", normal_style), Paragraph(f"₹{taxes:.2f}", normal_style)],
        [Paragraph("<b>TOTAL PAYABLE AMOUNT</b>", bold_style), Paragraph("", bold_style), Paragraph("", bold_style), Paragraph(f"<b>₹{total_amount:.2f}</b>", ParagraphStyle('TotalStyle', parent=bold_style, fontSize=11, textColor=colors.HexColor('#059669')))]
    ]
    
    charges_table = Table(charges_data, colWidths=[220, 100, 100, 120])
    charges_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E2E8F0')),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -2), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#ECFDF5')),
        ('LINEABOVE', (0, -1), (-1, -1), 1.5, colors.HexColor('#10B981')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(charges_table)
    story.append(Spacer(1, 20))
    
    # 4. Footer & QR Code Placeholder
    qr_drawing = Drawing(100, 100)
    qr_drawing.add(Rect(0, 0, 90, 90, fillColor=colors.HexColor('#F8FAFC'), strokeColor=colors.HexColor('#0EA5E9'), strokeWidth=1.5, rx=5, ry=5))
    qr_drawing.add(String(12, 50, "QR CODE", fontSize=10, fontName="Helvetica-Bold", fillColor=colors.HexColor('#0284C7')))
    qr_drawing.add(String(8, 35, "[SCAN TO PAY]", fontSize=7, fontName="Helvetica", fillColor=colors.HexColor('#64748B')))
    
    footer_text = Paragraph(
        "<b>Payment Terms & Smart Energy Tips:</b><br/>"
        "• This bill is generated using PowerPredict AI machine learning engine.<br/>"
        "• Pay before due date to avoid late payment surcharge.<br/>"
        "• Optimize HVAC thermostat to 24°C to save up to 15% on future bills.<br/>"
        "• For support contact: support@powerpredict.ai",
        subtitle_style
    )
    
    footer_table = Table([[footer_text, qr_drawing]], colWidths=[420, 120])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(footer_table)
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
