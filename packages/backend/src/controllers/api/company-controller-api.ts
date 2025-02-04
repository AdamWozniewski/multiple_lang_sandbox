import fs from "node:fs";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { __dirname } from "@utility/dirname.js";
import { Company } from "@mongo/models/company.js";

export class CompaniesControllerApi {
  async showCompanies(req: Request, res: Response) {
    const companies = await Company.find();
    res.header("content-type", "application/json");
    res.json({ companies });
  }

  async createCompany(req: Request, res: Response) {
    const { name, slug, employeesCount } = req.body;
    const newCompany = new Company({
      name,
      slug,
      employeesCount,
      user: req.user, // od middleware
    });
    try {
      await newCompany.save();
      res.status(201).json(newCompany);
    } catch (e) {
      console.log(e);
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(422).json({ error: e.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async editCompany(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const company = await Company.findOne({
      slug: name,
    });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    if (req.body.name) company.slug = req.body.name;
    if (req.body.slug) company.slug = req.body.slug;
    if (req.body.numberEmployees)
      company.employeesCount = req.body.employeesCount;
    if (req.file?.filename && company.image) {
      await fs.unlink(
        `${__dirname(import.meta.url)}/../../public/img/uploads/${
          company.image
        }`,
        () => {},
      );
    }
    if (req.file?.filename) {
      company.image = req.file.filename;
    }
    try {
      await company?.save();
      res.status(200).json(company);
    } catch (e) {
      console.log(e);
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(422).json({ error: e.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async deleteCompany(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const company = await Company.findOne({ slug });
      if (company?.image) {
        try {
          fs.unlinkSync(
            `${__dirname(import.meta.url)}/public/img/${company?.image}`,
          );
        } catch (e) {
          if (e instanceof mongoose.Error.ValidationError) {
            res.status(422).json({
              error: `Błąd podczas usuwania pliku obrazu: ${e?.message}`,
            });
          } else {
            res.status(500).json({ message: "Internal server error" });
          }
        }
      }
      await Company.deleteOne({ slug: company?.name });
      res.status(204).send();
    } catch (e) {
      console.log(e);
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(422).json({ error: e.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}
