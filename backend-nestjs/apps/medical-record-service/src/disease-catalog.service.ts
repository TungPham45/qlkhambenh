import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiseaseCatalog } from '@app/database';
import {
  CreateDiseaseDto,
  DiseaseQueryDto,
  DiseaseStatus,
  UpdateDiseaseDto,
} from '@app/common';
import { Repository } from 'typeorm';

@Injectable()
export class DiseaseCatalogService {
  constructor(
    @InjectRepository(DiseaseCatalog)
    private readonly diseaseRepo: Repository<DiseaseCatalog>,
  ) {}

  async getAll(query: DiseaseQueryDto) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query?.limit) || 20));
    const search = String(query?.search || '').trim().toLocaleLowerCase('vi');
    const group = String(query?.group || '').trim();

    const qb = this.diseaseRepo.createQueryBuilder('disease');

    if (search) {
      qb.andWhere(
        '(LOWER(disease.code) LIKE :search OR LOWER(disease.name) LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (group) {
      qb.andWhere('LOWER(disease.group) = LOWER(:group)', { group });
    }

    if (query?.status) {
      qb.andWhere('disease.status = :status', { status: query.status });
    }

    qb.orderBy('disease.code', 'ASC')
      .addOrderBy('disease.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();
    const groups = await this.getGroups();

    return {
      data: rows.map((row) => this.formatDisease(row)),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
      filters: { groups },
    };
  }

  async getById(id: number) {
    const disease = await this.findOneOrFail(id);
    return this.formatDisease(disease);
  }

  async create(dto: CreateDiseaseDto) {
    const code = this.normalizeCode(dto.code);
    const name = dto.name.trim();
    await this.ensureUnique(code, name);

    const disease = this.diseaseRepo.create({
      code,
      name,
      description: this.nullableText(dto.description),
      group: this.nullableText(dto.group),
      status: dto.status || DiseaseStatus.ACTIVE,
    });

    try {
      return this.formatDisease(await this.diseaseRepo.save(disease));
    } catch (error) {
      this.rethrowUniqueViolation(error);
    }
  }

  async update(id: number, dto: UpdateDiseaseDto) {
    const disease = await this.findOneOrFail(id);
    const code = dto.code === undefined ? disease.code : this.normalizeCode(dto.code);
    const name = dto.name === undefined ? disease.name : dto.name.trim();

    await this.ensureUnique(code, name, id);

    disease.code = code;
    disease.name = name;
    if (dto.description !== undefined) {
      disease.description = this.nullableText(dto.description);
    }
    if (dto.group !== undefined) {
      disease.group = this.nullableText(dto.group);
    }
    if (dto.status !== undefined) {
      disease.status = dto.status;
    }

    try {
      return this.formatDisease(await this.diseaseRepo.save(disease));
    } catch (error) {
      this.rethrowUniqueViolation(error);
    }
  }

  async updateStatus(id: number, status: DiseaseStatus) {
    const disease = await this.findOneOrFail(id);
    disease.status = status;
    return this.formatDisease(await this.diseaseRepo.save(disease));
  }

  private async findOneOrFail(id: number) {
    const disease = await this.diseaseRepo.findOne({ where: { id } });
    if (!disease) {
      throw new NotFoundException('Không tìm thấy bệnh trong danh mục');
    }
    return disease;
  }

  private async ensureUnique(code: string, name: string, excludeId?: number) {
    const qb = this.diseaseRepo
      .createQueryBuilder('disease')
      .where(
        '(LOWER(disease.code) = LOWER(:code) OR LOWER(disease.name) = LOWER(:name))',
        { code, name },
      );

    if (excludeId !== undefined) {
      qb.andWhere('disease.id != :excludeId', { excludeId });
    }

    const existing = await qb.getOne();
    if (!existing) return;

    if (existing.code.toLocaleLowerCase('vi') === code.toLocaleLowerCase('vi')) {
      throw new ConflictException('Mã bệnh đã tồn tại');
    }
    throw new ConflictException('Tên bệnh đã tồn tại');
  }

  private async getGroups() {
    const rows = await this.diseaseRepo
      .createQueryBuilder('disease')
      .select('DISTINCT disease.group', 'group')
      .where('disease.group IS NOT NULL')
      .andWhere("TRIM(disease.group) != ''")
      .orderBy('disease.group', 'ASC')
      .getRawMany<{ group: string }>();

    return rows.map((row) => row.group);
  }

  private normalizeCode(value: string) {
    return value.trim().toLocaleUpperCase('vi');
  }

  private nullableText(value?: string) {
    const normalized = String(value || '').trim();
    return normalized || null;
  }

  private rethrowUniqueViolation(error: unknown): never {
    const driverCode = (error as { driverError?: { code?: string } })?.driverError?.code;
    if (driverCode === '23505') {
      throw new ConflictException('Mã bệnh hoặc tên bệnh đã tồn tại');
    }
    throw error;
  }

  private formatDisease(disease: DiseaseCatalog) {
    return {
      id: Number(disease.id),
      code: disease.code,
      name: disease.name,
      description: disease.description,
      group: disease.group,
      status: disease.status,
      createdAt: disease.createdAt,
      updatedAt: disease.updatedAt,
      MaBenh: disease.code,
      TenBenh: disease.name,
      MoTa: disease.description,
      NhomBenh: disease.group,
      TrangThai: disease.status,
    };
  }
}
