import { PrismaPoliciesRepository } from '@/repositories/prisma/prisma-policies-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found-error';
import { ExportPolicyPdfUseCase } from '@/use-cases/scrape/export-policy-pdf';
import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestError } from 'openai';
import { z } from 'zod';

export async function exportPolicyPdf(req: FastifyRequest, res: FastifyReply) {
  const ParamsSchema = z.object({
    slug: z.string({ invalid_type_error: 'Slug da política inválida.' }),
  });

  const { slug } = ParamsSchema.parse(req.params);

  const policyRepository = new PrismaPoliciesRepository();
  const exportPolicyPdfUseCase = new ExportPolicyPdfUseCase(policyRepository);

  try {
    const { pdfBuffer } = await exportPolicyPdfUseCase.execute({ slug });

    return res
      .status(200)
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `inline; filename="${slug}.pdf"`)
      .send(pdfBuffer);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).send({ message: error.message });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).send({ message: error.message });
    }

    throw error;
  }
}
