const { ErrorHandler } = require('../../../middleware/error');
const {
  Url,
  Project,
  Translation,
  Language,
  TranslationUrl,
} = require('../../../database/models');

// list
exports.select = async (req, res, next) => {
  try {
    const list = await Url.findAll({
      include: [
        {
          model: Project,
          required: false,
        },
      ],
    });

    const result = list.map((url) => {
      return {
        url_id: url.url_id,
        project_id: url.project_id,
        url: url.url,
        created_at: url.created_at,
        updated_at: url.updated_at,
        project_name: url.Project?.project_name,
        description: url.Project?.description,
      };
    });
    res.success(result);
  } catch (err) {
    next(err);
  }
};

// insert
exports.insert = async (req, res, next) => {
  const data = req.body;
  try {
    const d = await Url.create(data);

    if (data.translations && data.translations.length > 0) {
      const translations = data.translations.map((r) => {
        return {
          url_id: d.url_id,
          translation_id: r,
        };
      });

      await TranslationUrl.bulkCreate(translations);
    }

    res.success(d);
  } catch (err) {
    next(err);
  }
};

// update
exports.update = async (req, res, next) => {
  const data = req.body;
  try {
    const d = await Url.update(data, {
      where: { url_id: req.params.id },
    });

    if (data.translations && data.translations.length > 0) {
      await TranslationUrl.destroy({
        where: { url_id: req.params.id },
      });

      const translations = data.translations.map((r) => {
        return {
          url_id: req.params.id,
          translation_id: r,
        };
      });

      await TranslationUrl.bulkCreate(translations);
    } else if (data.languages && data.languages.length == 0) {
      await TranslationUrl.destroy({
        where: { url_id: req.params.id },
      });
    }

    res.success(d);
  } catch (err) {
    next(err);
  }
};

// delete
exports.delete = async (req, res, next) => {
  try {
    await Url.destroy({
      where: { url_id: req.params.id },
    });
    res.success();
  } catch (err) {
    next(err);
  }
};

// detail
exports.detail = async (req, res, next) => {
  try {
    const d = await Url.findOne({
      include: [
        {
          model: Translation,
          required: false,
          include: [
            {
              model: Language,
              required: true,
            },
          ],
        },
      ],
      where: { url_id: req.params.id },
    });
    if (!d) {
      throw new ErrorHandler(404, 'Data not found');
    }

    const transformedPayload = {
      url_id: d.url_id,
      project_id: d.project_id,
      url: d.url,
      created_at: d.created_at,
      updated_at: d.updated_at,
      Translations: d.Translations.map((translation) => ({
        translation_id: translation.translation_id,
        lang_id: translation.lang_id,
        key: translation.key,
        value: translation.value,
        status: translation.status,
        created_at: translation.created_at,
        updated_at: translation.updated_at,
        lang_code: translation.Language.lang_code,
        lang_name: translation.Language.lang_name,
      })),
    };

    res.success(transformedPayload);
  } catch (err) {
    next(err);
  }
};
