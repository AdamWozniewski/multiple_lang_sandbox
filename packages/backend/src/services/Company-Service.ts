import fs from "node:fs/promises";
import { Company } from "@mongo/models/company";
import { BaseService } from "./Base-Service";
// import { Filters } from '@customTypes/filters.js';

export class CompanyService extends BaseService {
  async createCompany(data: Partial<typeof Company>) {
    const company = new Company(data);
    return company.save();
  }

  async findCompanyBySlug(slug: string) {
    return Company.findOne({ slug });
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
      await company.save();
    }
  }

  async getCompanies(filters: any) {
    const {
      query,
      sort,
      countmin,
      countmax,
      currentPage = 1,
      perPage = 10,
    } = filters;
    const where: any = {};

    if (query) {
      where.name = { $regex: query, $options: "i" };
    }

    if (countmin || countmax) {
      where.employeesCount = {};
      if (countmin) where.employeesCount.$gte = countmin;
      if (countmax) where.employeesCount.$lte = countmax;
    }

    let sortCriteria: Record<string, 1 | -1> = {};
    if (sort && typeof sort === "string") {
      const [field, order] = sort.split("|");
      if (field && (order === "asc" || order === "desc")) {
        sortCriteria[field] = order === "asc" ? 1 : -1;
      }
    }

    const resultsCount = await Company.countDocuments(where);
    const pagesCount = Math.ceil(resultsCount / perPage);
    const companies = await Company.find(where)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort(sortCriteria)
      .populate("user")
      .exec();

    return { companies, resultsCount, pagesCount };
  }

  async getAllCompanies() {
    return Company.find();
  }
}
