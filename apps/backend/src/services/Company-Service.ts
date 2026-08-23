import fs from "node:fs/promises";
import type { Filters } from "@customTypes/filters";
import { Company, type ICompany } from "@mongo/models/company";
import { BaseService } from "./Base-Service";

export class CompanyService extends BaseService {
  async createCompany(data: Partial<ICompany>) {
    const company = new Company(data);
    return company.save();
  }

  async findCompanyBySlug(slug: string) {
    try {
      return await Company.findOne({ slug }).populate({ path: "user" }).exec();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateCompany(
    slug: string,
    data: Partial<typeof Company>,
    newImage?: string,
  ) {
    const company = await Company.findOne({ slug });
    if (!company) throw new Error("Company not found");

    if (newImage && company.image) {
      await fs.unlink(`public/img/uploads/${company.image}`);
    }
    Object.assign(company, data);
    return await company.save();
  }

  async deleteCompany(slug: string) {
    const company = await Company.findOne({ slug });

    if (company?.image) {
      await fs.unlink(`public/img/uploads/${company.image}`);
    }

    return Company.deleteOne({ slug });
  }

  async deleteImage(slug: string) {
    const company = await Company.findOne({ slug });

    if (!company) throw new Error("Company not found");

    if (company.image) {
      await fs.unlink(`public/img/uploads/${company.image}`);
      company.image = undefined;
      try {
        await company.save();
      } catch (e: any) {
        throw new Error(e);
      }
    }
  }

  async getCompanies(filters: Partial<Filters>) {
    const {
      query,
      sort,
      countMin,
      countMax,
      currentPage = 1,
      perPage = 10,
    } = filters;
    const where: any = {};

    if (query) where.$text = { $search: query };

    if (countMin || countMax) {
      where.employeesCount = {};
      if (countMin) where.employeesCount.$gte = countMin;
      if (countMax) where.employeesCount.$lte = countMax;
    }

    const sortCriteria: Record<string, 1 | -1> = {};
    if (sort && typeof sort === "string") {
      const [field, order] = sort.split("|");
      if (field && (order === "asc" || order === "desc")) {
        sortCriteria[field] = order === "asc" ? 1 : -1;
      }
    }

    const resultsCount = await Company.countDocuments(where);
    const pagesCount = Math.ceil(resultsCount / perPage);
    const companiesAll = await Company.find();
    const companies = await Company.find(where)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort(sortCriteria)
      .populate("user")
      .exec();

    return {
      companies,
      resultsCount,
      pagesCount,
      companiesAll: companiesAll.length,
    };
  }

  async getAllCompanies() {
    return Company.find();
  }
}
