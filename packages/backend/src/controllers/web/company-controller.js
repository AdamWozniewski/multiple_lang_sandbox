import {Company} from "../../db/models/company.js";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {Parser} from "json2csv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class CompaniesController {
    showCompany(req, res) {
        res.render('pages/companies/company', {name: req.params.name, title: 'Kompanie'});
    }

    async showCompanies(req, res) {
        const {query, sort, countmin, countmax, page} = req.query;
        const currentPage = page || 1;
        const perPage = 2;
        const where = {};

        // Wyszukiwanie
        if (query) {
            where.name = {
                $regex: query || '', $options: "i" // nie zwracaj uwagi na rozmiar liter
            }
        }

        // Filtrowanie
        if (countmin || countmax) {
            where.employeesCount = {};
            if (countmin) {
                where.employeesCount.$gte = countmin
            }
            if (countmax) {
                where.employeesCount.$lte = countmax
            }
        }

        let q = Company.find(where);
        const resultsCount = await Company.countDocuments(where);
        const pagesCount = Math.ceil(resultsCount / perPage);

        // Paginacja
        q = q.skip((currentPage - 1) * perPage);
        q = q.limit(perPage);

        // Sortowanie
        if (sort) {
            const s = sort.split('|');
            q = q.sort({
                [s[0]]: s[1]
            });
        }

        // Exec
        const companies = await q.populate('user').exec();

        res.render('pages/companies/companies', {
            companies, currentPage,
            resultsCount, pagesCount
        });
    }

    showCreateCompany(req, res) {
        res.render('pages/companies/create-company');
    }

    async createCompany(req, res) {
        const {name, slug, employeesCount} = req.body;
        const newCompany = new Company({
            name, slug, employeesCount, user: req.session.user._id
        });
        try {
            await newCompany.save();
            res.redirect('/company');
        } catch (e) {
            console.log(e)
            res.render('pages/companies/create-company', {errors: e.errors, form: req.body});
        }
    }

    async showEditCompany(req, res) {
        const {name} = req.params
        const company = await Company.findOne({
            slug: name
        })
        res.render('pages/companies/edit-company', {
            form: company
        });
    }

    async editCompany(req, res) {
        const {name} = req.params
        const company = await Company.findOne({
            slug: name
        });
        company.name = req.body.name;
        company.slug = req.body.slug;
        company.numberEmployees = req.body.employeesCount;
        if (req.file.filename && company.image) {
            await fs.unlink(`${__dirname}/../../public/img/uploads/${company.image}`, () => {});
        }
        if (req.file.filename) {
            company.image = req.file.filename;
        }
        try {
            await company.save();
            res.redirect('/company');
        } catch (e) {
            res.render('pages/companies/edit-company', {errors: e.errors, form: req.body});
        }
    }

    async deleteCompany(req, res) {
        const {name} = req.params
        try {
            const company = await Company.findOne({ slug: name });
            if (company.image) {
                try {
                    fs.unlinkSync(`${__dirname}/public/img/${company.image}`);
                } catch (err) {
                    console.error(`Błąd podczas usuwania pliku obrazu: ${err.message}`);
                }

            }
            await Company.deleteOne({slug: name})
            res.redirect('/company');
        } catch (e) {
            res.render('pages/companies', {errors: e.errors});
        }
    }

    async deleteImg(req, res) {
        const {name} = req.params
        const company = await Company.findOne({slug: name});
        try {
            await fs.unlink(`${__dirname}/public/img/uploads/${company.image}`, () => {
                console.log('ok')
            });
            company.image = '';
            company.save();
            res.redirect('/company');
        } catch (e) {
            res.render('pages/companies/edit-company', {errors: e.errors});
        }
    }

    async getCSV(req, res) {
        const fields = [
            {
                label: 'Nazwa',
                value: 'name'
            }, {
                label: 'URL',
                value: 'slug'
            }, {
                label: 'Liczba pracowników',
                value: 'employeesCount'
            },
        ]
        const data = await Company.find();
        const fileName = 'companies.csv'
        const json2csv = new Parser({ fields });
        try {
            const csv = json2csv.parse(data);

            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', `attachment; filename="${fileName}"`);
            res.send(csv);
        } catch (error) {
            console.error('Błąd generowania CSV:', error);
            res.status(500).send('Nie udało się wygenerować pliku CSV.');
        }
    }
}
