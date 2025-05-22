import type { Request, Response } from "express";
import { Parser } from "json2csv";
import { logger } from "@utility/logger.js";
import { Company } from "@mongo/models/company.js";
import { CompanyService } from "@services/Company-Service.js";

const companiesControllerLogger = logger("CompaniesController");

const controller: string = 'CompaniesController'
enum EventCompanies {
  COMPANY_DELETED = "company-deleted",
}

export class CompaniesController {
  private companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  showCompany(req: Request, res: Response) {
    res.render("pages/companies/company", {
      name: req.params.name,
      title: "Kompanie",
    });
  }

  // async showCompanies(req: Request, res: Response) {
  //   const { query, sort, countmin, countmax, page } = req.query;
  //   const currentPage = Number.parseInt(page as string, 10) || 1;
  //   const perPage = 2;
  //   const where: any = {};
  //
  //   if (query) {
  //     where.name = {
  //       $regex: query || "",
  //       $options: "i",
  //     };
  //   }
  //
  //   if (countmin || countmax) {
  //     where.employeesCount = {};
  //     if (countmin) {
  //       where.employeesCount.$gte = countmin;
  //     }
  //     if (countmax) {
  //       where.employeesCount.$lte = countmax;
  //     }
  //   }
  //
  //   let q = Company.find(where);
  //   const resultsCount = await Company.countDocuments(where);
  //   const pagesCount = Math.ceil(resultsCount / perPage);
  //
  //   q = q.skip((currentPage - 1) * perPage);
  //   q = q.limit(perPage);
  //
  //   // if (sort && typeof sort === "string") {
  //   //     const s = sort.split('|');
  //   //     q = q.sort({
  //   //         [s[0]]: s[1]
  //   //     });
  //   // }
  //   if (sort && typeof sort === "string") {
  //     const s: string[] = sort.split("|");
  //     if (s.length === 2 && (s[1] === "asc" || s[1] === "desc")) {
  //       q = q.sort({
  //         [s[0]]: s[1],
  //       });
  //     } else {
  //       console.warn("Nieprawidłowa wartość sortowania:", s[1]);
  //     }
  //   }
  //
  //   const companies = await q.populate("user").exec();
  //   res.render("pages/companies/companies", {
  //     companies,
  //     currentPage,
  //     resultsCount,
  //     pagesCount,
  //   });
  // }
  showCompanies = async (req: Request, res: Response) => {
    const { query, sort, countmin, countmax, page } = req.query;

    const currentPage = Number.parseInt(page as string, 10) || 1;
    const perPage = 2;

    const filters = {
      query,
      sort,
      countmin: countmin ? Number(countmin) : undefined,
      countmax: countmax ? Number(countmax) : undefined,
      currentPage,
      perPage,
    };

    const { companies, resultsCount, pagesCount } = await this.companyService.getCompanies(filters);

    res.render("pages/companies/companies", {
      companies,
      currentPage,
      resultsCount,
      pagesCount,
    });
  }

  showCreateCompany(_req: Request, res: Response) {
    res.render("pages/companies/create-company");
  }

  createCompany = async (req: Request, res: Response) => {
    const { name, slug, employeesCount } = req.body;
    const userId = req.session.user._id;

    try {
      await this.companyService.createCompany({
        name,
        slug,
        employeesCount,
        user: userId,
      });
      res.redirect(`/${req.language}/companies`);
    } catch (error: any) {
      res.render("pages/companies/create-company", {
        errors: error.errors,
        form: req.body,
      });
    }
  };

  async showEditCompany(req: Request, res: Response) {
    const { name } = req.params;
    const company = await Company.findOne({
      slug: name,
    });
    res.render("pages/companies/edit-company", {
      form: company,
    });
  }

  editCompany = async (req: Request, res: Response) => {
    const { name } = req.params;
    const { slug, employeesCount } = req.body;
    const userId = req.session.user._id;

    const updateData: any = { name, slug, employeesCount };

    if (req.file?.filename) {
      updateData.image = req.file.filename;
    }

    try {
      await this.companyService.updateCompany(
        name,
        updateData,
        req.file?.filename,
      );
      res.redirect(`/${req.language}/company/${name}`);
    } catch (error: any) {
      res.render("pages/companies/edit-company", {
        errors: error.errors,
        form: req.body,
      });
    }
  };

  deleteCompany = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
      await this.companyService.deleteCompany(name);
      companiesControllerLogger.info("Company Deleted", {
        metadata: {
          ip: req.ip,
          message: "Company deleted",
          email: req.session.user.email,
          controller,
          event: "company-deleted",
        },
      });
      res.redirect(`/${req.language}/companies`);
    } catch (error: any) {
      companiesControllerLogger.error("Company Deleted Failed", {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.session.user.email,
          controller,
          event: EventCompanies.COMPANY_DELETED,
        },
      });
      res.status(500).send("Nie udało się usunąć firmy.");
    }
  };

  deleteImg = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
      await this.companyService.deleteImage(name);
      res.redirect("/company");
    } catch (error: any) {
      res.status(500).send("Nie udało się usunąć obrazu firmy.");
    }
  };

  async getCSV(req: Request, res: Response) {
    const fields = [
      { label: "Name", value: "name" },
      { label: "Slug", value: "slug" },
      { label: "Employees Count", value: "employeesCount" },
    ];

    try {
      const companies = await this.companyService.getAllCompanies();
      console.log(companies);
      const csv = new Parser({ fields }).parse(companies);

      res.header("Content-Type", "text/csv");
      res.header("Content-Disposition", 'attachment; filename="companies.csv"');

      res.send(csv);
    } catch (error: any) {
      res.status(500).send("Nie udało się wygenerować pliku CSV.");
    }
  }
}
