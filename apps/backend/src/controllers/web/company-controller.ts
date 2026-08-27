import {Company, type ICompany} from "@mongo/models/company.js";
import { CompanyService } from "@services/Company-Service.js";
import { logger } from "@utility/logger.js";
import {companyImageUpload, runImageMiddleware} from "@utility/uploader.js";
import type { Request, Response } from "express";
import { Parser } from "json2csv";
import multer from "multer";
import type { Filters } from '@customTypes/filters';

const companiesControllerLogger = logger("CompaniesController");

const controller: string = "CompaniesController";
enum EventCompanies {
  COMPANY_DELETED = "company-deleted",
}

export class CompaniesController {
  private companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  showCompany = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
      const company = await this.companyService.findCompanyBySlug(slug as string);
      res.status(company ? 200 : 404).render("pages/companies/company", {
        company,
        title: "Kompanie",
      });
    } catch (error: any) {
      companiesControllerLogger.error("Show Company Failed", {
        metadata: { ip: req.ip, message: error.message, controller },
      });
      res.locals.errors = { message: error.message };
      return res.status(500).render("pages/companies/companies", { title: "Kompanie" });

    }
  };

  showCompanies = async (req: Request, res: Response) => {
    const { query, sort, countMin, countMax, page } = req.query;
    console.log(query, sort, countMin, countMax, page)

    const currentPage = Number.parseInt(page as string, 10) || 1;

    const filters = {
      query,
      sort,
      countMin: countMin ? Number(countMin) : undefined,
      countMax: countMax ? Number(countMax) : undefined,
      currentPage,
      perPage: 4,
    };

    const { companies, resultsCount, pagesCount, companiesAll } =
      await this.companyService.getCompanies(filters as Partial<Filters>);

    res.render("pages/companies/companies", {
      companies,
      currentPage,
      resultsCount,
      pagesCount,
      companiesAll,
    });
  };

  showCreateCompany(_req: Request, res: Response) {
    res.render("pages/companies/create-company");
  }

  createCompany = async (req: Request, res: Response) => {
    const { name, slug, employeesCount } = req.body;
    const userId = req.session.user.id;

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

    try {
      await runImageMiddleware(companyImageUpload, req, res);

      const { slug, employeesCount } = req.body;
      const updateData: Partial<any> = { name, slug, employeesCount };

      if (req.file?.filename) {
        updateData.image = req.file.filename;
      }

      await this.companyService.updateCompany(
        slug,
        updateData,
        req.file?.filename,
      );
      res.redirect(`/${req.language}/company/${name}`);
    } catch (error: any) {
      const message =
        error instanceof multer.MulterError
          ? error.code === "LIMIT_FILE_SIZE"
            ? "file > 5mb"
            : "error"
          : error.message;

      res.status(400).render("pages/companies/edit-company", {
        errors: error.errors ?? { message },
        form: req.body,
      });
    }
  };

  deleteCompany = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
      await this.companyService.deleteCompany(slug as string);
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
    const { slug } = req.params;

    try {
      await this.companyService.deleteImage(slug as string);
      res.redirect(`/company/${slug}`);
    } catch (_error: any) {
      res.status(500).send("Nie udało się usunąć obrazu firmy.");
    }
  };

  async getCSV(_req: Request, res: Response) {
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
    } catch (_error: any) {
      res.status(500).send("Nie udało się wygenerować pliku CSV.");
    }
  }
}
