import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PunchRecord } from '../types/punch';

interface ReportData {
  startDate: Date;
  endDate: Date;
  records: PunchRecord[];
  totalHours: number;
  totalDays: number;
}

export const generatePDFReport = async (reportData: ReportData): Promise<string> => {
  const { startDate, endDate, records, totalHours, totalDays } = reportData;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '--';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const generateRecordsHTML = () => {
    if (records.length === 0) {
      return '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No punch records found for this date range</td></tr>';
    }

    return records.map(record => {
      const date = new Date(record.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #374151;">${dayName}</div>
            <div style="font-size: 14px; color: #6b7280;">${dateStr}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="font-family: monospace; font-size: 16px;">${formatTime(record.punchIn)}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="font-family: monospace; font-size: 16px;">${formatTime(record.punchOut)}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            <span style="font-weight: 600; color: #059669;">${formatDuration(record.totalHours)}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="font-size: 14px; color: #6b7280;">${record.notes || '-'}</span>
          </td>
        </tr>
      `;
    }).join('');
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Time Tracking Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f9fafb;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .summary {
          padding: 30px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .summary-item {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .summary-value {
          font-size: 24px;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 5px;
        }
        .summary-label {
          font-size: 14px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 30px;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #f9fafb;
          padding: 15px 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer {
          padding: 20px 30px;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .generated-date {
          margin-top: 10px;
          font-size: 12px;
          opacity: 0.7;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Time Tracking Report</h1>
          <p>${formatDate(startDate)} - ${formatDate(endDate)}</p>
        </div>
        
        <div class="summary">
          <h2 class="section-title">Summary</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">${totalDays}</div>
              <div class="summary-label">Days</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${records.length}</div>
              <div class="summary-label">Records</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${formatDuration(totalHours)}</div>
              <div class="summary-label">Total Hours</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${totalDays > 0 ? formatDuration(totalHours / totalDays) : '--'}</div>
              <div class="summary-label">Avg/Day</div>
            </div>
          </div>
        </div>
        
        <div class="content">
          <h2 class="section-title">Punch Records</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th style="text-align: center;">Punch In</th>
                <th style="text-align: center;">Punch Out</th>
                <th style="text-align: center;">Hours</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${generateRecordsHTML()}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <div>Generated by MonHeure Time Tracking App</div>
          <div class="generated-date">Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const options = {
      html,
      fileName: `TimeReport_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    return file.filePath || '';
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}; 