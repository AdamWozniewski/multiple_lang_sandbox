import fs from "node:fs/promises";
import { Company } from "@mongo/models/company.js";
import { BaseService } from './Base-Service.js';

export class CompanyService extends BaseService {
  async createCompany(data: Partial<typeof Company>) {
    const company = new Company(data);
    return company.save();
  }

  async findCompanyBySlug(slug: string) {
    return Company.findOne({ slug });
  }

  async updateCompany(slug: string, data: Partial<typeof Company>, newImage?: string) {
    const company = await Company.findOne({ slug });
    if (!company) throw new Error("Company not found");

    if (newImage && company.image) {
      await fs.unlink(`public/img/uploads/${company.image}`);
    }
    console.log(data);
    Object.assign(company, data);
    console.log(Object.assign(company, data));
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
    const { query, sort, countmin, countmax, currentPage, perPage } = filters;
    const where: any = {};

    if (query) where.name = { $regex: query, $options: "i" };
    if (countmin || countmax) {
      where.employeesCount = {};
      if (countmin) where.employeesCount.$gte = countmin;
      if (countmax) where.employeesCount.$lte = countmax;
    }

    const resultsCount = await Company.countDocuments(where);
    const pagesCount = Math.ceil(resultsCount / perPage);
    const companies = await Company.find(where)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort(sort ? { [sort.split("|")[0]]: sort.split("|")[1] } : {})
      .populate("user")
      .exec();

    return { companies, resultsCount, pagesCount };
  }

  async getAllCompanies() {
    return Company.find();
  }
}
