// Registration data management
// In-memory storage for registrations (in production, use a database)
const registrations: Array<{
  id: string;
  devotee: {
    name: string;
    email: string;
    contactNo: string;
    facilitator: string;
    area: string;
    level: string;
    medicalNotes?: string;
    accommodation: string;
  };
  payment: {
    paymentId: string;
    orderId: string;
    amount: number;
    status: string;
  };
  registrationTime: string;
}> = [];



export function getAllRegistrations() {
  return registrations;
}

export function getRegistrationStats() {
  const stats = {
    totalRegistrations: registrations.length,
    roomBookings: registrations.filter(reg => reg.devotee.accommodation === 'room').length,
    dormitoryBookings: registrations.filter(reg => reg.devotee.accommodation === 'dormitory').length,
    totalRevenue: registrations.reduce((sum, reg) => sum + reg.payment.amount, 0),
    facilitatorBreakdown: {} as Record<string, number>,
    areaBreakdown: {} as Record<string, number>,
    levelBreakdown: {} as Record<string, number>
  };

  // Calculate breakdowns
  registrations.forEach(reg => {
    // Facilitator breakdown
    const facilitatorKey = reg.devotee.facilitator;
    if (!stats.facilitatorBreakdown[facilitatorKey]) {
      stats.facilitatorBreakdown[facilitatorKey] = 0;
    }
    stats.facilitatorBreakdown[facilitatorKey]++;

    // Area breakdown
    const areaKey = reg.devotee.area;
    if (!stats.areaBreakdown[areaKey]) {
      stats.areaBreakdown[areaKey] = 0;
    }
    stats.areaBreakdown[areaKey]++;

    // Level breakdown
    const levelKey = reg.devotee.level;
    if (!stats.levelBreakdown[levelKey]) {
      stats.levelBreakdown[levelKey] = 0;
    }
    stats.levelBreakdown[levelKey]++;
  });

  return stats;
}