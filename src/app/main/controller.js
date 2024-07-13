const { ErrorHandler } = require('../../middleware/error');
const {
  Language,
  Url,
  Translation,
  Project,
  sequelize,
} = require('../../database/models');

// list
exports.select = async (req, res, next) => {
  const { project_id, lang_code, url } = req.query;
  try {
    if (!project_id || !lang_code || !url) {
      throw new ErrorHandler(500, 'project_id, lang_code, url are needed');
    }
    const query = `
      select
        t.key,
        t.value
      from
        translations t
      join languages l on
        t.lang_id = l.lang_id
      join project_languages pl on
        l.lang_id = pl.lang_id
      join projects p on
        pl.project_id = p.project_id
      join urls u on
        p.project_id = u.project_id
      join translation_urls tu on
        t.translation_id = tu.translation_id
        and tu.url_id = u.url_id
      where
        p.project_id = :project_id
        and u.url = :url
        and l.lang_code = :lang_code
        and t.status = 'active';
    `;
    const translations = await sequelize.query(query, {
      replacements: { project_id, lang_code, url },
      type: sequelize.QueryTypes.SELECT,
    });
    res.success(translations);
    // const translations = await Translation.findAll({
    //   include: [
    //     {
    //       model: Language,
    //       where: { lang_code },
    //     },
    //     {
    //       model: Url,
    //       where: { url },
    //       include: [
    //         {
    //           model: Project,
    //           where: { project_id },
    //         },
    //       ],
    //     },
    //   ],
    //   where: { status: 'active' },
    // });
    // const query = `
    //   SELECT
    //       t.key,
    //       t.value
    //   FROM
    //       projects p
    //   JOIN
    //       project_languages pl ON p.project_id = pl.project_id
    //   JOIN
    //       languages l ON pl.lang_id = l.lang_id
    //   JOIN
    //       translations t ON l.lang_id = t.lang_id
    //   JOIN
    //       translation_urls tu ON t.translation_id = tu.translation_id
    //   JOIN
    //       urls u ON tu.url_id = u.url_id
    //   WHERE
    //       u.project_id = :project_id
    //       AND u.url = :url
    //       AND l.lang_code = :lang_code
    //       AND t.status = 'active';
    // `;
  } catch (err) {
    next(err);
  }
};
