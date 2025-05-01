import express, { Request, Response } from 'express';
import prisma from '../client';

const router = express.Router();

interface UserIdParams {
  userId: string;
}

const getUserHistory = async (req: Request<UserIdParams>, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).json({ success: false, error: 'Invalid user ID' });
    return;
  }

  try {
    const scans = await prisma.scan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        target: true,
        createdAt: true,
        type: true,
        status: true,
        scanResult: true,
        reportPath: true,
      },
    });

    const formatted = scans.map(scan => ({
      target: scan.target,
      scanDate: scan.createdAt,
      scanType: scan.type,
      status: scan.status,
      actions: {
        viewReport: scan.scanResult,
        downloadPdf: scan.reportPath,
      },
    }));

    res.status(200).json({ success: true, data: formatted });
    return;
  } catch (error) {
    console.error('Error fetching user scan history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch scan history' });
    return;
  }
};

router.get('/:userId', getUserHistory);

export default router;