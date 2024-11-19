export class PageController {
    home(req, res) {
        res.render('pages/home', {companies: [], title: 'Strona główna', url: req.url});
    }

    notFound(req, res) {
        res.render('pages/404', {title: 'Brak strony', layout: 'layouts/minimalistic'});
    }
}