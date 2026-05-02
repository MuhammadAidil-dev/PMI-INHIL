import { Request, Response } from 'express';
import { HTTP_CODE } from '@/common/error/httpCode';
import { transactionService } from './transaction.service';
import { QueryTransactionDto } from './transaction.type';

class TransactionController {
  /**
   * POST /transactions/in
   */
  async createIn(req: Request, res: Response): Promise<void> {
    const dto = res.locals.body;
    const adminId = (req as any).admin._id.toString();

    const transaction = await transactionService.createIn(dto, adminId);

    res.status(HTTP_CODE.CREATED).json({
      success: true,
      message: 'Transaksi darah masuk berhasil dicatat',
      data: transaction,
    });
  }

  /**
   * POST /transactions/out
   */
  async createOut(req: Request, res: Response): Promise<void> {
    const dto = res.locals.body;
    const adminId = (req as any).admin._id.toString();

    const transaction = await transactionService.createOut(dto, adminId);

    res.status(HTTP_CODE.CREATED).json({
      success: true,
      message: 'Transaksi darah keluar berhasil dicatat',
      data: transaction,
    });
  }

  /**
   * GET /transactions
   */
  async getAll(req: Request, res: Response): Promise<void> {
    const query: QueryTransactionDto = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      type: req.query.type as any,
      bloodType: req.query.bloodType as any,
      rhesus: req.query.rhesus as any,
      component: req.query.component as any,
      status: req.query.status as any,
      donorId: req.query.donorId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string,
    };

    const result = await transactionService.getAll(query);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Daftar transaksi berhasil diambil',
      ...result,
    });
  }

  /**
   * GET /transactions/stats
   */
  async getStats(req: Request, res: Response): Promise<void> {
    const stats = await transactionService.getStats();

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Statistik transaksi berhasil diambil',
      data: stats,
    });
  }

  /**
   * GET /transactions/donor/:donorId
   */
  async getByDonor(req: Request, res: Response): Promise<void> {
    const { donorId } = req.params;
    const transactions = await transactionService.getByDonor(donorId);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Riwayat donor berhasil diambil',
      data: transactions,
    });
  }

  /**
   * GET /transactions/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const transaction = await transactionService.getById(id);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Detail transaksi berhasil diambil',
      data: transaction,
    });
  }

  /**
   * PATCH /transactions/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = res.locals.body;
    const transaction = await transactionService.update(id, dto);

    res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Transaksi berhasil diperbarui',
      data: transaction,
    });
  }

  /**
   * PATCH /transactions/:id/cancel
   */
  async cancel(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const adminId = (req as any).admin._id.toString();
    const result = await transactionService.cancel(id, adminId);

    res.status(HTTP_CODE.OK).json({
      success: true,
      ...result,
    });
  }
}

export const transactionController = new TransactionController();
