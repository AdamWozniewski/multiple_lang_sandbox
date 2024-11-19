import path from "path";
import {fileURLToPath} from "url";
import {Company} from "../../db/models/company.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class CompaniesControllerApi {
    async showCompanies(req, res) {
        const companies = await Company.find();
        res.header('content-type', 'application/json');
        res.json({ companies })
    }

    async createCompany(req, res) {
        const {name, slug, employeesCount} = req.body;
        const newCompany = new Company({
            name, slug, employeesCount, user: req.user // od middleware
        });
        try {
            await newCompany.save();
            res.status(201).json(newCompany)
        } catch (e) {
            console.log(e)
            res.status(422).json({error: e.errors})
        }
    }

    async editCompany(req, res) {
        const {name} = req.params
        const company = await Company.findOne({
            slug: name
        });
        if (req.body.name) company.slug = req.body.name;
        if (req.body.slug) company.slug = req.body.slug;
        if (req.body.numberEmployees) company.numberEmployees = req.body.employeesCount;
        if (req.file.filename && company.image) {
            await fs.unlink(`${__dirname}/../../public/img/uploads/${company.image}`, () => {});
        }
        if (req.file.filename) {
            company.image = req.file.filename;
        }
        try {
            await company.save();
            res.status(200).json(company)
        } catch (e) {
            res.status(422).json({error: e.errors})
        }
    }

    async deleteCompany(req, res) {
        const { slug } = req.params
        try {
            const company = await Company.findOne({ slug });
            if (company.image) {
                try {
                    fs.unlinkSync(`${__dirname}/public/img/${company.image}`);
                } catch (err) {
                    console.error(`Błąd podczas usuwania pliku obrazu: ${err.message}`);
                }
            }
            await Company.deleteOne({slug: name})
            res.status(204).send();
        } catch (e) {
            res.status(422).json({error: e.errors})
        }
    }
}
