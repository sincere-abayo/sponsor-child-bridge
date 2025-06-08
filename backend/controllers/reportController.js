const pool = require('../config/database');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Generate sponsorship report
exports.generateSponsorshipReport = async (req, res) => {
  // Only admins and sponsors can generate reports
  if (req.user.role !== 'admin' && req.user.role !== 'sponsor') {
    return res.status(403).json({ message: 'Not authorized to generate reports' });
  }

  const { startDate, endDate, status } = req.query;
  let query = '';
  let queryParams = [];

  try {
    // For sponsors, only show their sponsorships
    if (req.user.role === 'sponsor') {
      query = `
        SELECT s.*, 
          u.first_name as receiver_first_name, 
          u.last_name as receiver_last_name,
          c.confirmation_date,
          c.proof_image
        FROM sponsorships s
        JOIN users u ON s.receiver_id = u.user_id
        LEFT JOIN confirmations c ON s.sponsorship_id = c.sponsorship_id
        WHERE s.sponsor_id = ?
      `;
      queryParams.push(req.user.id);
    } else {
      // For admins, show all sponsorships
      query = `
        SELECT s.*, 
          sp.first_name as sponsor_first_name, 
          sp.last_name as sponsor_last_name,
          rc.first_name as receiver_first_name, 
          rc.last_name as receiver_last_name,
          c.confirmation_date,
          c.proof_image
        FROM sponsorships s
        JOIN users sp ON s.sponsor_id = sp.user_id
        JOIN users rc ON s.receiver_id = rc.user_id
        LEFT JOIN confirmations c ON s.sponsorship_id = c.sponsorship_id
      `;
    }

    // Add filters
    let whereAdded = false;
    if (req.user.role === 'sponsor') {
      whereAdded = true;
    }

    if (startDate) {
      if (whereAdded) {
        query += ' AND';
      } else {
        query += ' WHERE';
        whereAdded = true;
      }
      query += ' s.start_date >= ?';
      queryParams.push(startDate);
    }

    if (endDate) {
      if (whereAdded) {
        query += ' AND';
      } else {
        query += ' WHERE';
        whereAdded = true;
      }
      query += ' s.start_date <= ?';
      queryParams.push(endDate);
    }

    if (status) {
      if (whereAdded) {
        query += ' AND';
      } else {
        query += ' WHERE';
      }
      query += ' s.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY s.created_at DESC';

    const [sponsorships] = await pool.query(query, queryParams);

    // Calculate totals
    const totalAmount = sponsorships.reduce((sum, s) => sum + parseFloat(s.amount), 0);
    const confirmedCount = sponsorships.filter(s => s.status === 'confirmed').length;
    const pendingCount = sponsorships.filter(s => s.status === 'pending').length;

    // Create report record
    const reportTitle = `Sponsorship Report ${new Date().toISOString().split('T')[0]}`;
    const [result] = await pool.query(
      'INSERT INTO reports (title, description, generated_by, report_type) VALUES (?, ?, ?, ?)',
      [
        reportTitle,
        `Report generated with ${sponsorships.length} sponsorships. Total amount: ${totalAmount}`,
        req.user.id,
        'sponsorship'
      ]
    );

    res.json({
      reportId: result.insertId,
      title: reportTitle,
      generatedAt: new Date(),
      data: {
        sponsorships,
        summary: {
          totalCount: sponsorships.length,
          totalAmount,
          confirmedCount,
          pendingCount
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Generate financial report (admin only)
exports.generateFinancialReport = async (req, res) => {
  // Only admins can generate financial reports
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to generate financial reports' });
  }

  const { year, month } = req.query;
  
  try {
    let query = `
      SELECT 
        SUM(amount) as total_amount,
        currency,
        status,
        YEAR(start_date) as year,
        MONTH(start_date) as month
      FROM sponsorships
    `;

    let queryParams = [];
    let whereAdded = false;

    if (year) {
      query += ' WHERE YEAR(start_date) = ?';
      queryParams.push(year);
      whereAdded = true;
    }

    if (month) {
      if (whereAdded) {
        query += ' AND';
      } else {
        query += ' WHERE';
      }
      query += ' MONTH(start_date) = ?';
      queryParams.push(month);
    }

    query += ' GROUP BY currency, status, YEAR(start_date), MONTH(start_date)';
    query += ' ORDER BY YEAR(start_date) DESC, MONTH(start_date) DESC';

    const [financialData] = await pool.query(query, queryParams);

    // Create report record
    const reportTitle = `Financial Report ${year || 'All Years'}${month ? '-' + month : ''}`;
    const [result] = await pool.query(
      'INSERT INTO reports (title, description, generated_by, report_type) VALUES (?, ?, ?, ?)',
      [
        reportTitle,
        `Financial report generated for ${year || 'all years'}${month ? ', month ' + month : ''}`,
        req.user.id,
        'financial'
      ]
    );

    res.json({
      reportId: result.insertId,
      title: reportTitle,
      generatedAt: new Date(),
      data: financialData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Generate activity report
exports.generateActivityReport = async (req, res) => {
  // Only admins can generate activity reports
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to generate activity reports' });
  }

  const { startDate, endDate } = req.query;
  
  try {
    // Get new users count
    let userQuery = `
      SELECT COUNT(*) as count, role
      FROM users
      WHERE 1=1
    `;
    
    let queryParams = [];
    
    if (startDate) {
      userQuery += ' AND created_at >= ?';
      queryParams.push(startDate);
    }
    
    if (endDate) {
      userQuery += ' AND created_at <= ?';
      queryParams.push(endDate);
    }
    
    userQuery += ' GROUP BY role';
    
    const [userData] = await pool.query(userQuery, queryParams);
    
    // Get sponsorship stats
    let sponsorshipQuery = `
      SELECT COUNT(*) as count, status
      FROM sponsorships
      WHERE 1=1
    `;
    
    queryParams = [];
    
    if (startDate) {
      sponsorshipQuery += ' AND created_at >= ?';
      queryParams.push(startDate);
    }
    
    if (endDate) {
      sponsorshipQuery += ' AND created_at <= ?';
      queryParams.push(endDate);
    }
    
    sponsorshipQuery += ' GROUP BY status';
    
    const [sponsorshipData] = await pool.query(sponsorshipQuery, queryParams);
    
    // Get confirmation stats
    let confirmationQuery = `
      SELECT COUNT(*) as count
      FROM confirmations
      WHERE 1=1
    `;
    
    queryParams = [];
    
    if (startDate) {
      confirmationQuery += ' AND confirmation_date >= ?';
      queryParams.push(startDate);
    }
    
    if (endDate) {
      confirmationQuery += ' AND confirmation_date <= ?';
      queryParams.push(endDate);
    }
    
    const [confirmationData] = await pool.query(confirmationQuery, queryParams);
    
    // Create report record
    const reportTitle = `Activity Report ${new Date().toISOString().split('T')[0]}`;
    const [result] = await pool.query(
      'INSERT INTO reports (title, description, generated_by, report_type) VALUES (?, ?, ?, ?)',
      [
        reportTitle,
        `Activity report generated for period ${startDate || 'beginning'} to ${endDate || 'now'}`,
        req.user.id,
        'activity'
      ]
    );

    res.json({
      reportId: result.insertId,
      title: reportTitle,
      generatedAt: new Date(),
      data: {
        users: userData,
        sponsorships: sponsorshipData,
        confirmations: confirmationData[0] ? confirmationData[0].count : 0
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all reports (admin only)
exports.getAllReports = async (req, res) => {
  try {
    let query = `
      SELECT r.*, u.first_name, u.last_name
      FROM reports r
      JOIN users u ON r.generated_by = u.user_id
    `;
    
    // If not admin, only show reports generated by the user
    if (req.user.role !== 'admin') {
      query += ' WHERE r.generated_by = ?';
      const [reports] = await pool.query(query, [req.user.id]);
      return res.json(reports);
    }
    
    // For admin, show all reports
    query += ' ORDER BY r.created_at DESC';
    const [reports] = await pool.query(query);
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
    try {
      const [reports] = await pool.query(
        `SELECT r.*, u.first_name, u.last_name
        FROM reports r
        JOIN users u ON r.generated_by = u.user_id
        WHERE r.report_id = ?`,
        [req.params.id]
      );
  
      if (reports.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      const report = reports[0];
      
      // If not admin and not the report generator, restrict access
      if (req.user.role !== 'admin' && req.user.id !== report.generated_by) {
        return res.status(403).json({ message: 'Not authorized to view this report' });
      }
  
      res.json(report);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Delete report (admin only)
  exports.deleteReport = async (req, res) => {
    try {
      const [reports] = await pool.query(
        'SELECT * FROM reports WHERE report_id = ?',
        [req.params.id]
      );
  
      if (reports.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Only admin or report creator can delete
      if (req.user.role !== 'admin' && req.user.id !== reports[0].generated_by) {
        return res.status(403).json({ message: 'Not authorized to delete this report' });
      }
  
      await pool.query(
        'DELETE FROM reports WHERE report_id = ?',
        [req.params.id]
      );
  
      res.json({ message: 'Report deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Export report to CSV
  exports.exportReportToCsv = async (req, res) => {
    try {
      const [reports] = await pool.query(
        'SELECT * FROM reports WHERE report_id = ?',
        [req.params.id]
      );
  
      if (reports.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      const report = reports[0];
  
      // If not admin and not the report generator, restrict access
      if (req.user.role !== 'admin' && req.user.id !== report.generated_by) {
        return res.status(403).json({ message: 'Not authorized to export this report' });
      }
  
      let data = [];
      let headers = [];
  
      // Get report data based on report type
      if (report.report_type === 'sponsorship') {
        const [sponsorships] = await pool.query(
          `SELECT 
            s.sponsorship_id, s.amount, s.currency, s.purpose, s.status, 
            s.start_date, s.end_date, s.frequency,
            sp.first_name as sponsor_first_name, sp.last_name as sponsor_last_name,
            rc.first_name as receiver_first_name, rc.last_name as receiver_last_name,
            c.confirmation_date
          FROM sponsorships s
          JOIN users sp ON s.sponsor_id = sp.user_id
          JOIN users rc ON s.receiver_id = rc.user_id
          LEFT JOIN confirmations c ON s.sponsorship_id = c.sponsorship_id
          WHERE s.created_at BETWEEN ? AND ?
          ORDER BY s.created_at DESC`,
          [report.start_date || '1970-01-01', report.end_date || new Date()]
        );
  
        data = sponsorships;
        headers = [
          'Sponsorship ID', 'Amount', 'Currency', 'Purpose', 'Status',
          'Start Date', 'End Date', 'Frequency',
          'Sponsor First Name', 'Sponsor Last Name',
          'Receiver First Name', 'Receiver Last Name',
          'Confirmation Date'
        ];
      } else if (report.report_type === 'financial') {
        const [financialData] = await pool.query(
          `SELECT 
            SUM(amount) as total_amount,
            currency,
            status,
            YEAR(start_date) as year,
            MONTH(start_date) as month
          FROM sponsorships
          GROUP BY currency, status, YEAR(start_date), MONTH(start_date)
          ORDER BY YEAR(start_date) DESC, MONTH(start_date) DESC`
        );
  
        data = financialData;
        headers = ['Total Amount', 'Currency', 'Status', 'Year', 'Month'];
      } else if (report.report_type === 'activity') {
        // For activity report, we need to combine multiple queries
        const [userData] = await pool.query(
          `SELECT COUNT(*) as count, role, DATE(created_at) as date
          FROM users
          GROUP BY role, DATE(created_at)
          ORDER BY DATE(created_at) DESC`
        );
  
        const [sponsorshipData] = await pool.query(
          `SELECT COUNT(*) as count, status, DATE(created_at) as date
          FROM sponsorships
          GROUP BY status, DATE(created_at)
          ORDER BY DATE(created_at) DESC`
        );
  
        // Combine data
        data = [...userData.map(u => ({...u, type: 'user'})), 
                ...sponsorshipData.map(s => ({...s, type: 'sponsorship'}))];
        headers = ['Count', 'Type', 'Role/Status', 'Date'];
      }
  
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      data.forEach(row => {
        const values = headers.map(header => {
          const key = header.toLowerCase().replace(/ /g, '_');
          return row[key] !== undefined ? `"${row[key]}"` : '""';
        });
        csvContent += values.join(',') + '\n';
      });
  
      // Create file path
      const fileName = `report_${report.report_id}_${Date.now()}.csv`;
      const filePath = path.join(__dirname, '../exports', fileName);
      
      // Ensure directory exists
      if (!fs.existsSync(path.join(__dirname, '../exports'))) {
        fs.mkdirSync(path.join(__dirname, '../exports'), { recursive: true });
      }
      
      // Write file
      fs.writeFileSync(filePath, csvContent);
      
      // Update report with file path
      await pool.query(
        'UPDATE reports SET export_path = ? WHERE report_id = ?',
        [fileName, report.report_id]
      );
      
      // Send file
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          return res.status(500).send('Error downloading file');
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  