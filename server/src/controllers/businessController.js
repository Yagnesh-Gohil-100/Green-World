const CarbonFootprint = require("../models/CarbonFootprint");
const Goal = require("../models/Goal");
const Employee = require("../models/Employee");

// Get team statistics for employee dashboard
exports.getTeamStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.userType;

    // Verify user is an employee
    if (userType !== 'employee') {
      return res.status(403).json({
        success: false,
        error: "Access denied. Only employees can view team stats."
      });
    }

    // Get current employee to find their organization
    const currentEmployee = await Employee.findById(userId);
    if (!currentEmployee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    const organizationId = currentEmployee.organizationId;

    // Get all employees in the same organization
    const teamEmployees = await Employee.find({ organizationId })
      .select('name email')
      .lean();

    // Get carbon data for all team members
    const teamCarbonData = await CarbonFootprint.aggregate([
      {
        $match: {
          userType: 'Employee',
          userId: { $in: teamEmployees.map(emp => emp._id) }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalTransport: { $sum: '$transport' },
          totalEnergy: { $sum: '$energy' },
          totalWaste: { $sum: '$waste' },
          entryCount: { $sum: 1 },
          latestEntry: { $last: '$$ROOT' }
        }
      }
    ]);

    // Calculate carbon footprints
    const TRANSPORT_FACTOR = 0.21;
    const ENERGY_FACTOR = 0.475;
    const WASTE_FACTOR = 0.7;

    const teamStats = teamCarbonData.map(data => {
      const footprint = 
        (data.totalTransport * TRANSPORT_FACTOR) +
        (data.totalEnergy * ENERGY_FACTOR) +
        (data.totalWaste * WASTE_FACTOR);

      return {
        employeeId: data._id,
        totalFootprint: footprint,
        entryCount: data.entryCount,
        lastActivity: data.latestEntry?.date
      };
    });

    // Find current user's stats
    const currentUserStats = teamStats.find(stats => 
      stats.employeeId.toString() === userId.toString()
    );

    // Calculate rankings
    const sortedStats = [...teamStats].sort((a, b) => 
      a.totalFootprint - b.totalFootprint
    );

    const currentUserRank = sortedStats.findIndex(stats => 
      stats.employeeId.toString() === userId.toString()
    ) + 1;

    const totalEmployees = sortedStats.length;
    const topPercent = Math.round((currentUserRank / totalEmployees) * 100);

    // Get best footprint in team
    const bestFootprint = sortedStats[0]?.totalFootprint || 0;

    // Calculate team average
    const totalTeamFootprint = teamStats.reduce((sum, stats) => 
      sum + stats.totalFootprint, 0
    );
    const averageFootprint = totalEmployees > 0 ? 
      totalTeamFootprint / totalEmployees : 0;

    res.status(200).json({
      success: true,
      data: {
        rank: currentUserRank,
        totalEmployees,
        topPercent,
        averageFootprint: averageFootprint.toFixed(1),
        bestFootprint: bestFootprint.toFixed(1),
        yourFootprint: currentUserStats?.totalFootprint.toFixed(1) || '0.0',
        teamMembers: teamEmployees.map(emp => ({
          id: emp._id,
          name: emp.name,
          email: emp.email
        }))
      }
    });

  } catch (err) {
    console.error("Get team stats error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching team statistics"
    });
  }
};

// Get employee details for admin view
exports.getEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const userType = req.userType;

    // Verify user is a business admin
    if (userType !== 'business') {
      return res.status(403).json({
        success: false,
        error: "Access denied. Only business admins can view employee details."
      });
    }

    // Get employee details
    const employee = await Employee.findById(employeeId)
      .select('name email organization createdAt profile')
      .lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found"
      });
    }

    // Get employee's carbon footprint data
    const carbonData = await CarbonFootprint.find({
      userId: employeeId,
      userType: 'Employee'
    })
    .sort({ date: -1 })
    .limit(30)
    .lean();

    // Get employee's goals
    const goals = await Goal.findOne({
      userId: employeeId,
      userType: 'Employee'
    })
    .sort({ createdAt: -1 })
    .lean();

    // Calculate statistics
    const TRANSPORT_FACTOR = 0.21;
    const ENERGY_FACTOR = 0.475;
    const WASTE_FACTOR = 0.7;

    const totalFootprint = carbonData.reduce((total, entry) => {
      return total + (
        (entry.transport * TRANSPORT_FACTOR) +
        (entry.energy * ENERGY_FACTOR) +
        (entry.waste * WASTE_FACTOR)
      );
    }, 0);

    const averageDailyFootprint = carbonData.length > 0 ? 
      totalFootprint / carbonData.length : 0;

    // Calculate goal progress if goals exist
    let goalProgress = null;
    if (goals && carbonData.length > 0) {
      const latestEntry = carbonData[0];
      goalProgress = {
        transport: Math.round((latestEntry.transport / goals.transport) * 100),
        energy: Math.round((latestEntry.energy / goals.energy) * 100),
        waste: Math.round((latestEntry.waste / goals.waste) * 100)
      };
    }

    res.status(200).json({
      success: true,
      data: {
        employee,
        stats: {
          totalEntries: carbonData.length,
          totalFootprint: totalFootprint.toFixed(1),
          averageDailyFootprint: averageDailyFootprint.toFixed(1),
          lastActivity: carbonData[0]?.date || null
        },
        goals,
        goalProgress,
        recentActivities: carbonData.slice(0, 10)
      }
    });

  } catch (err) {
    console.error("Get employee details error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching employee details"
    });
  }
};

// Get all employees for business admin
exports.getAllEmployees = async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.userType;

    // Verify user is a business admin
    if (userType !== 'business') {
      return res.status(403).json({
        success: false,
        error: "Access denied. Only business admins can view employees."
      });
    }

    // Get current business to find employees
    const business = await Business.findById(userId);
    if (!business) {
      return res.status(404).json({
        success: false,
        error: "Business not found"
      });
    }

    // Get all employees with their stats
    const employees = await Employee.find({ organizationId: userId })
      .select('name email createdAt profile isVerified')
      .lean();

    // Get carbon data for all employees
    const employeeIds = employees.map(emp => emp._id);
    
    const carbonData = await CarbonFootprint.aggregate([
      {
        $match: {
          userType: 'Employee',
          userId: { $in: employeeIds }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalEntries: { $sum: 1 },
          totalTransport: { $sum: '$transport' },
          totalEnergy: { $sum: '$energy' },
          totalWaste: { $sum: '$waste' },
          lastActivity: { $max: '$date' }
        }
      }
    ]);

    // Calculate footprints and merge data
    const employeesWithStats = employees.map(employee => {
      const carbonStats = carbonData.find(data => 
        data._id.toString() === employee._id.toString()
      );

      const footprint = carbonStats ? 
        (carbonStats.totalTransport * 0.21) +
        (carbonStats.totalEnergy * 0.475) +
        (carbonStats.totalWaste * 0.7) : 0;

      return {
        ...employee,
        stats: {
          totalEntries: carbonStats?.totalEntries || 0,
          totalFootprint: footprint.toFixed(1),
          lastActivity: carbonStats?.lastActivity || null,
          sustainabilityScore: employee.profile?.sustainabilityScore || 0
        }
      };
    });

    // Sort by sustainability score (descending)
    employeesWithStats.sort((a, b) => 
      b.stats.sustainabilityScore - a.stats.sustainabilityScore
    );

    res.status(200).json({
      success: true,
      data: {
        totalEmployees: employees.length,
        employees: employeesWithStats
      }
    });

  } catch (err) {
    console.error("Get all employees error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching employees"
    });
  }
};