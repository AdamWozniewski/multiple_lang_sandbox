import type { Request, Response, NextFunction } from "express";
import type { ViteDevServer } from "vite";
import { minify } from "html-minifier-terser";

export default function htmlTransformMiddleware(vite?: ViteDevServer) {
  const isDev = Boolean(vite);

  return (req: Request, res: Response, next: NextFunction) => {
    const _render = res.render.bind(res);

    res.render = async (view: string, options: object = {}) => {
      try {
        const html = await new Promise<string>((resolve, reject) => {
          _render(view, options, (err, str) =>
            err ? reject(err) : resolve(str),
          );
        });

        const output =
          isDev && vite
            ? await vite.transformIndexHtml(req.url, html)
            : await minify(html, {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true,
              });

        return res.send(output);
      } catch (err) {
        return next(err);
      }
    };

    next();
  };
}
