import fs from "fs";
import { Parser } from "json2csv";
import { Request, Response } from "express";
import { Company } from "@mongo/models/company.js";
import { __dirname } from "../../services/dirname.js";
import { logger } from "../../services/logger.js";

export class CompaniesController {
  showCompany(req: Request, res: Response) {
    res.render("pages/companies/company", { name: req.params.name, title: "Kompanie" });
  }

  async showCompanies(req: Request, res: Response) {
    const { query, sort, countmin, countmax, page } = req.query;
    const currentPage = parseInt(page as string, 10) || 1;
    const perPage = 2;
    const where: any = {};

    // Wyszukiwanie
    if (query) {
      where.name = {
        $regex: query || "", $options: "i" // nie zwracaj uwagi na rozmiar liter
      };
    }

    // Filtrowanie
    if (countmin || countmax) {
      where.employeesCount = {};
      if (countmin) {
        where.employeesCount.$gte = countmin;
      }
      if (countmax) {
        where.employeesCount.$lte = countmax;
      }
    }

    let q = Company.find(where);
    const resultsCount = await Company.countDocuments(where);
    const pagesCount = Math.ceil(resultsCount / perPage);

    // Paginacja
    q = q.skip((currentPage - 1) * perPage);
    q = q.limit(perPage);

    // Sortowanie
    // if (sort && typeof sort === "string") {
    //     const s = sort.split('|');
    //     q = q.sort({
    //         [s[0]]: s[1]
    //     });
    // }
    if (sort && typeof sort === "string") {
      const s = sort.split("|");
      if (s.length === 2 && (s[1] === "asc" || s[1] === "desc")) {
        q = q.sort({
          [s[0]]: s[1]
        });
      } else {
        console.warn("Nieprawidłowa wartość sortowania:", s[1]);
      }
    }

    // Exec
    const companies = await q.populate("user").exec();

    res.render("pages/companies/companies", {
      companies, currentPage,
      resultsCount, pagesCount
    });
  }

  showCreateCompany(req: Request, res: Response) {
    res.render("pages/companies/create-company");
  }

  async createCompany(req: Request, res: Response) {
    const { name, slug, employeesCount } = req.body;
    const newCompany = new Company({
      name, slug, employeesCount, user: req.session.user._id
    });
    try {
      await newCompany.save();
      logger.info("createCompany", { userId: req.session.userId });
      res.redirect("/company");
    } catch (error: any) {
      logger.error("Error createCompany", {
        userId: req.session.userId,
        stack: error.stack
      });
      res.render("pages/companies/create-company", { errors: error.errors, form: req.body });
    }
  }

  async showEditCompany(req: Request, res: Response) {
    const { name } = req.params;
    const company = await Company.findOne({
      slug: name
    });
    res.render("pages/companies/edit-company", {
      form: company
    });
  }

  async editCompany(req: Request, res: Response) {
    const { name } = req.params;
    const company = await Company.findOne({
      slug: name
    });
    company!.name = req.body.name;
    company!.slug = req.body.slug;
    company!.employeesCount = req.body.employeesCount;
    if (req.file?.filename && company!.image) {
      await fs.unlink(`${__dirname(import.meta.url)}/../../public/img/uploads/${company!.image}`, () => {
      });
    }
    if (req.file?.filename) {
      company!.image = req.file.filename;
    }
    try {
      await company!.save();
      logger.info("editCompany", { userId: req.session.userId, ip: req.body.ip });
      res.redirect("/company");
    } catch (error: any) {
      logger.error("Error editCompany", {
        userId: req.session.userId, ip: req.body.ip,
        stack: error.stack
      });
      res.render("pages/companies/edit-company", { errors: error.errors, form: req.body });
    }
  }

  async deleteCompany(req: Request, res: Response) {
    const { name } = req.params;
    try {
      const company = await Company.findOne({ slug: name });
      if (company!.image) {
        try {
          fs.unlinkSync(`${__dirname(import.meta.url)}/public/img/${company!.image}`);
          logger.info("deleteCompany - delete image", { userId: req.session.userId, ip: req.body.ip });
        } catch (error: any) {
          logger.error("Error deleteCompany - delete image", {
            userId: req.session.userId, ip: req.body.ip,
            stack: error.stack
          });
        }

      }
      await Company.deleteOne({ slug: name });
      logger.info("deleteCompany", { userId: req.session.userId, ip: req.body.ip });
      res.redirect("/company");
    } catch (error: any) {
      logger.error("Error deleteCompany", {
        userId: req.session.userId,
        ip: req.body.ip,
        stack: error.stack
      });
      res.render("pages/companies", { errors: error.errors });
    }
  }

  async deleteImg(req: Request, res: Response) {
    const { name } = req.params;
    const company = await Company.findOne({ slug: name });
    try {
      await fs.unlink(`${__dirname(import.meta.url)}/public/img/uploads/${company!.image}`, () => {
        console.log("ok");
      });
      company!.image = "";
      company!.save();
      logger.info("deleteImg", { userId: req.session.userId, ip: req.body.ip });
      res.redirect("/company");
    } catch (error: any) {
      logger.error("Error deleteImg", {
        userId: req.session.userId,
        ip: req.body.ip,
        stack: error.stack
      });
      res.render("pages/companies/edit-company", { errors: error?.errors });
    }
  }

  async getCSV(req: Request, res: Response) {
    const fields = [
      {
        label: "Nazwa",
        value: "name"
      }, {
        label: "URL",
        value: "slug"
      }, {
        label: "Liczba pracowników",
        value: "employeesCount"
      }
    ];
    const data = await Company.find();
    const fileName = "companies.csv";
    const json2csv = new Parser({ fields });
    try {
      const csv = json2csv.parse(data);

      res.header("Content-Type", "text/csv");
      res.header("Content-Disposition", `attachment; filename="${fileName}"`);
      logger.info("getCSV", { userId: req.session.userId, ip: req.body.ip });
      res.send(csv);
    } catch (error: any) {
      logger.error("Error getCSV", {
        userId: req.session.userId,
        ip: req.body.ip,
        stack: error.stack
      });
      res.status(500).send("Nie udało się wygenerować pliku CSV.");
    }
  }
}